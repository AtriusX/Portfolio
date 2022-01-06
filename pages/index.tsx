import type { NextPage } from "next";
import React, { useEffect, useMemo, useState } from "react";

function clamp(value: number, low: number, high: number): number {
  return Math.min(high, Math.max(low, value));
}

interface Square {
  x: number;
  y: number;
}

const COUNT = 32,
  STACK = 4,
  SIZE = 10;

const Home: NextPage = () => {
  const rects: Square[] = useMemo(() => {
    let out: Square[] = [];
    for (let i = 0; i < COUNT; i++)
      for (let j = 0; j < STACK; j++) out.push({ x: i, y: j });
    return out;
  }, []);
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    let interval = setInterval(() => {
      setFrame(frame + 1);
    }, 1000 / 120);
    return () => clearInterval(interval);
  });
  return (
    <div>
      <div
        style={{
          padding: 10,
          height: "20em",
          background: "black",
          color: "white",
        }}
      >
        <h1>Content</h1>
      </div>
      <svg
        style={{
          position: "relative",
          zIndex: -10,
        }}
        viewBox={`0 0 ${COUNT * SIZE} ${STACK * 12}`}
      >
        {rects.map(({ x, y }, i) => {
          let wave = Math.sin((-frame / 16 + x) / 4);
          let pad = (((2 * wave) / (STACK - y)) * 2);
          return (
            <rect
              key={i}
              x={x * SIZE + pad / 2}
              y={y * SIZE + y * wave * 2 + wave * -2 * y + pad / 2}
              width={SIZE - pad}
              height={SIZE - pad}
              style={{
                strokeWidth: Math.abs(
                  clamp(
                    Math.sin(
                      frame / 128 + (((x & y) ^ ~x) % Number.MAX_VALUE)
                    ) - clamp(pad / 16, 0, 0.2),
                    0,
                    0.2
                  )
                ),
                stroke: `hsl(${300 + wave * 100}, 100%, 25%)`,
              }}
            />
          );
        })}
      </svg>
      <div
        style={{
          padding: 10,
        }}
      >
        <h1>Next</h1>
      </div>
    </div>
  );
};

export default Home;
