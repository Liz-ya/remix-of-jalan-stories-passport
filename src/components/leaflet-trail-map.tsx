import { useEffect, useRef, useState } from "react";
import type { Map as LMap, Marker, CircleMarker } from "leaflet";
import { STOPS, type Stop } from "@/lib/trail-data";
import { Locate, Navigation, X } from "lucide-react";

// Compass features require HTTPS (Geolocation + DeviceOrientation).

type Props = {
  onSelect: (stop: Stop) => void;
  visits: Set<number>;
  targetStop?: Stop | null;
  suppressed?: boolean; // when true, hide map controls (e.g. QR scanner is open)
  className?: string;
};

type CompassState = {
  active: boolean;
  target: Stop | null;
  userLat: number | null;
  userLng: number | null;
  heading: number | null; // device heading (deg from north)
  bearing: number | null; // bearing user→target
  distance: number | null; // metres
  error: string | null;
  hasCompass: boolean;
};

const INITIAL_COMPASS: CompassState = {
  active: false,
  target: null,
  userLat: null,
  userLng: null,
  heading: null,
  bearing: null,
  distance: null,
  error: null,
  hasCompass: false,
};

function toRad(d: number) {
  return (d * Math.PI) / 180;
}
function toDeg(r: number) {
  return (r * 180) / Math.PI;
}

function haversine(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371000;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

function bearingBetween(lat1: number, lng1: number, lat2: number, lng2: number) {
  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δλ = toRad(lng2 - lng1);
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

export function LeafletTrailMap({ onSelect, visits, targetStop, suppressed, className }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LMap | null>(null);
  const markersRef = useRef<Marker[]>([]);
  const userDotRef = useRef<CircleMarker | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const orientationHandlerRef = useRef<((e: DeviceOrientationEvent) => void) | null>(null);
  const smoothedHeadingRef = useRef<number | null>(null);
  const [locating, setLocating] = useState(false);
  const [compass, setCompass] = useState<CompassState>(INITIAL_COMPASS);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !containerRef.current || mapRef.current) return;

      const map = L.map(containerRef.current, {
        zoomControl: false,
      });
      mapRef.current = map;

      L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        maxZoom: 20,
        attribution:
          '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      }).addTo(map);

      L.control.zoom({ position: "bottomright" }).addTo(map);

      STOPS.forEach((stop) => {
        const visited = visits.has(stop.id);
        const icon = L.divIcon({
          className: "jalan-marker",
          html: `<div class="jalan-marker-inner${visited ? " visited" : ""}">${stop.id}</div>`,
          iconSize: [44, 44],
          iconAnchor: [22, 22],
        });
        const m = L.marker([stop.lat, stop.lng], { icon })
          .addTo(map)
          .on("click", () => onSelect(stop))
          .bindPopup(
            `<strong>${stop.id}. ${stop.name}</strong><br/><span style="font-size:11px;color:#666">${stop.location}</span>`,
          );
        markersRef.current.push(m);
      });

      // Fit bounds to all markers with ~15% padding
      const bounds = L.latLngBounds(STOPS.map((s) => [s.lat, s.lng] as [number, number]));
      map.fitBounds(bounds, { padding: [40, 40] });
    })();

    return () => {
      cancelled = true;
      stopCompass();
      mapRef.current?.remove();
      mapRef.current = null;
      markersRef.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update marker visited state
  useEffect(() => {
    (async () => {
      const L = (await import("leaflet")).default;
      const map = mapRef.current;
      if (!map) return;
      markersRef.current.forEach((m, i) => {
        const stop = STOPS[i];
        const visited = visits.has(stop.id);
        m.setIcon(
          L.divIcon({
            className: "jalan-marker",
            html: `<div class="jalan-marker-inner${visited ? " visited" : ""}">${stop.id}</div>`,
            iconSize: [44, 44],
            iconAnchor: [22, 22],
          }),
        );
      });
    })();
  }, [visits]);

  function pickNearestStop(lat: number, lng: number): Stop {
    let best = STOPS[0];
    let bestD = Infinity;
    for (const s of STOPS) {
      const d = haversine(lat, lng, s.lat, s.lng);
      if (d < bestD) {
        bestD = d;
        best = s;
      }
    }
    return best;
  }

  function stopCompass() {
    if (watchIdRef.current != null && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    if (orientationHandlerRef.current) {
      window.removeEventListener(
        "deviceorientationabsolute",
        orientationHandlerRef.current as EventListener,
      );
      window.removeEventListener(
        "deviceorientation",
        orientationHandlerRef.current as EventListener,
      );
      orientationHandlerRef.current = null;
    }
    smoothedHeadingRef.current = null;
  }

  function shortestAngleLerp(prev: number | null, next: number, factor = 0.25) {
    if (prev == null) return next;
    let diff = next - prev;
    while (diff > 180) diff -= 360;
    while (diff < -180) diff += 360;
    return (prev + diff * factor + 360) % 360;
  }

  async function locateMe() {
    if (!navigator.geolocation) {
      setCompass({
        ...INITIAL_COMPASS,
        active: true,
        error: "Geolocation is not supported on this device.",
      });
      return;
    }
    setLocating(true);

    // Ask for orientation permission INSIDE the tap handler (iOS requirement).
    let hasCompass = false;
    type IOSOrientation = { requestPermission?: () => Promise<"granted" | "denied"> };
    const DOE = (typeof DeviceOrientationEvent !== "undefined" ? DeviceOrientationEvent : null) as
      | (typeof DeviceOrientationEvent & IOSOrientation)
      | null;
    try {
      if (DOE && typeof DOE.requestPermission === "function") {
        const res = await DOE.requestPermission();
        hasCompass = res === "granted";
      } else if (typeof window !== "undefined" && "DeviceOrientationEvent" in window) {
        hasCompass = true;
      }
    } catch {
      hasCompass = false;
    }

    const handleOrientation = (event: DeviceOrientationEvent) => {
      type WebkitOrientation = DeviceOrientationEvent & { webkitCompassHeading?: number };
      const wk = (event as WebkitOrientation).webkitCompassHeading;
      let heading: number | null = null;
      if (typeof wk === "number") heading = wk;
      else if (typeof event.alpha === "number") heading = (360 - event.alpha) % 360;
      if (heading == null) return;
      smoothedHeadingRef.current = shortestAngleLerp(smoothedHeadingRef.current, heading);
      setCompass((c) => ({ ...c, heading: smoothedHeadingRef.current, hasCompass: true }));
    };

    if (hasCompass) {
      orientationHandlerRef.current = handleOrientation;
      window.addEventListener("deviceorientationabsolute", handleOrientation as EventListener);
      window.addEventListener("deviceorientation", handleOrientation as EventListener);
    }

    // Start watching position
    const L = (await import("leaflet")).default;
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const map = mapRef.current;
        if (map) {
          if (userDotRef.current) {
            userDotRef.current.setLatLng([latitude, longitude]);
          } else {
            userDotRef.current = L.circleMarker([latitude, longitude], {
              radius: 9,
              color: "#ffffff",
              weight: 3,
              fillColor: "#2A7FFF",
              fillOpacity: 1,
            }).addTo(map);
            map.setView([latitude, longitude], 17, { animate: true });
          }
        }
        setCompass((prev) => {
          const target = prev.target ?? targetStop ?? pickNearestStop(latitude, longitude);
          const bearing = bearingBetween(latitude, longitude, target.lat, target.lng);
          const distance = haversine(latitude, longitude, target.lat, target.lng);
          return {
            ...prev,
            active: true,
            target,
            userLat: latitude,
            userLng: longitude,
            bearing,
            distance,
            hasCompass: prev.hasCompass || hasCompass,
            error: null,
          };
        });
        setLocating(false);
      },
      (err) => {
        setLocating(false);
        const msg =
          err.code === err.PERMISSION_DENIED
            ? "Location permission denied. Enable it in your browser settings to use the compass."
            : "Couldn't get your location. Please try again outdoors.";
        setCompass({ ...INITIAL_COMPASS, active: true, error: msg, hasCompass });
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 15000 },
    );
  }

  function closeCompass() {
    stopCompass();
    setCompass(INITIAL_COMPASS);
  }

  const rotation =
    compass.bearing != null && compass.heading != null
      ? compass.bearing - compass.heading
      : (compass.bearing ?? 0);

  return (
    <div className={"relative " + (className ?? "")} style={{ zIndex: 0 }}>
      <div
        ref={containerRef}
        className="h-full w-full rounded-2xl overflow-hidden"
        style={suppressed ? { pointerEvents: "none" } : undefined}
      />

      {!suppressed && (
        <button
          onClick={locateMe}
          className="absolute right-3 top-3 z-[30] inline-flex min-h-11 min-w-11 items-center gap-2 rounded-full border border-gold/60 bg-background/90 px-3 py-2 text-xs text-cream shadow-deep backdrop-blur hover:bg-background"
          aria-label="Locate me"
        >
          <Locate className={`h-4 w-4 text-gold ${locating ? "animate-pulse" : ""}`} />
          {locating ? "Locating..." : "Locate Me"}
        </button>
      )}

      {compass.active && !suppressed && (
        <div className="pointer-events-none absolute inset-x-3 bottom-16 z-[30] flex justify-center sm:justify-end">
          <div className="pointer-events-auto w-full max-w-xs rounded-2xl border border-gold/40 bg-background/95 p-4 text-cream shadow-deep backdrop-blur">
            <div className="mb-2 flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="text-[10px] uppercase tracking-[0.25em] text-gold">Compass</div>
                <div className="truncate font-serif text-sm">
                  {compass.target ? `→ ${compass.target.name}` : "Finding target…"}
                </div>
              </div>
              <button
                aria-label="Close compass"
                onClick={closeCompass}
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/5 text-cream/80 hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {compass.error ? (
              <p className="text-xs text-muted-foreground">{compass.error}</p>
            ) : (
              <div className="flex items-center gap-3">
                <div className="relative grid h-20 w-20 shrink-0 place-items-center rounded-full border border-gold/40 bg-black/40">
                  {compass.hasCompass && compass.heading != null ? (
                    <Navigation
                      className="h-10 w-10 text-gold transition-transform duration-300 ease-out"
                      style={{ transform: `rotate(${rotation}deg)` }}
                    />
                  ) : compass.bearing != null ? (
                    <div className="text-center text-[10px] leading-tight text-sand/90">
                      <div>
                        Compass
                        <br />
                        unavailable
                      </div>
                      <div className="mt-1 text-gold">{Math.round(compass.bearing)}° from N</div>
                    </div>
                  ) : (
                    <div className="text-[10px] text-muted-foreground">Locating…</div>
                  )}
                </div>
                <div className="min-w-0 text-sm">
                  {compass.distance != null ? (
                    <>
                      <div className="font-serif text-2xl text-gold">
                        {compass.distance < 1000
                          ? `${Math.round(compass.distance)} m`
                          : `${(compass.distance / 1000).toFixed(2)} km`}
                      </div>
                      {compass.distance < 20 ? (
                        <div className="text-xs text-cream">You've arrived 🎉</div>
                      ) : (
                        <div className="text-xs text-muted-foreground">
                          {compass.hasCompass
                            ? "Follow the arrow"
                            : "Head toward the bearing shown"}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-xs text-muted-foreground">Waiting for GPS fix…</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
