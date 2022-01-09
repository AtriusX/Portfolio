import React, { HTMLAttributes, useCallback, useEffect, useMemo, useState } from 'react'
import ReactVisibilitySensor from 'react-visibility-sensor'

export type Setter<T> = (update: T) => void

export type Point = [x: number, y: number]

export type Size = [w: number, h: number]

export type Scroll = [vertical: number, horizontal: number]

export type Dimension = { p: Point, s: Size, scroll: Scroll }

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
    update: (state: ContextState<T>) => HTMLAttributes<SVGElement>["children"],
    dimension?: Dimension,
    frames?: number
}

function VectorAnimation<T>({ setup, update, dimension, frames, ...rest }: VectorAnimationProps<T>) {
    let view = dimension ?? { p: [0, 0], s: [100, 100] }
    let { p: [x, y], s: [w, h] } = view
    const [mouse, setMouse] = useState<Point>([-10000, -10000])
    const state = useMemo(() => setup(), [setup])
    const [frame, setFrame] = useState(0)
    const [client, setSize] = useState<Size>([0, 0])
    const [scroll, setScroll] = useState<Scroll>([0, 0])
    const [visible, setVisible] = useState(true)
    const move = useCallback(({ clientX, clientY }) => setMouse([clientX, clientY]), [])
    const reset = useCallback(() => move([-10000, -10000]), [move])
    useEffect(() => {
        document.addEventListener('mousemove', move)
        document.addEventListener('mouseout', reset)
        return () => {
            document.removeEventListener('mousemove', move)
            document.removeEventListener('mouseout', reset)
        }
    }, [move, reset])
    useEffect(() => {
        let interval = setInterval(() => {
            if (!visible) return
            setSize([screen.width, screen.height])
            setScroll([scrollY, scrollX])
            setFrame(frame + 1)
        }, 1000 / (frames ?? 60))
        return () => {
            clearInterval(interval)
        }
    }, [frame, frames, visible])
    return (
        <ReactVisibilitySensor onChange={setVisible} partialVisibility>
            <svg {...rest}
                viewBox={`${x} ${y} ${w} ${h}`}
                preserveAspectRatio='none'
            >
                {update({ state, view: { ...view, scroll }, mouse, frame, client })}
            </svg>
        </ReactVisibilitySensor>
    )
}

export default VectorAnimation