import type { NextPage } from "next";
import React from "react";
import VectorAnimation, { VectorAnimationProps } from "../components/VectorAnimation";

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
  const setup = () => {
    let out: Square[] = [];
    for (let i = 0; i < COUNT; i++)
      for (let j = 0; j < STACK; j++)
        out.push({ x: i, y: j });
    return out;
  }

  const update: VectorAnimationProps<Square[]>["update"] = (
    { state, mouse: [x, y], frame, client: [width, height] }
  ) => {
    let sX = x * (WIDTH / width)
    let sY = y * (HEIGHT / height)
    return <g>
      {state.map(({ x, y }, i) => {
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
            }}
          />
        );
      })}
    </g>
  }
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
      }}
    >
      <VectorAnimation
        style={{
          width: '100%',
          height: '100%',
          position: "absolute",
          zIndex: -10,
          margin: 0,
          color: "white",
        }}
        dimension={{
          p: [0, 0],
          s: [WIDTH, HEIGHT]
        }}
        setup={setup}
        update={update}
        width='100%'
        height='100%'
        preserveAspectRatio="none"
      />
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
  )
}

export default Home;
