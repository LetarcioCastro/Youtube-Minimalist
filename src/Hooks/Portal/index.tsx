import { ReactNode, RefObject, useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function Portal({ container, containerRef, children }: { container?: HTMLElement, containerRef?: RefObject<HTMLElement>, children: ReactNode }) {

  const [node, setNode] = useState<HTMLElement | undefined>()

  useEffect(() => {

    containerRef && containerRef.current && setNode(containerRef.current)

  }, [containerRef])

  const element = container || node || undefined

  return element && createPortal(children, element)

}