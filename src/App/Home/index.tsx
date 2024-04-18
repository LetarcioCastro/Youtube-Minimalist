import { useEffect, useRef } from 'react';
import Window from "../../Components/ui/Window";
import { useSearchVideos } from "../../Api/search";
import CardVideo, { CardLoader } from "../Video/Card";
import { getItemsId, getVideo } from "../../Api/videos";
import createEvent from "../../Hooks/Event";
import { useInView } from "framer-motion";
import Header from "../Header";

let videos: any[] = []
const [videosListener, videosDispatch] = createEvent(() => videos)


export default function Home() {

  videosListener()

  const loadingRef = useRef(false)
  const windowRef = useRef<HTMLDivElement | null>(null)
  const loaderRef = useRef<HTMLDivElement | null>(null)

  const search = useSearchVideos({
    max: 20,
    type: ['video']
  })

  const loaderInView = useInView(loaderRef, {
    root: windowRef
  })

  const moreVideos = () => {
    if (loadingRef.current) return
    loadingRef.current = true

    search().then(({ items = [] } = {}) => {

      videos = [
        ...videos,
        ...getItemsId(items)
      ]

      videosDispatch()
      loadingRef.current = false
    })
  }

  useEffect(() => {

    loaderInView && moreVideos()

  }, [loaderInView])

  useEffect(() => {

    videos.length == 0 && moreVideos()

  }, [])

  return (
    <Window name="home" saveScroll viewRef={(ref: any) => windowRef.current = ref}>
      <Window.Header>
        <Header key='window.header' />
      </Window.Header>
      {
        videos.length > 0 && (
          <div className='grid grid-cols-4 gap-x-10 gap-y-16 w-full px-14 pb-14 items-start'>
            {
              videos?.map?.((videoId, index) => {

                const dataVideo = getVideo(videoId)

                return !dataVideo.empty && (
                  <CardVideo
                    key={`home.${index}.${videoId}`}
                    id={videoId}
                    data={dataVideo}
                  />
                )

              })
            }
          </div>
        )
      }
      <div ref={loaderRef} className='grid grid-cols-4 gap-x-10 gap-y-16 w-full px-14 pb-14 items-start'>
        {
          Array(12).fill({}).map(({ }, index) => <CardLoader key={index} />)
        }
      </div>
    </Window>
  )

}