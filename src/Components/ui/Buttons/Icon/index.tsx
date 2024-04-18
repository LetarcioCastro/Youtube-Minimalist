import { Slot } from "@radix-ui/react-slot";
import { ButtonHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

type PropsType = {
  leak?: number
  asChild?: boolean,
} & ButtonHTMLAttributes<HTMLButtonElement>

export default function IconButton({ leak = 2, asChild = false, className, children, ...props }: PropsType) {

  const Btn = asChild ? Slot : 'button'

  return (
    <Btn
      {...props}
      className={twMerge(
        'h-auto w-auto hover:bg-zinc-950 rounded-full outline-0 hover:outline-1 outline outline-zinc-800',
        className
      )}
      style={{
        padding: `calc(0.25rem * ${leak})`,
        margin: `calc(0.25rem * ${leak} * -1)`
      }}
    >
      {children}
    </Btn>
  )

}