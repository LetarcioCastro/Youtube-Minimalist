import { useSyncExternalStore } from "react"

export default function createEvent<DataType>(get: () => DataType): [() => DataType, () => void] {

  let listeners: Function[] = []

  const addListener = (listener: any) => {
    listeners.push(listener)
    return () => listeners = listeners.filter(l => l != listener)
  }

  const useListen = (): DataType => useSyncExternalStore(addListener, get)
  const dispatch = () => listeners.forEach(l => l())

  return [useListen, dispatch]

}