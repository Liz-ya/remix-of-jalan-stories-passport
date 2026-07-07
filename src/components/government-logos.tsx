type LogoProps = { className?: string };

const box = "w-full h-auto max-w-[100px]";

export function URALogo({ className }: LogoProps) {
  return (
    <svg viewBox="0 0 120 48" className={className ?? box} xmlns="http://www.w3.org/2000/svg" role="img" aria-label="URA">
      <rect width="120" height="48" fill="#E63F24" rx="3" />
      <g fill="#fff">
        <rect x="10" y="26" width="3" height="8" />
        <rect x="15" y="20" width="3" height="14" />
        <rect x="20" y="24" width="3" height="10" />
      </g>
      <text x="68" y="22" textAnchor="middle" fill="#fff" fontFamily="Arial, sans-serif" fontSize="18" fontWeight="700" letterSpacing="2">URA</text>
      <text x="68" y="32" textAnchor="middle" fill="#fff" fontFamily="Arial, sans-serif" fontSize="7" letterSpacing="1">Urban Redevelopment</text>
      <text x="68" y="40" textAnchor="middle" fill="#fff" fontFamily="Arial, sans-serif" fontSize="7" letterSpacing="1">Authority</text>
    </svg>
  );
}

export function NHBLogo({ className }: LogoProps) {
  return (
    <svg viewBox="0 0 120 48" className={className ?? box} xmlns="http://www.w3.org/2000/svg" role="img" aria-label="NHB">
      <rect width="120" height="48" fill="#003B71" rx="3" />
      <path d="M50 8 L50 14 A10 10 0 0 1 70 14 L70 8" fill="none" stroke="#fff" strokeWidth="1.5" />
      <text x="60" y="28" textAnchor="middle" fill="#fff" fontFamily="Arial, sans-serif" fontSize="14" fontWeight="700" letterSpacing="2">NHB</text>
      <rect x="40" y="32" width="40" height="1" fill="#fff" />
      <text x="60" y="42" textAnchor="middle" fill="#fff" fontFamily="Arial, sans-serif" fontSize="7" letterSpacing="0.5">National Heritage Board</text>
    </svg>
  );
}

export function STBLogo({ className }: LogoProps) {
  return (
    <svg viewBox="0 0 120 48" className={className ?? box} xmlns="http://www.w3.org/2000/svg" role="img" aria-label="STB">
      <rect width="120" height="48" fill="#E4002B" rx="3" />
      <g stroke="#fff" strokeWidth="1" fill="none">
        <circle cx="60" cy="12" r="4" fill="#fff" />
        <line x1="60" y1="4" x2="60" y2="6" />
        <line x1="54" y1="6" x2="55.5" y2="8" />
        <line x1="66" y1="6" x2="64.5" y2="8" />
        <line x1="52" y1="12" x2="54" y2="12" />
        <line x1="68" y1="12" x2="66" y2="12" />
      </g>
      <text x="60" y="30" textAnchor="middle" fill="#fff" fontFamily="Arial, sans-serif" fontSize="14" fontWeight="700" letterSpacing="2">STB</text>
      <text x="60" y="40" textAnchor="middle" fill="#fff" fontFamily="Arial, sans-serif" fontSize="6.5" letterSpacing="0.5">Singapore Tourism Board</text>
    </svg>
  );
}

export function SLALogo({ className }: LogoProps) {
  return (
    <svg viewBox="0 0 120 48" className={className ?? box} xmlns="http://www.w3.org/2000/svg" role="img" aria-label="SLA">
      <rect width="120" height="48" fill="#0072BC" rx="3" />
      <path d="M60 6 C56 6 53 9 53 13 C53 17 60 22 60 22 C60 22 67 17 67 13 C67 9 64 6 60 6 Z" fill="#fff" />
      <circle cx="60" cy="13" r="2" fill="#0072BC" />
      <text x="60" y="34" textAnchor="middle" fill="#fff" fontFamily="Arial, sans-serif" fontSize="14" fontWeight="700" letterSpacing="2">SLA</text>
      <text x="60" y="42" textAnchor="middle" fill="#fff" fontFamily="Arial, sans-serif" fontSize="7" letterSpacing="0.5">Singapore Land Authority</text>
    </svg>
  );
}

export function CDCLogo({ className }: LogoProps) {
  return (
    <svg viewBox="0 0 120 48" className={className ?? box} xmlns="http://www.w3.org/2000/svg" role="img" aria-label="CDC">
      <rect width="120" height="48" fill="#E63946" rx="3" />
      <g fill="#fff">
        <circle cx="55" cy="10" r="2.5" />
        <circle cx="65" cy="10" r="2.5" />
        <path d="M50 18 A10 6 0 0 1 70 18" fill="none" stroke="#fff" strokeWidth="1.2" />
      </g>
      <text x="60" y="32" textAnchor="middle" fill="#fff" fontFamily="Arial, sans-serif" fontSize="14" fontWeight="700" letterSpacing="2">CDC</text>
      <text x="60" y="42" textAnchor="middle" fill="#fff" fontFamily="Arial, sans-serif" fontSize="6" letterSpacing="0.3">Community Development Councils</text>
    </svg>
  );
}

export function NACLogo({ className }: LogoProps) {
  return (
    <svg viewBox="0 0 120 48" className={className ?? box} xmlns="http://www.w3.org/2000/svg" role="img" aria-label="NAC">
      <rect width="120" height="48" fill="#9B2335" rx="3" />
      <g stroke="#fff" strokeWidth="1.2" strokeLinecap="round">
        <line x1="60" y1="4" x2="60" y2="12" />
        <line x1="60" y1="12" x2="68" y2="8" />
        <line x1="60" y1="12" x2="52" y2="8" />
        <line x1="60" y1="12" x2="66" y2="16" />
        <line x1="60" y1="12" x2="54" y2="16" />
      </g>
      <text x="60" y="32" textAnchor="middle" fill="#fff" fontFamily="Arial, sans-serif" fontSize="14" fontWeight="700" letterSpacing="2">NAC</text>
      <text x="60" y="42" textAnchor="middle" fill="#fff" fontFamily="Arial, sans-serif" fontSize="7" letterSpacing="0.5">National Arts Council</text>
    </svg>
  );
}

export const AGENCIES = [
  { Logo: URALogo, line1: "Urban Redevelopment", line2: "Authority" },
  { Logo: NHBLogo, line1: "National Heritage", line2: "Board" },
  { Logo: STBLogo, line1: "Singapore Tourism", line2: "Board" },
  { Logo: SLALogo, line1: "Singapore Land", line2: "Authority" },
  { Logo: CDCLogo, line1: "Community Development", line2: "Councils" },
  { Logo: NACLogo, line1: "National Arts", line2: "Council" },
];
