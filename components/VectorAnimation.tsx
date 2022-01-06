import React, { HTMLAttributes, useEffect, useState } from 'react'

export type Setter<T> = (update: T) => void

export type Point = [x: number, y: number]

export type Size = [w: number, h: number]

export type Dimension = { p: Point, s: Size }

export type RefinedSVG = Omit<
    HTMLAttributes<SVGElement>, "viewBox" | "onMouseMove" | "onMouseLeave" | "children"
> & { width?: string, height?: string, preserveAspectRatio?: string }

export type ContextState<T> = {
    state: T,
    view: Dimension,
    mouse: Point,
    frame: number,
    client: Size
}

export type Move = (c: {
    clientX: number,
    clientY: number
}) => void

export interface VectorAnimationProps<T = void> extends RefinedSVG {
    setup: () => T
    update: (state: ContextState<T>, set: Setter<T>) => HTMLAttributes<SVGElement>["children"],
    dimension?: Dimension,
    frames?: number
}

function VectorAnimation<T>({ setup, update, dimension, frames, ...rest }: VectorAnimationProps<T>) {
    let view = dimension ?? { p: [0, 0], s: [100, 100] }
    let { p: [x, y], s: [w, h] } = view
    const [mouse, setMouse] = useState<Point>([-10000, -10000])
    const [state, setState] = useState<T>(setup())
    const [frame, setFrame] = useState(0)
    const [client, setSize] = useState<Size>([0, 0])
    useEffect(() => {
        setSize([innerWidth, innerHeight])
        const move: Move = ({ clientX, clientY }) => setMouse([clientX, clientY])
        const reset = () => setMouse([-10000, -10000])
        window.addEventListener('mousemove', move)
        window.addEventListener('mouseleave', reset)
        let interval = setInterval(() => setFrame(frame + 1), 1000 / (frames ?? 60))
        return () => {
            clearInterval(interval)
            window.removeEventListener('mousemove', move)
            window.removeEventListener('mouseleave', reset)
        }
    }, [frame, frames])
    return (
        <svg {...rest}
            viewBox={`${x} ${y} ${w} ${h}`}
            preserveAspectRatio='none'
        >
            {update({ state, view, mouse, frame, client }, setState)}
        </svg>
    )
}

export default VectorAnimation