import Window from "../../Components/ui/Window";
import { useParams } from "react-router-dom";
import { getChannel, removeChannelsCache, restChannel } from "../../Api/channels";
import { useEffect, useRef, useState } from "react";
import { useReload } from "../../Hooks/Utils";
import { LoaderBox } from "../../Components/ui/Loaders/Skeleton";
import ListDivisor from "../../Components/ui/ListDivisor";
import { animatePossElement, formatCompact } from "../../Utils";
import Tabs from "../../Components/ui/Tabs";
import { getBlackListCache, getDataChannelAnimation, removeBlackListCache, setDataChannelAnimation } from "../../Globals/channel";
import { motion } from 'framer-motion'
import { Home } from "./Home";
import Videos from "./Videos";
import { useVideoCache } from "../../Api/videos";
import Header from "../Header";

export default function Channel({ }) {

  const { id } = useParams()

  const dataChannel = getChannel(id)
  const [loading, setLoading] = useState(!!dataChannel.empty)
  const thumbRef = useRef<HTMLDivElement>(null)
  const reload = useReload()
  const { thumb, largeThumb } = getDataChannelAnimation()

  dataChannel.thumb ??= thumb
  dataChannel.largeThumb ??= largeThumb

  const dataCache = useVideoCache()

  useEffect(() => {

    const { animation, initCors } = getDataChannelAnimation()

    if (thumbRef.current && animation && initCors) {
      animatePossElement(thumbRef.current, initCors)
      setDataChannelAnimation({
        initCors,
        animation: false
      })
    }

    setLoading(!!dataChannel.empty)

    id && dataChannel.empty
      && restChannel(id).then(() => {
        setLoading(false)

        reload()
      })

    return () => {

      const blackList = getBlackListCache()
      removeChannelsCache(...blackList)
      removeBlackListCache(...blackList)

    }

  }, [id])

  return (
    <Window name="channel">
      <Window.Header>
        <Header />
      </Window.Header>
      <div className="flex flex-col gap-10 pb-14">
        <div className="px-14">
          <div className="relative w-full h-auto aspect-[6/1] overflow-hidden flex items-center justify-center rounded-3xl shadow-2xl">
            <LoaderBox className="absolute inset-0" />
            <img
              onLoad={({ target }: any) => target.style.opacity = '1'}
              key={`channel.${id}.banner`}
              src={dataChannel.banner}
              className='relative w-full object-cover opacity-0 transition-opacity'
            />
          </div>
        </div>
        <div className="px-14">
          <div className="flex gap-5">
            <div ref={thumbRef} className="relative w-36 h-auto aspect-square overflow-hidden flex items-center justify-center rounded-full">
              <div className="absolute inset-0 text-7xl leading-none flex items-center justify-center bg-zinc-800">
                {dataChannel.name?.[1]}
              </div>
              {
                loading && <LoaderBox className="absolute inset-0" />
              }
              <div className="absolute inset-0">
                <img
                  key={`channel.${id}.thumb`}
                  src={dataChannel.thumb}
                  className='w-full object-cover'
                />
              </div>
              <div className="absolute inset-0">
                <img
                  onLoad={({ target }: any) => target.style.opacity = '1'}
                  key={`channel.${id}.largeThumb`}
                  src={dataChannel.largeThumb}
                  className='w-full object-cover opacity-0 transition-opacity'
                />
              </div>
              {
                loading && !dataChannel.largeThumb && <LoaderBox className="absolute inset-0" />
              }
            </div>
            <div className="flex flex-col gap-3 pt-2 items-start ">
              {
                loading && !dataChannel.title
                  ? <LoaderBox className="h-9 w-80" />
                  : (
                    <motion.h1
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                      className="text-4xl"
                    >
                      {dataChannel.title}
                    </motion.h1>
                  )
              }
              {
                loading && !dataChannel.name
                  ? <LoaderBox className="h-6 w-24" />
                  : dataChannel.name && (
                    <motion.a
                      href={`https://www.youtube.com/${dataChannel.name}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 }}
                      className="text-xl text-white text-opacity-60 hover:underline"
                    >
                      {dataChannel.name}
                    </motion.a>
                  )
              }
              <div className="flex gap-3 items-center">
                <ListDivisor divisor={
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.3 }}
                    className='text-[10px] text-white text-opacity-60'
                  >
                    &#9679;
                  </motion.span>
                }>
                  {
                    dataChannel.subs && (
                      <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                      >
                        {formatCompact(dataChannel.subs)} subscribes
                      </motion.span>
                    )
                  }
                  {
                    dataChannel.views && (
                      <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1 }}
                        className="text-white text-opacity-60"
                      >
                        {formatCompact(dataChannel.views)} views
                      </motion.span>
                    )
                  }
                  {
                    dataChannel.videos && (
                      <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.1 }}
                        className="text-white text-opacity-60"
                      >
                        {formatCompact(dataChannel.videos)} videos
                      </motion.span>
                    )
                  }
                </ListDivisor>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-10">
          <Tabs value="home">
            <div className="flex gap-5 px-14 border-b border-zinc-800 text-lg">
              <Tabs.trigger value="home">
                Home
              </Tabs.trigger>
              <Tabs.trigger value="videos">
                Videos
              </Tabs.trigger>
            </div>
            <div className="px-14">
              <Home
                currentId={id}
                dataCache={dataCache}
              />
              <Videos
                currentId={id}
                dataCache={dataCache}
              />
            </div>
          </Tabs>
        </div>
      </div>
    </Window >
  )

}