import { useEffect, useRef, useState } from "react";
import type { Map as LMap, Marker, Polyline, CircleMarker } from "leaflet";
import { STOPS, MAP_CENTER, MAP_ZOOM, type Stop } from "@/lib/trail-data";
import { Locate } from "lucide-react";

type Props = {
  onSelect: (stop: Stop) => void;
  visits: Set<number>;
  className?: string;
};

export function LeafletTrailMap({ onSelect, visits, className }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LMap | null>(null);
  const markersRef = useRef<Marker[]>([]);
  const userDotRef = useRef<CircleMarker | null>(null);
  const polylineRef = useRef<Polyline | null>(null);
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !containerRef.current || mapRef.current) return;

      const map = L.map(containerRef.current, {
        center: MAP_CENTER,
        zoom: MAP_ZOOM,
        zoomControl: false,
      });
      mapRef.current = map;

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        {
          maxZoom: 20,
          attribution:
            '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        },
      ).addTo(map);

      L.control.zoom({ position: "bottomright" }).addTo(map);

      // Polyline connecting stops in order
      const line = L.polyline(
        STOPS.map((s) => [s.lat, s.lng] as [number, number]),
        {
          color: "#D4A017",
          weight: 3,
          dashArray: "6 8",
          opacity: 0.9,
        },
      ).addTo(map);
      polylineRef.current = line;

      // Markers
      STOPS.forEach((stop) => {
        const visited = visits.has(stop.id);
        const icon = L.divIcon({
          className: "jalan-marker",
          html: `<div class="jalan-marker-inner${visited ? " visited" : ""}">${stop.id}</div>`,
          iconSize: [40, 40],
          iconAnchor: [20, 20],
        });
        const m = L.marker([stop.lat, stop.lng], { icon })
          .addTo(map)
          .on("click", () => onSelect(stop));
        markersRef.current.push(m);
      });
    })();

    return () => {
      cancelled = true;
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
            iconSize: [40, 40],
            iconAnchor: [20, 20],
          }),
        );
      });
    })();
  }, [visits]);

  async function locateMe() {
    if (!navigator.geolocation) return;
    setLocating(true);
    const L = (await import("leaflet")).default;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const map = mapRef.current;
        if (!map) return;
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
        }
        map.setView([latitude, longitude], 17, { animate: true });
        setLocating(false);
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  return (
    <div className={"relative " + (className ?? "")}>
      <div ref={containerRef} className="h-full w-full rounded-2xl overflow-hidden" />
      <button
        onClick={locateMe}
        className="absolute right-3 top-3 z-[1000] inline-flex items-center gap-2 rounded-full border border-gold/60 bg-background/90 px-3 py-2 text-xs text-cream shadow-deep backdrop-blur hover:bg-background"
        aria-label="Locate me"
      >
        <Locate className={`h-4 w-4 text-gold ${locating ? "animate-pulse" : ""}`} />
        {locating ? "Locating..." : "Locate Me"}
      </button>
    </div>
  );
}
