import { useRef } from "react"
import { baseUrl, fetchApi, key } from "./utils"
import { getDataVideos, restDataOptionsType } from "./videos"
import { AnyObject } from "../Utils"

type searchType = {
  query?: string,
  max?: number,
  order?: 'date' | 'rating' | 'relevance' | 'title' | 'videoCount' | 'viewCount',
  page?: string,
  type?: ('channel' | 'playlist' | 'video')[],
  duration?: 'long' | 'medium' | 'short',
  channelId?: string,
  category?: string,
}

export const searchVideos = ({ query, max, order, page, type = [], channelId, duration, category }: searchType = {}) => {

  const url = new URL('/youtube/v3/search', baseUrl)

  url.searchParams.set('key', key)
  url.searchParams.set('part', 'snippet')

  query && url.searchParams.set('q', query)
  max && url.searchParams.set('maxResults', `${max}`)
  order && url.searchParams.set('order', order)
  page && url.searchParams.set('pageToken', page)
  channelId && url.searchParams.set('channelId', channelId)
  duration && url.searchParams.set('videoDuration', duration)
  category && url.searchParams.set('videoCategoryId', category)
  type.length > 0 && url.searchParams.set('type', type.join(','))

  return fetchApi(url)

}

export const searchDataVideos = async ({ video, channel, ...search }: searchType & restDataOptionsType = {}) => {

  const { items = [], ...data } = await searchVideos(search)

  await getDataVideos(items, {
    video,
    channel,
  })

  return { items, ...data }

}

export const useSearchVideos = ({ ...useSearch }: searchType & restDataOptionsType = {}) => {

  const propsRef = useRef<AnyObject>({})

  const set = (props: AnyObject) =>
    propsRef.current = {
      ...propsRef.current,
      ...props,
    }

  const search = async (search: searchType = {}) => {

    const response = await searchDataVideos({
      ...useSearch,
      ...propsRef.current,
      ...search,
    })

    propsRef.current.page = response.nextPageToken
    return response

  }

  search.set = set

  return search

}






