import { Link } from "react-router-dom";
import { channelType } from "../../../Api/channels";
import { LoaderBox } from "../../../Components/ui/Loaders/Skeleton";
import ListDivisor from "../../../Components/ui/ListDivisor";
import { formatCompact } from "../../../Utils";
import { useRef } from "react";
import { setDataChannelAnimation } from "../../../Globals/channel";

export default function CardChannel({ data, id }: { data: channelType, id: string }) {

  const thumbRef = useRef<HTMLAnchorElement | null>(null)

  return (
    <div className="flex gap-5 items-start">
      <Link
        to={`/channels/${id}`}
        ref={thumbRef} 
        className="relative w-32 h-auto aspect-square overflow-hidden flex items-center justify-center rounded-full"
        onClick={() => {
          setDataChannelAnimation({
            initCors: thumbRef.current?.getBoundingClientRect(),
            animation: true
          })
        }}
      >
        <div className="absolute inset-0 text-7xl leading-none flex items-center justify-center bg-zinc-800">
          {data.name?.[1]}
        </div>
        <div className="absolute inset-0">
          <img
            key={`channel.${id}.thumb`}
            src={data.thumb}
            className='w-full object-cover'
          />
        </div>
        <div className="absolute inset-0">
          <img
            onLoad={({ target }: any) => target.style.opacity = '1'}
            key={`channel.${id}.largeThumb`}
            src={data.largeThumb}
            className='w-full object-cover opacity-0 transition-opacity'
          />
        </div>
      </Link>
      <div className="flex flex-col gap-3 items-start ">
        <h1 className="text-4xl">
          {data.title}
        </h1>
        {
          data.name && (
            <Link
              to={`/channels/${id}`}
              className="text-xl text-white text-opacity-60 hover:underline"
              onClick={() => {
                setDataChannelAnimation({
                  initCors: thumbRef.current?.getBoundingClientRect(),
                  animation: true
                })
              }}
            >
              {data.name}
            </Link>
          )
        }
        <div className="flex gap-3 items-center">
          <ListDivisor divisor={
            <span className='text-[10px] text-white text-opacity-60'>
              &#9679;
            </span>
          }>
            {
              data.subs && (
                <span>
                  {formatCompact(data.subs)} subscribes
                </span>
              )
            }
            {
              data.views && (
                <span
                  className="text-white text-opacity-60"
                >
                  {formatCompact(data.views)} views
                </span>
              )
            }
            {
              data.videos && (
                <span
                  className="text-white text-opacity-60"
                >
                  {formatCompact(data.videos)} videos
                </span>
              )
            }
          </ListDivisor>
        </div>
      </div>
    </div>
  )

}

export function CardChannelLoader() {

  return (
    <div className="flex gap-5">
      <div className="relative w-28 h-auto aspect-square overflow-hidden rounded-full">
        <LoaderBox className="absolute inset-0" />
      </div>
      <div className="flex flex-col gap-3 pt-2 items-start ">
        <LoaderBox className="h-9 w-80" />
        <LoaderBox className="h-6 w-24" />
        <LoaderBox className="h-6 w-32" />
      </div>
    </div>
  )

}