
type dataChannelType = {
  initCors?: DOMRect,
  animation?: boolean,
  thumb?: string,
  largeThumb?: string,
}

let dataChannelAnimation: dataChannelType = {
  animation: false
}

let blackListCache: string[] = []

export const addBlackListCache = (...ids: string[]) => blackListCache = [...blackListCache, ...ids]
export const removeBlackListCache = (...ids: string[]) => blackListCache = blackListCache.filter(id => !ids.includes(id))
export const getBlackListCache = () => blackListCache

export const setDataChannelAnimation = (data: dataChannelType) => dataChannelAnimation = data
export const getDataChannelAnimation = () => dataChannelAnimation
