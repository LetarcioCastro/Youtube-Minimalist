import { useRef } from "react";
import { setVideo, videoType } from "../../../Api/videos";
import { Link } from "react-router-dom";
import { setDataVideoAnimation } from "../../../Globals/video";
import { FaPlay } from "react-icons/fa6";
import { LoaderBox } from "../../../Components/ui/Loaders/Skeleton";

type CardTemplateType = {
  id: string,
  data: videoType,
  animation?: boolean,
  save?: boolean,
}

export default function MineCardVideo({ id, data, animation = true, save = true }: CardTemplateType) {

  const videoRef = useRef<HTMLAnchorElement>(null)

  return (
    <div className='flex items-start gap-3'>
      <Link
        to={`/videos/${id}`}
        ref={videoRef}
        onClick={() => {
          setDataVideoAnimation({
            initCors: videoRef.current?.getBoundingClientRect(),
            animation,
            thumb: data.thumb,
            largeThumb: data.largeThumb,
          })
          save && setVideo(id, data)
        }}
        className='relative group aspect-video w-[45%] h-auto flex items-center justify-center overflow-hidden rounded-xl bg-zinc-900 shadow-2xl shadow-zinc-950 cursor-pointer'
      >
        <img src={data.thumb} className='w-full object-cover' />
        <div className='absolute flex items-center justify-center w-[20%] min-w-12 max-w-16 h-auto aspect-square bg-zinc-900 bg-opacity-70 backdrop-blur rounded-full opacity-0 transition-opacity group-hover:opacity-100'>
          <FaPlay className='ml-1 w-[40%] h-auto aspect-square' />
        </div>
      </Link>
      <div className='flex flex-col flex-1 leading-5 gap-2'>
        <span className="line-clamp-2">
          {data.title}
        </span>
        <Link to={`/channels/${data.channelId}`} className="opacity-70 hover:opacity-100 line-clamp-2">
          {data.dataChannel?.title}
        </Link>
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
  )

}

export function MineCardLoader({ }) {

  return (
    <div className='flex gap-3'>
      <LoaderBox className="aspect-video w-[45%] h-auto rounded-2xl bg-zinc-900 shadow-2xl shadow-zinc-950" />
      <div className='flex flex-col flex-1 gap-2 pt-1'>
        <LoaderBox className="h-4 w-full bg-zinc-900 rounded" />
        <LoaderBox className="h-4 w-1/2 bg-zinc-900 rounded" />
        <LoaderBox className="h-4 w-3/4 bg-zinc-900 rounded" />
      </div>
    </div>
  )

}