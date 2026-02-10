interface ConfettiBurstProps {
  trigger: number;
}

const colors = ["#f43f5e", "#fb7185", "#f59e0b", "#d946ef", "#8b5cf6"];

export function ConfettiBurst({ trigger }: ConfettiBurstProps) {
  return (
    <div key={trigger} aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 20 }).map((_, index) => {
        const spread = (index - 10) * 8;
        const drift = spread + (index % 2 === 0 ? 16 : -16);
        return (
          <span
            key={index}
            className="animate-confetti absolute left-1/2 top-16 h-2.5 w-1.5 rounded-sm"
            style={{
              backgroundColor: colors[index % colors.length],
              ["--x-start" as string]: `${spread}px`,
              ["--x-end" as string]: `${drift}px`,
              ["--duration" as string]: `${800 + (index % 5) * 120}ms`,
              ["--delay" as string]: `${(index % 6) * 40}ms`,
            }}
          />
        );
      })}
    </div>
  );
}
