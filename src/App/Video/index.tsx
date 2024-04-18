import Window from "../../Components/ui/Window"
import { Link, useParams } from "react-router-dom"
import { useEffect, useRef, useState } from "react"
import { animatePossElement, formatCompact } from "../../Utils"
import { restVideo, useVideoCache } from "../../Api/videos"
import { LoaderBox } from "../../Components/ui/Loaders/Skeleton"
import { restChannel, useChannelCache } from "../../Api/channels"
import { motion } from 'framer-motion';
import Suggestions from "./Suggestions"
import { useReload } from "../../Hooks/Utils"
import { getDataVideoAnimation, setDataVideoAnimation } from "../../Globals/video"
import Paragraph from "../../Components/ui/Text/Paragraph"
import ListDivisor from "../../Components/ui/ListDivisor"
import { BiLike, BiDislike } from "react-icons/bi";
import Comments from "./Comments"
import { setDataChannelAnimation } from "../../Globals/channel"
import Header from "../Header"

const loaderDesc = (
  <div className="flex flex-wrap gap-4">
    {
      Array(10).fill({}).map(({ }, index) => {

        const size = Math.floor(Math.random() * 50) + 20

        return <LoaderBox key={index} className="h-4" style={{ width: `calc(${size} * 0.25rem)` }} />
      })
    }
  </div>
)

export default function Video() {

  const { id } = useParams()

  const channel = useChannelCache()
  const video = useVideoCache({
    channelCache: channel.channelCache.current
  })

  const dataVideo = video.getVideo(id)
  const [loading, setLoading] = useState(dataVideo.empty)
  const [loadingChannel, setLoadingChannel] = useState(dataVideo.empty)
  const videoRef = useRef<HTMLDivElement | null>(null)
  const viewRef = useRef<HTMLDivElement | null>(null)
  const thumbRef = useRef<HTMLDivElement | null>(null)
  const reload = useReload()

  const { thumb, largeThumb } = getDataVideoAnimation()

  dataVideo.thumb ??= thumb
  dataVideo.largeThumb ??= largeThumb

  useEffect(() => {

    if (dataVideo.channelId && dataVideo.dataChannel?.empty) {
      setLoadingChannel(true)
      restChannel(dataVideo.channelId, {
        cacheStorage: channel.channelCache.current
      }).then(() => {
        setLoadingChannel(false)
        reload()
      })
    }

  }, [dataVideo.channelId])

  useEffect(() => {

    const { animation, initCors, ...props } = getDataVideoAnimation()

    if (videoRef.current && animation && initCors) {
      animatePossElement(videoRef.current, initCors)
      setDataVideoAnimation({
        initCors,
        animation: false,
        ...props
      })
    }

    setLoading(!!dataVideo.empty)

    id && dataVideo.empty
      && restVideo(id, {
        cacheStorage: video.videoCache.current
      }).then(() => {
        console.log('then')
        setLoading(false)
        reload()
      })

  }, [id])

  return (
    <Window name="video" viewRef={(ref: any) => viewRef.current = ref}>
      <Window.Header>
        <Header />
      </Window.Header>
      <div className='grid grid-cols-4 row-auto gap-6 w-full px-14 pb-14 items-start' style={{ gridTemplateRows: 'auto 1fr' }}>
        <div
          className="relative col-start-1 col-end-4 row-start-1 row-end-2 bg-zinc-900 aspect-video rounded-3xl overflow-hidden origin-top-left shadow-2xl z-20"
          ref={videoRef}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              key={`video.${id}.thumb`}
              src={dataVideo.thumb}
              className='w-full object-cover'
            />
          </div>
          {
            dataVideo.largeThumb && (
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  key={`video.${id}.largeThumb`}
                  onLoad={({ target }: { target: any }) => target.style.opacity = '1'}
                  src={dataVideo.largeThumb}
                  className='w-full object-cover transition-opacity'
                  style={{ opacity: 0 }}
                />
              </div>
            )
          }
          <iframe
            key={`video.${id}.iframe`}
            onLoad={({ target }: { target: any }) => target.style.opacity = '1'}
            src={`http://www.youtube.com/embed/${id}`}
            className="relative w-full h-full transition-opacity"
            allow="autoplay;"
            style={{ opacity: 0 }}
          />
          {
            loading && !dataVideo.thumb && <LoaderBox className="absolute inset-0" />
          }
        </div>
        <div className="row-start-1 row-end-3">
          <Suggestions
            currentId={id}
            category={dataVideo.category}
            videoCache={video}
            channelCache={channel}
          />
        </div>
        <div className="flex flex-col col-start-1 col-end-4 px-2 gap-5 row-start-2 row-end-3">
          <div className="flex gap-4 justify-between items-start">
            {
              loading && !dataVideo.title
                ? <LoaderBox className="h-6 w-2/3" />
                : (
                  <motion.h1
                    key={`video.${id}.title`}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-2xl"
                  >
                    {dataVideo.title}
                  </motion.h1>
                )
            }
            {loading && !(dataVideo.views || dataVideo.date)
              ? <LoaderBox className="h-6 w-32" />
              : (
                <motion.div
                  key={`video.${id}.view`}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className='flex gap-4 font-light items-center text-xl whitespace-nowrap pt-1'
                >
                  <ListDivisor
                    divisor={
                      <span className='text-[10px] opacity-80'>
                        &#9679;
                      </span>
                    }
                  >
                    {dataVideo.likes && (
                      <div className="flex gap-2 items-center">
                        <BiLike />
                        <span>
                          {dataVideo.likes}
                        </span>
                      </div>
                    )}
                    {dataVideo.dislikes && (
                      <div className="flex gap-2 items-center">
                        <BiDislike />
                        <span>
                          {dataVideo.dislikes}
                        </span>
                      </div>
                    )}
                    {dataVideo.views && (
                      <span>
                        {dataVideo.views} views
                      </span>
                    )}
                    {dataVideo.date && (
                      <span className='opacity-60'>
                        {dataVideo.date}
                      </span>
                    )}
                  </ListDivisor>
                </motion.div>
              )
            }
          </div>
          <div className="flex gap-3 items-center">
            <Link
              to={`/channels/${dataVideo.channelId}`}
              className="rounded-full"
            >
              {
                loadingChannel && !dataVideo.dataChannel?.thumb
                  ? <LoaderBox className="h-14 aspect-square rounded-full" />
                  : (
                    <motion.div
                      key={`video.${id}.channel.thumb`}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.7 }}
                      className="h-14 aspect-square rounded-full overflow-hidden"
                      ref={thumbRef}
                      onClick={() => {

                        setDataChannelAnimation({
                          initCors: thumbRef.current?.getBoundingClientRect(),
                          animation: true,
                          thumb: dataVideo.dataChannel?.thumb,
                          largeThumb: dataVideo.dataChannel?.largeThumb
                        })

                      }}
                    >
                      <img src={dataVideo.dataChannel?.thumb} className="w-full object-cover" />
                    </motion.div>
                  )
              }
            </Link>
            <div className="flex flex-col gap-2 font-light">
              {
                loadingChannel && !dataVideo.dataChannel?.title
                  ? <LoaderBox className="h-5 w-48" />
                  : (
                    <motion.span
                      key={`video.${id}.channel.title`}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.8 }}
                    >
                      <Link
                        to={`/channels/${dataVideo.channelId}`}
                        className="text-xl leading-none hover:underline"
                        onClick={() => {
                          setDataChannelAnimation({
                            initCors: thumbRef.current?.getBoundingClientRect(),
                            animation: true,
                            thumb: dataVideo.dataChannel?.thumb,
                            largeThumb: dataVideo.dataChannel?.largeThumb
                          })
                        }}
                      >
                        {dataVideo.dataChannel?.title}
                      </Link>
                    </motion.span>
                  )
              }
              {
                loadingChannel && !dataVideo.dataChannel?.subs
                  ? <LoaderBox className="h-4 w-32" />
                  : (
                    <motion.span
                      key={`video.${id}.channel.subs`}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.9 }}
                      className="leading-none text-opacity-60 text-white"
                    >
                      {formatCompact(dataVideo.dataChannel?.subs || '')} subscribes
                    </motion.span>
                  )
              }
            </div>
          </div>
          {
            loading && !dataVideo.desc
              ? loaderDesc
              : dataVideo.desc != '' && (
                <motion.p
                  key={`video.${id}.channel.desc`}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 0.6 }}
                  transition={{ delay: 1 }}
                  className="text-opacity-60 line-clamp-4">
                  <Paragraph clamp={5}>
                    {dataVideo.desc}
                  </Paragraph>
                </motion.p>
              )
          }
          <div>
            <Comments
              amount={dataVideo.original?.comments}
              currentId={id}
              viewRef={viewRef}
            />
          </div>
        </div>
      </div>
    </Window >
  )

}

