import { HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

export function LoaderBox({ className, style, classShine }: { classShine?: string } & HTMLAttributes<HTMLDivElement>) {

  return (
    <div className={twMerge('relative overflow-hidden bg-zinc-900 rounded', className)} style={style}>
      <div className={twMerge('absolute inset-0 bg-zinc-800 opacity-40', classShine)} style={{
        maskImage: 'linear-gradient(90deg,#0000 0%, #000 50%, #0000 100%)'
      }} ref={ref => {
        ref?.animate([
          {
            transform: 'translateX(-100%)'
          },
          {
            transform: 'translateX(100%)'
          }
        ], {
          duration: 2000,
          iterations: Infinity,
        })
      }} />
    </div>
  )

}