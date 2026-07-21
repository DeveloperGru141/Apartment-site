import { images } from "@/lib/images";

const AUTH_IMAGE = images.authLayout

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={AUTH_IMAGE}
          alt="HORIZON luxury apartment interior showcase"
          className="w-full h-full object-cover blur-sm md:blur-md scale-110 animate-fadeIn"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-black/10" />
      </div>

      <div className="relative z-10 min-h-screen w-full">{children}</div>
    </div>
  );
}
