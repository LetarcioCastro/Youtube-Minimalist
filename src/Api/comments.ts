import { baseUrl, fetchApi, key } from "./utils"

export type replyType = {
  author?: string,
  profile?: string,
  date?: string,
  likes?: string,
  text?: string,
  textLiteral?: string,
  channelId?: string,
  authorId?: string,
  empty: boolean,
}

const destructureReply = (data: any): replyType => {

  if (!data) return { empty: true }

  const {
    snippet: {
      authorDisplayName: author,
      authorProfileImageUrl: profile,
      publishedAt: date,
      likeCount: likes,
      textOriginal: text,
      textDisplay: textLiteral,
      channelId,
      authorChannelId: {
        value: authorId
      } = {} as any
    } = {} as any
  } = data

  return {
    author,
    profile,
    date,
    likes,
    text,
    textLiteral,
    channelId,
    authorId,
    empty: false,
  }

}

export type commentType = { replies: replyType[] } & replyType

const destructureComment = (data: any): commentType => {

  if (!data) return { empty: true, replies: [] }

  const {
    snippet: {
      topLevelComment
    } = {} as any,
    replies: {
      comments: replies = []
    } = {} as any
  } = data

  return {
    ...destructureReply(topLevelComment),
    replies: replies.map((reply: any) => destructureReply(reply)),
    empty: false,
  }

}

type optionsType = {
  parts?: ('replies' | 'snippet')[],
  page?: string,
  max?: number,
}

export const restComments = async (
  videoId: string,
  { parts = ['replies', 'snippet'], page, max = 20 }: optionsType = {}
): Promise<{ items: commentType[], [key: string]: any }> => {

  const url = new URL('/youtube/v3/commentThreads', baseUrl)

  url.searchParams.set('key', key)
  url.searchParams.set('videoId', videoId)

  max && url.searchParams.set('max', `${max}`)
  page && url.searchParams.set('pageToken', page)
  parts.length > 0 && url.searchParams.set('part', parts.join(','))

  const { items = [], ...data } = await fetchApi(url)

  return {
    ...data,
    items: items.map((item: any) => destructureComment(item))
  }

}