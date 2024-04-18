import { MutableRefObject, useEffect, useRef, useState } from "react"
import { useSearchVideos } from "../../../Api/search"
import { useInView } from "framer-motion"
import { getItemsId, videoCacheType } from "../../../Api/videos"
import { useReload } from "../../../Hooks/Utils"
import CardVideo, { CardLoader } from "../../Video/Card"
import { TabsContent } from "../../../Components/ui/Tabs"
import { motion } from "framer-motion"

export default function Videos({ currentId, dataCache }: { currentId?: string, dataCache: videoCacheType }) {

  const [limit, setLimit] = useState(false)
  const cache = useRef({})

  return (
    <TabsContent value="videos">
      <VideosContent
        currentId={currentId}
        setLimit={setLimit}
        limit={limit}
        cache={cache}
        dataCache={dataCache}
      />
    </TabsContent>
  )

}

function VideosContent({ currentId, cache, limit, setLimit, dataCache }: {
  currentId?: string,
  limit: boolean,
  setLimit: Function,
  cache: MutableRefObject<{
    [key: string]: string[]
  }>
  dataCache: videoCacheType
}) {

  const loadingRef = useRef(false)
  const windowRef = useRef<HTMLDivElement | null>(null)
  const loaderRef = useRef<HTMLDivElement | null>(null)
  const videos = currentId ? cache.current[currentId] : undefined

  const reload = useReload()

  const search = useSearchVideos({
    max: 20,
    channelId: currentId,
    type: ['video'],
    video: {
      cacheStorage: dataCache.videoCache.current
    }
  })

  const loaderInView = useInView(loaderRef, {
    root: windowRef
  })

  const moreVideos = () => {
    if (loadingRef.current) return
    loadingRef.current = true

    currentId && search().then(({ items = [], nextPageToken } = {}) => {

      cache.current[currentId] = [
        ...(cache.current[currentId] || []),
        ...getItemsId(items)
      ]

      !nextPageToken && setLimit(true)

      reload()
      loadingRef.current = false
    })
  }

  useEffect(() => {

    search.set({ page: undefined })
    videos || moreVideos()

  }, [currentId])

  useEffect(() => {

    loaderInView && moreVideos()

  }, [loaderInView])


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ stiffness: 0 }}
      className="flex flex-col gap-16 pb-14"
    >
      {
        videos && (
          <div className='grid grid-cols-4 gap-x-10 gap-y-16 w-full items-start'>
            {
              videos.map((videoId, index) => {

                const dataVideo = dataCache.getVideo(videoId)

                return !dataVideo.empty && (
                  <CardVideo
                    key={`channel.video.${index}.${videoId}`}
                    id={videoId}
                    data={dataVideo}
                    channelThumb={false}
                  />
                )

              })
            }
          </div>
        )
      }
      {
        limit || (
          <div ref={loaderRef} className='grid grid-cols-4 gap-x-10 gap-y-16 w-full items-start'>
            {
              Array(12).fill({}).map(({ }, index) => <CardLoader key={index} />)
            }
          </div>
        )
      }
    </motion.div>
  )

}