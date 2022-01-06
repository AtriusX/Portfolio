import type { NextPage } from "next";
import React, {
  DetailedHTMLProps,
  HTMLAttributes,
  useEffect,
  useMemo,
  useState,
} from "react";

function clamp(value: number, low: number, high: number): number {
  return Math.min(high, Math.max(low, value));
}

function distance(x1: number, y1: number, x2: number, y2: number): number {
  let a = x1 - x2, b = y1 - y2
  return a * a + b * b
}

interface Square {
  x: number;
  y: number;
}

const COUNT = 24,
  STACK = 12,
  SIZE = 10,
  WIDTH = COUNT * SIZE,
  HEIGHT = STACK * SIZE;

const Home: NextPage = () => {
  const rects: Square[] = useMemo(() => {
    let out: Square[] = [];
    for (let i = 0; i < COUNT; i++)
      for (let j = 0; j < STACK; j++) out.push({ x: i, y: j });
    return out;
  }, []);
  const [frame, setFrame] = useState(0);
  const [[width, height], setSize] = useState([1, 1])
  useEffect(() => {
    setSize([innerWidth, innerHeight])
    let interval = setInterval(() => {
      setFrame(frame + 1);
    }, 1000 / 60);
    return () => clearInterval(interval);
  }, [width, height, frame]);
  const [[x, y], setMouse] = useState([-10000, -10000])
  let sX = x * (WIDTH / width)
  let sY = y * (HEIGHT / height)
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
      }}
      onMouseMove={({ clientX, clientY }) => setMouse([clientX, clientY])}
      onMouseLeave={() => setMouse([-10000, -10000])}
    >
      <svg
        style={{
          position: "absolute",
          zIndex: -10,
          margin: 0,
          color: "white",
        }}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        width={"100%"}
        height={"100%"}
        preserveAspectRatio="none"
      >
        <g>
          {rects.map(({ x, y }, i) => {
            let wave = Math.sin((-frame / 4 + x) / 4);
            let dist = distance(sX, sY, x * SIZE + SIZE / 2, y * SIZE + SIZE / 2)
            let pad = ((2 * wave) / (STACK - y) / 2)
            if (dist < 10000)
              pad *= clamp(2500 / dist, 0, 8)
            return (
              <rect
                key={i}
                x={x * SIZE + Math.abs(pad / 2)}
                y={y * SIZE + y * wave * 2 + wave * -2 * y + Math.abs(pad / 2)}
                width={SIZE - Math.abs(pad)}
                height={SIZE - Math.abs(pad)}
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
                  // transformBox: 'fill-box',
                  // transformOrigin: 'center',
                  // transform: `rotate(${Math.sin((frame + x * 8) / 128) * 90 % 90}deg)`
                }}
              />
            );
          })}
        </g>
      </svg>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          height: "100vh",
          fontSize: "4rem",
          fontFamily: 'Segoe UI Semilight',
        }}
      >
        <h1 style={{
          textShadow: '0 0 4px black'
        }}>Landing Page</h1>
      </div>
    </div>
  );
};

export default Home;
