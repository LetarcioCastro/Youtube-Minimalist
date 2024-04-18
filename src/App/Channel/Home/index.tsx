import { MutableRefObject, useEffect, useRef, useState } from "react";
import CardVideo, { CardLoader } from "../../Video/Card";
import { TabsContent } from "../../../Components/ui/Tabs";
import { useSearchVideos } from "../../../Api/search";
import { getItemsId, videoCacheType } from "../../../Api/videos";
import { useReload } from "../../../Hooks/Utils";
import { motion } from "framer-motion";

type HomeType = {
  currentId?: string,
  cache: MutableRefObject<{
    [key: string]: string[]
  }>,
  dataCache: videoCacheType
}

export function Home({ currentId, dataCache }: { currentId?: string, dataCache: videoCacheType }) {

  const cache = useRef({})

  return (
    <TabsContent value="home">
      <HomeContent
        currentId={currentId}
        cache={cache}
        dataCache={dataCache}
      />
    </TabsContent>
  )

}

const loaders = Array(4).fill({}).map(({ }, index) => <CardLoader key={index} />)

export function HomeContent({ currentId, cache, dataCache }: HomeType) {

  const videos = currentId ? cache.current[currentId] : undefined
  const [loading, setLoading] = useState(!videos)
  const reload = useReload()

  const search = useSearchVideos({
    max: 4,
    channelId: currentId,
    order: 'viewCount',
    type: ['video'],
    video: {
      cacheStorage: dataCache.videoCache.current
    }
  })

  useEffect(() => {

    setLoading(true)

    currentId && !videos && search().then(({ items }) => {

      cache.current[currentId] = getItemsId(items)
      setLoading(false)
      reload()

    })

  }, [currentId])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ stiffness: 0 }}
      className="flex flex-col gap-10"
    >
      <div className="flex flex-col gap-5">
        <h2 className="text-2xl leading-none">
          Trending Videos
        </h2>
        <div className="grid grid-cols-4 gap-x-10 gap-y-16">
          {
            loading && !videos
              ? loaders
              : (
                videos?.map((id) => {

                  const dataVideo = dataCache.getVideo(id)

                  return (
                    <CardVideo
                      id={id}
                      key={`channel.video.${id}.viral`}
                      data={dataVideo}
                      channelThumb={false}
                    />
                  )
                })
              )
          }
        </div>
      </div>
    </motion.div>
  )

}