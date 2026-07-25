interface LogoProps {
  className?: string
}

/** InfluxLabz wordmark. Source is a wide transparent PNG — sized by height, width auto to avoid distortion. */
export function Logo({ className = 'h-7 w-auto' }: LogoProps) {
  return <img src="/influxlabz-logo-white.png" alt="InfluxLabz" className={`${className} object-contain select-none`} draggable={false} />
}
