"use client";

import { useEffect, useMemo, useState } from "react";

interface ConfettiBurstProps {
  trigger: number;
}

type ReactConfettiComponent = (props: {
  width?: number;
  height?: number;
  recycle?: boolean;
  numberOfPieces?: number;
  gravity?: number;
  tweenDuration?: number;
  confettiSource?: { x: number; y: number; w: number; h: number };
  style?: React.CSSProperties;
}) => JSX.Element;

const colors = ["#f43f5e", "#fb7185", "#f59e0b", "#d946ef", "#8b5cf6"];

const fireCssSprinkles = (count: number) =>
  Array.from({ length: count }).map((_, index) => {
    const spread = (index - count / 2) * 8;
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
  });

export function ConfettiBurst({ trigger }: ConfettiBurstProps) {
  const [ConfettiComponent, setConfettiComponent] = useState<ReactConfettiComponent | null>(null);
  const [viewport, setViewport] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const onResize = () => setViewport({ width: window.innerWidth, height: window.innerHeight });
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const loadDynamicImport = new Function("moduleName", "return import(moduleName);") as (moduleName: string) => Promise<{ default?: ReactConfettiComponent }>;
        const module = await loadDynamicImport("react-confetti");
        if (!cancelled && module?.default) {
          setConfettiComponent(module.default);
        }
      } catch {
        if (!cancelled) {
          setConfettiComponent(null);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  const confettiSource = useMemo(
    () => ({
      x: Math.max(0, viewport.width * 0.2),
      y: 0,
      w: Math.max(160, viewport.width * 0.6),
      h: 20,
    }),
    [viewport.width],
  );

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {ConfettiComponent && viewport.width > 0 ? (
        <ConfettiComponent
          key={trigger}
          width={viewport.width}
          height={viewport.height}
          recycle={false}
          numberOfPieces={180}
          gravity={0.25}
          tweenDuration={3200}
          confettiSource={confettiSource}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        />
      ) : (
        fireCssSprinkles(20)
      )}
    </div>
  );
}
