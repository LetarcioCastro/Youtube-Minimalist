import { HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";


export default function LoaderSpinner({ className }: HTMLAttributes<SVGElement>) {

  return (
    <svg className={twMerge('h-10 w-10', className)} viewBox="0 0 40 40">
      <circle
        cx="20" cy="20" r="18"
        className="stroke-current fill-none origin-center"
        strokeLinecap="round"
        strokeWidth={4}
        strokeDashoffset={10}
        strokeDasharray={125.6}
        ref={(ref) => ref?.animate({
          transform: [`rotate(0turn)`, `rotate(2turn)`, `rotate(3turn)`],
          strokeDashoffset: [26.4, 125.6, 26.4]
        }, {
          duration: 2000,
          iterations: Infinity,
          easing: 'linear'
        })}
      />
    </svg>
  )

}