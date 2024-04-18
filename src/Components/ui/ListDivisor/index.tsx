import { Fragment, ReactNode, isValidElement, useMemo } from "react";


const prepareChildren = (children: ReactNode): any[] => {

  if (!Array.isArray(children)) return [children]

  const newChildren: ReactNode[] = []

  children.forEach((child) => {
    if (!Array.isArray(child)) return newChildren.push(child)
    child.forEach((child) => newChildren.push(child))
  })

  return newChildren

}

export default function ListDivisor({ divisor, children, ...props }: { divisor?: ReactNode, children?: ReactNode }) {

  const childrenPrepared = useMemo(() => prepareChildren(children), [divisor, children])

  return (
    <Fragment {...props}>
      {
        childrenPrepared.map((child, index) => {

          return isValidElement(child) && (
            <Fragment key={index}>
              {child}
              {index + 1 < childrenPrepared.length && divisor}
            </Fragment>
          )

        })
      }
    </Fragment>
  )

}