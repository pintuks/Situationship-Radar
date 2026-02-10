import { Heart } from "lucide-react";

const hearts = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  left: `${6 + i * 9}%`,
  size: i % 3 === 0 ? "h-5 w-5" : "h-4 w-4",
  delay: `${i * 0.8}s`,
  duration: `${11 + i * 0.9}s`,
}));

export function FloatingHeartsBackground() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 animate-gradient"
        style={{
          backgroundImage: "linear-gradient(120deg, #ffe4ec, #fbcfe8, #ddd6fe, #fae8ff)",
          opacity: 0.95,
        }}
      />

      {hearts.map((heart) => (
        <div
          key={heart.id}
          aria-hidden
          className="pointer-events-none absolute bottom-0 text-rose-500/25 animate-float-up"
          style={{ left: heart.left, ["--delay" as string]: heart.delay, ["--duration" as string]: heart.duration }}
        >
          <Heart className={`${heart.size} fill-current`} />
        </div>
      ))}
    </>
  );
}
