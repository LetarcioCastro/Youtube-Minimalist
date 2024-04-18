import { HTMLAttributes, useEffect, useLayoutEffect, useRef, useState } from "react";
import { calcTransformCors } from "../../Utils";

export const useUUID = () => useRef(crypto.randomUUID()).current

export const useReload = () => {
  const [count, setState] = useState(0)
  return () => setState(count + 1)
}

type corsDiffType = {
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
}

type frameAnimation<t = Keyframe> = (corsDiff: corsDiffType) => t

type customFrames = {
  from?: frameAnimation,
  to?: frameAnimation,
}

type LayoutTranslateType = customFrames & {
  frames?: frameAnimation<Keyframe[] | PropertyIndexedKeyframes>,
}

const defaultFrames = ({ x, y, scaleX, scaleY }: corsDiffType, { from, to }: customFrames): Keyframe[] => ([
  from?.({ x, y, scaleX, scaleY }) || {
    transform: `translateX(${x}px) translateY(${y}px) scaleX(${scaleX}) scaleY(${scaleY})`
  },
  to?.({ x, y, scaleX, scaleY }) || {
    transform: `translateX(${0}px) translateY(${0}px) scaleX(${1}) scaleY(${1})`
  },
])

export const useLayoutTranslate = ({ frames, from, to, ...animateOptions }: LayoutTranslateType & KeyframeAnimationOptions = {}) => {

  let corsInit = useRef<DOMRect | undefined>()

  function Component({ children, effect = [], ...props }: HTMLAttributes<HTMLDivElement> & { effect?: any[] }) {

    const compRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {

      if (!compRef.current || !corsInit.current) return

      const cors = calcTransformCors(corsInit.current, compRef.current.getBoundingClientRect())

      compRef.current.animate(frames?.(cors) || defaultFrames(cors, { from, to }), {
        duration: 500,
        easing: 'cubic-bezier(.35,0,.3,1)',
        ...animateOptions,
      })

    }, effect)

    useLayoutEffect(() => {

      return () => {
        corsInit.current = compRef.current?.getBoundingClientRect()
      }

    }, effect)

    return (
      <div
        ref={compRef}
        {...props}
      >
        {children}
      </div>
    )

  }

  return Component

}