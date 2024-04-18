import { FaPlay } from "react-icons/fa6";

import { Link } from "react-router-dom";

import { useRef } from "react";
import { setDataVideoAnimation } from "../../../Globals/video";
import { setVideo, videoType } from "../../../Api/videos";
import { setDataChannelAnimation } from "../../../Globals/channel";
import { LoaderBox } from "../../../Components/ui/Loaders/Skeleton";

type CardTemplateType = {
  id: string,
  data: videoType,
  animation?: boolean,
  channelThumb?: boolean,
  save?: boolean
}

export default function CardVideo({ id, data, animation = true, channelThumb = true, save }: CardTemplateType) {

  const videoRef = useRef<HTMLDivElement>(null)

  return (
    <div className='flex flex-col gap-5'>
      <Link
        to={`/videos/${id}`}
        onClick={() => {
          setDataVideoAnimation({
            initCors: videoRef.current?.getBoundingClientRect(),
            animation,
            thumb: data.thumb,
            largeThumb: data.largeThumb,
          })
          save && setVideo(id, data)
        }}
        className="pointer-events-none">
        <div ref={videoRef} className='group pointer-events-auto group relative aspect-video w-full h-auto flex items-center justify-center overflow-hidden rounded-2xl bg-zinc-900 shadow-2xl shadow-zinc-950 cursor-pointer'>
          <img src={data.thumb} className='w-full object-cover' />
          <div className='absolute flex items-center justify-center h-16 w-16 bg-zinc-900 bg-opacity-70 backdrop-blur rounded-full opacity-0 transition-opacity group-hover:opacity-100'>
            <FaPlay className='ml-1 h-7 w-7' />
          </div>
        </div>
      </Link>
      <div className='group flex gap-4'>
        {
          channelThumb && (
            <Link
              to={`/channels/${data.channelId}`}
              className='flex items-center justify-center h-12 w-12 rounded-full shadow-zinc-950 overflow-hidden'
              onClick={({ target }: any) => {
                setDataChannelAnimation({
                  initCors: target.getBoundingClientRect(),
                  animation: true,
                  thumb: data.dataChannel?.thumb,
                  largeThumb: data.dataChannel?.largeThumb
                })
              }}
            >
              <img src={data.dataChannel?.thumb} className='w-full object-cover' />
            </Link>
          )
        }
        <div className='flex flex-col flex-1 leading-5 gap-2 pt-1'>
          <span className="line-clamp-2">
            {data.title}
          </span>
          <div className='flex gap-2 font-extralight items-center'>
            {data.views && (
              <span>
                {data.views}
              </span>
            )}
            {data.views && data.date && (
              <span className='text-[8px] opacity-80'>
                &#9679;
              </span>
            )}
            {data.date && (
              <span className='opacity-60'>
                {data.date}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )

}

export function CardLoader({ }) {

  return (
    <div className='flex flex-col gap-5'>
      <LoaderBox className="aspect-[16/9] w-full h-auto flex items-center justify-center overflow-hidden rounded-2xl bg-zinc-900 shadow-2xl shadow-zinc-950" />
      <div className='group flex gap-4'>
        <LoaderBox className="h-12 w-12 rounded-full bg-zinc-900 overflow-hidden" />
        <div className='flex flex-col flex-1 gap-2 pt-1'>
          <LoaderBox className="h-4 w-full bg-zinc-900 rounded" />
          <LoaderBox className="h-4 w-3/4 bg-zinc-900 rounded" />
        </div>
      </div>
    </div>
  )

}