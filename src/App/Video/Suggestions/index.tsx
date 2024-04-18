import { useEffect, useRef, useState } from "react";
import { useSearchVideos } from "../../../Api/search";
import { LayoutGroup, motion } from 'framer-motion'
import MineCardVideo, { MineCardLoader } from "../MiniCard";
import { videoCacheType } from "../../../Api/videos";

const loaders = Array(10).fill({}).map(({ }, index) => <MineCardLoader key={index} />)

export default function Suggestions({ currentId, category, videoCache, channelCache }: {
  currentId?: string,
  category?: string,
  videoCache: videoCacheType,
  channelCache: any,
}) {

  const [videos, setVideos] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const lastVideoRef = useRef<string>()

  const search = useSearchVideos({
    max: 20,
    category,
    type: ['video'],
    video: {
      cacheStorage: videoCache.videoCache.current
    },
    channel: {
      cacheStorage: channelCache.channelCache.current
    }
  })

  useEffect(() => {

    if (!currentId) return

    const newOrder = videos.filter((id) => id != currentId)

    lastVideoRef.current && newOrder.push(lastVideoRef.current)
    lastVideoRef.current = currentId

    setVideos(newOrder)

  }, [currentId])

  useEffect(() => {

    setLoading(true)

    search().then(({ items = [] } = {}) => {
      setLoading(false)
      setVideos(
        items
          .map(({ id: { videoId } }: any) => videoId)
          .filter((id: string) => id != currentId)
      )
    })

  }, [])

  const suggestions = videos.slice(0, 15)

  return (
    <div className="flex flex-col gap-7">
      {
        loading
          ? loaders
          : (
            <LayoutGroup>
              {
                suggestions.map((id, index) => {

                  const dataVideo = videoCache.getVideo(id)

                  const isEnd = index + 1 >= suggestions.length

                  return (
                    <motion.div
                      key={`video.${id}`}
                      layoutId={`video.${id}`}
                      layout='position'
                      initial={isEnd && { opacity: 0, x: '100%' }}
                      animate={isEnd && { opacity: 1, x: '0%' }}
                      className="will-change-transform"
                    >
                      <MineCardVideo
                        id={id}
                        data={dataVideo}
                      />
                    </motion.div>
                  )

                })
              }
            </LayoutGroup>
          )
      }
    </div >
  )

}