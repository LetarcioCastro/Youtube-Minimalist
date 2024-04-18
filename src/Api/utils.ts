import { AnyObject } from "../Utils"

export const baseUrl = 'https://youtube.googleapis.com/'
export const key = 'AIzaSyAPNlSjYt05GZrYKy2orkR_MZaksTxHm6c'

export type restOptionsType = {
  cache?: boolean,
  cacheStorage?: AnyObject
}

export const fetchApi = (url: RequestInfo | URL, { headers = {}, ...init }: RequestInit = {}) =>
  fetch(url, {
    headers: {
      accept: 'application/json',
      ...headers,
    },
    ...init
  }).then(r => r.json())

export const restApi = (router: RequestInfo | URL, init?: RequestInit) => {
  const url = new URL(`youtube/v3${router}`, baseUrl)
  url.searchParams.set('key', key)
  return fetchApi(url, init)
}

