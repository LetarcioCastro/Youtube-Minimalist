
type dataVideoType = {
  initCors?: DOMRect,
  animation?: boolean,
  thumb?: string,
  largeThumb?: string,
}

let dataVideoAnimation: dataVideoType = {
  animation: false
}

export const setDataVideoAnimation = (data: dataVideoType) => dataVideoAnimation = data
export const getDataVideoAnimation = () => dataVideoAnimation
