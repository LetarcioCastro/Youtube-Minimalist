import { useMemo } from "react"

export type AnyObject<t = any> = { [key: string | number | symbol]: t }

type corsDiffType = {
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
}

export const calcTransformCors = (corsStart: DOMRect, corsEnd: DOMRect): corsDiffType => {

  return {
    x: corsStart.left - corsEnd.left,
    y: corsStart.top - corsEnd.top,
    scaleX: corsStart?.width / corsEnd.width,
    scaleY: corsStart?.height / corsEnd.height
  }

}

export const animatePossElement = (element: HTMLElement, corsStart: DOMRect) => {

  const cors = element.getBoundingClientRect()

  const { x, y, scaleX, scaleY } = calcTransformCors(corsStart, cors)

  element.animate([
    {
      transform: `translateX(${x}px) translateY(${y}px) scaleX(${scaleX}) scaleY(${scaleY})`
    },
    {
      transform: `translateX(${0}px) translateY(${0}px) scaleX(${1}) scaleY(${1})`
    }
  ], {
    duration: 500,
    easing: 'cubic-bezier(.35,0,.3,1)',

  })

}

export const pluralTerm = (amount: number, single: string, plural: string) => amount <= 1 ? `1 ${single}` : `${amount} ${plural}`
const formatter = Intl.NumberFormat("en", { notation: "compact" })
export const formatCompact = (views: string) => views ? formatter.format(parseInt(views)) : views
export const formatDate = (dateString: string) => {

  const date = new Date(dateString)
  const now = new Date()

  const diffDays = (now.getTime() - date.getTime()) / 86160000

  if (diffDays < 1) {

    const diffMins = (now.getTime() - date.getTime()) / 60000

    return diffMins < 60
      ? pluralTerm(Math.trunc(diffMins), 'min', 'mins')
      : pluralTerm(Math.trunc(diffMins / 60), 'hour', 'hours')

  }

  if (diffDays < 7) return pluralTerm(Math.trunc(diffDays), 'day', 'days')
  if (diffDays < 30) return pluralTerm(Math.trunc(diffDays / 7), 'week', 'weeks')
  if (diffDays < 365) return pluralTerm(Math.trunc(diffDays / 30), 'month', 'months')

  return pluralTerm(Math.trunc(diffDays / 365), 'year', 'years')

}

export const getIframeUrl = (iframe: string) => {
  const [url] = iframe?.match?.(/(?<=src=").*?(?=")/gm) || ['']
  return url
}

const domParser = new DOMParser

export function TextDom({ children }: { children: string }) {

  const text = useMemo(() => domParser.parseFromString(children, 'text/html').body.textContent, [children])

  return (
    <>
      {text}
    </>
  )
}

export const createSpeechRecognition = () => {

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

  if (!SpeechRecognition) return null

  const recognition = new SpeechRecognition

  recognition.lang = navigator.language || 'en'

  return recognition

}







