import { MutableRefObject, useRef } from "react";
import { AnyObject, formatCompact, formatDate } from "../Utils";
import { channelType, getChannel, restChannels } from "./channels";
import { restApi, restOptionsType } from "./utils";

type detailsType = {
  views?: string,
  comments?: string,
  likes?: string,
  dislikes?: string,
  date?: string,
}

export type videoCacheType = {
  videoCache: MutableRefObject<{ [id: string]: videoType }>,
  setVideo: ((id: string, data: videoType) => any)
  getVideo: (id: string | undefined) => videoType
}

export type restDataOptionsType = {
  video?: restOptionsType,
  channel?: restOptionsType
}

export type videoType = detailsType & {
  thumb?: string,
  title?: string,
  channelId?: string,
  dataChannel?: channelType,
  desc?: string,
  largeThumb?: string,
  empty?: boolean,
  category?: string,
  original?: detailsType
}

const videosCache: { [key: string]: videoType } = {}

export const getVideosCache = () => videosCache

const emptyVideo = (data: videoType = {}) => ({ empty: true, ...data, })

export const destructureVideo = (data: any, channelCache: AnyObject = {}): videoType => {

  if (!data) return emptyVideo()

  const {
    snippet: {
      thumbnails: {
        high: { url: thumb } = {} as any,
        maxres: { url: largeThumb } = {} as any
      } = {} as any,
      title,
      description: desc,
      publishedAt: date,
      channelId,
      categoryId: category
    } = {} as any,
    statistics: {
      viewCount: views,
      commentCount: comments,
      likeCount: likes,
      dislikeCount: dislikes,
    } = {} as any,
  } = data

  return {
    thumb,
    title,
    date: formatDate(date),
    views: formatCompact(views),
    comments: formatCompact(comments),
    likes: formatCompact(likes),
    dislikes: formatCompact(dislikes),
    channelId,
    dataChannel: getChannel(channelId, channelCache),
    desc,
    largeThumb,
    empty: false,
    category,
    original: {
      date,
      views,
      comments,
      likes,
      dislikes,
    }
  }

}

export const getItemsId = (items: any[]): string[] => items.map?.(({ id: { videoId } }: any) => videoId)

const prepareVideo = (data: videoType, channelStorage?: AnyObject): videoType => data
  ? {
    ...data,
    dataChannel: getChannel(data.channelId, channelStorage)
  }
  : emptyVideo()

export const getVideo = (id: string | undefined, { videoStorage = videosCache, channelStorage }: {
  videoStorage?: AnyObject,
  channelStorage?: AnyObject
} = {}) => (id && prepareVideo(videoStorage[id], channelStorage)) || emptyVideo()

export const getVideos = (...ids: string[]) => ids.map(id => getVideo(id))
export const setVideo = (id: string, data: videoType) => videosCache[id] = data

export const useVideoCache = ({ channelCache }: { channelCache?: AnyObject } = {}): videoCacheType => {

  const videoCache = useRef<{ [id: string]: videoType }>({ ...videosCache })

  return {
    videoCache,
    setVideo: (id: string, data: videoType) => videoCache.current[id] = data,
    getVideo: (id: string | undefined) => getVideo(id, {
      videoStorage: videoCache.current,
      channelStorage: channelCache,
    })
  }

}


export const getDataVideos = async (items: any, { video, channel }: restDataOptionsType = {}) => {

  const videoIds = getItemsId(items)
  const channelsIds = Array.from(new Set(items.map?.(({ snippet: { channelId }, id: { channelId: id } }: any) => id || channelId))) as string[]

  const videoPromise = restVideos(videoIds, video)
  const channelPromise = restChannels(channelsIds, channel)

  await Promise.all([videoPromise, channelPromise])

  return [videoIds, channelsIds]

}

const saveInCache = (id: string, item: any, storage: AnyObject = videosCache) => {

  storage[id] = destructureVideo(item)

}

export const restVideo = async (id: string, { cache = true, cacheStorage }: restOptionsType = {}) => {
  const { items: [item] = [], ...data } = await restApi(`/videos?part=snippet,statistics&&id=${id}`)
  cache && saveInCache(id, item, cacheStorage)
  return { item, ...data }
}

export const restVideos = async (ids: string[], { cache = true, cacheStorage }: restOptionsType = {}) => {

  const { items = [], ...data } = await restApi(
    `/videos?part=snippet,statistics&id=${ids.join(',')}`
  )

  cache && items?.forEach(({ id, ...dataVideo }: { id: string }) => saveInCache(id, dataVideo, cacheStorage))

  return { items, ...data }

}

