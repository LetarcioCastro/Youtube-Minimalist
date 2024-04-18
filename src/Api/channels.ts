import { useRef } from "react"
import { AnyObject } from "../Utils"
import { restApi, restOptionsType } from "./utils"

export type channelType = {
  thumb?: string,
  largeThumb?: string,
  title?: string,
  subs?: string,
  views?: string,
  videos?: string,
  empty?: boolean,
  name?: string,
  banner?: string,
}

const channelsCache: { [key: string]: channelType } = {}
const namesChannelIndex: { [key: string]: string } = {}

const emptyChannel = (data: channelType = {}) => ({ empty: true, ...data })

export const destructureChannel = (data: any): channelType => {

  if (!data) return emptyChannel()

  const {
    snippet: {
      thumbnails: {
        medium: { url: thumb } = {} as any,
        high: { url: largeThumb } = {} as any,
      } = {} as any,
      title,
      customUrl: name
    } = {} as any,
    statistics: {
      subscriberCount: subs,
      viewCount: views,
      videoCount: videos,
    } = {} as any,
    brandingSettings: {
      image: {
        bannerExternalUrl: banner
      } = {} as any,
    } = {} as any,
  } = data

  return {
    thumb,
    largeThumb,
    title,
    subs,
    views,
    videos,
    name,
    banner,
    empty: false,
  }

}

const prepareChannel = (data: channelType): channelType => data || emptyChannel()

export const getChannel = (id: string | undefined, storage: AnyObject = channelsCache) => (id && prepareChannel(storage[id])) || emptyChannel()
export const getChannels = (ids: string[], storage: AnyObject = channelsCache) => ids.map(id => getChannel(id, storage))
export const getChannelByName = (name: string | undefined) => (name && channelsCache[namesChannelIndex[name]]) || {}

export const useChannelCache = () => {

  const channelCache = useRef<AnyObject>({ ...channelsCache })

  return {
    channelCache,
    setChannel: (id: string, data: channelType) => channelCache.current[id] = data,
    getChannel: (id: string | undefined) => getChannel(id, channelCache.current)
  }

}

const saveInCache = (id: string, item: any, storage: AnyObject = channelsCache) => {

  const itemDest = destructureChannel(item)
  storage[id] = itemDest
  itemDest.name && (namesChannelIndex[itemDest.name] = id)

}

export const removeChannelsCache = (...ids: string[]) => ids.forEach(id => { delete channelsCache[id] })

export const restChannel = async (id: string, { cache = true, cacheStorage }: restOptionsType = {}) => {
  const { items: [item] = [], ...data } = await restApi(`/channels?part=snippet,statistics,brandingSettings&id=${id}`)
  cache && saveInCache(id, item, cacheStorage)
  return { item, ...data }
}

export const restChannels = async (ids: string[], { cache = true, cacheStorage }: restOptionsType = {}) => {

  const channels = ids.filter(id => !channelsCache[id])

  if (channels.length == 0) return {}

  const { items = [], ...data } = await restApi(
    `/channels?part=snippet,statistics,brandingSettings&id=${channels.join(',')}`
  )

  cache && items?.forEach(({ id, ...dataChannel }: { id: string }) => saveInCache(id, dataChannel, cacheStorage))

  return { items, ...data }

}