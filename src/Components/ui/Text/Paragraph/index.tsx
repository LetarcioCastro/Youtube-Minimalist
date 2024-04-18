import { HTMLAttributes, useEffect, useRef, useState } from "react"
import { twMerge } from "tailwind-merge"

type ParagraphType = {
  seeMore?: boolean,
  clamp?: number
}

export default function Paragraph({ clamp: clampInit, seeMore = true, children, className, ...props }: ParagraphType & HTMLAttributes<HTMLParagraphElement>) {

  const [clamp, setClamp] = useState(clampInit)
  const [seeMoreActive, setSeeMore] = useState(false)
  const pRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {

    pRef.current
      && pRef.current.offsetHeight < pRef.current.scrollHeight
      && setSeeMore(true)

  }, [children])

  useEffect(() => {

    setClamp(clampInit)

  }, [clampInit])

  return (
    <div className="inline-flex flex-col items-start h-fit w-fit">
      <p
        ref={pRef}
        className={twMerge(className, clamp == undefined ? 'line-clamp-none' : 'line-clamp-1')}
        style={{
          WebkitLineClamp: clamp
        }}
        {...props}
      >
        {children}
      </p>
      {
        seeMore && seeMoreActive && (
          <button className="underline" onClick={() => setClamp(clamp == undefined ? clampInit : undefined)}>
            {
              clamp == undefined
                ? 'show less'
                : 'show more'
            }
          </button>
        )
      }
    </div>
  )

}