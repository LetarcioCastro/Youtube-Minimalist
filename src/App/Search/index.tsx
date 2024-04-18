import { useEffect, useRef, useState } from 'react';
import Window from "../../Components/ui/Window";
import { useSearchVideos } from "../../Api/search";
import { useInView } from "framer-motion";
import Header from "../Header";
import { useParams } from 'react-router-dom';
import { useVideoCache } from '../../Api/videos';
import MineCardVideo, { MineCardLoader } from '../Video/MiniCard';
import { useChannelCache } from '../../Api/channels';
import CardChannel, { CardChannelLoader } from '../Channel/Card';
import { LoaderBox } from '../../Components/ui/Loaders/Skeleton';

type itemVideoType = {
  type: 'video',
  id: string,
}

type itemChannelType = {
  type: 'channel',
  id: string,
}

type itemsSearchType = (itemVideoType | itemChannelType)[]

const prepareItems = (items: any[]): itemsSearchType =>
  items.map((item = {}) => {

    const { id: { kind, channelId, videoId } = {} as any } = item

    if (kind == 'youtube#channel')
      return {
        type: 'channel',
        id: channelId,
      }

    return {
      type: 'video',
      id: videoId,
    }

  })

export default function Search() {

  const { query } = useParams()

  const loadingRef = useRef(false)
  const windowRef = useRef<HTMLDivElement | null>(null)
  const loaderRef = useRef<HTMLDivElement | null>(null)
  const [loading, setLoading] = useState(true)
  const { channelCache, getChannel } = useChannelCache()
  const { videoCache, getVideo } = useVideoCache({
    channelCache: channelCache.current
  })

  const search = useSearchVideos({
    max: 20,
    type: ['video', 'channel'],
    video: {
      cacheStorage: videoCache.current
    },
    channel: {
      cacheStorage: channelCache.current
    }
  })

  const [items, setItems] = useState<itemsSearchType>([])
  const [total, setTotal] = useState(0)

  const loaderInView = useInView(loaderRef, {
    root: windowRef
  })

  const moreVideos = () => {
    if (loadingRef.current) return
    loadingRef.current = true
    setLoading(true)
    search({ query }).then(({ items = [], pageInfo: { totalResults = 0 } = {} as any } = {}) => {

      setItems(searchItems => [
        ...searchItems,
        ...prepareItems(items)
      ])
      setTotal(totalResults)
      setLoading(false)
      loadingRef.current = false
    })
  }

  useEffect(() => {

    loaderInView && moreVideos()

  }, [loaderInView])

  useEffect(() => {

    setItems([])
    search.set({ page: undefined })
    moreVideos()

  }, [query])

  return (
    <Window name="search" viewRef={(ref: any) => windowRef.current = ref}>
      <Window.Header>
        <Header defaultSearch={query} key='window.header' />
      </Window.Header>
      <div className='flex flex-col max-w-2xl gap-10 px-14 box-content'>
        {
          items.length > 0 && (
            <>
              <h1 className='text-xl'>
                {total} results for search `{query}`
              </h1>
              <div className='flex flex-col gap-10 w-full'>
                {
                  items.map?.(({ type, id }, index) => {

                    return type == 'channel' ? (
                      <CardChannel
                        key={`search.channel.${id}.${index}`}
                        id={id}
                        data={getChannel(id)}
                      />
                    ) : (
                      <MineCardVideo
                        key={`search.video.${id}.${index}`}
                        id={id}
                        data={getVideo(id)}
                      />
                    )

                  })
                }
              </div>
            </>
          )
        }
        <div ref={loaderRef} className='flex flex-col gap-10 w-full'>
          {
            items.length == 0 && !loading
              ? (
                <h1 className='text-xl'>
                  Nothing found!
                </h1>
              )
              : (
                <>
                  {
                    items.length == 0 && <LoaderBox className='h-7 w-56' />
                  }
                  <MineCardLoader />
                  <CardChannelLoader />
                  <MineCardLoader />
                  <MineCardLoader />
                  <MineCardLoader />
                  <CardChannelLoader />
                  <MineCardLoader />
                </>
              )
          }
        </div>
      </div>


    </Window>
  )

}