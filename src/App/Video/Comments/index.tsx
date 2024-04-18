import { motion, useAnimationControls, useInView } from 'framer-motion'
import { MutableRefObject, ReactNode, useEffect, useRef, useState } from 'react'
import { commentType, replyType, restComments } from '../../../Api/comments'
import { useReload } from '../../../Hooks/Utils'
import ListDivisor from '../../../Components/ui/ListDivisor'
import { BiLike } from 'react-icons/bi'
import { TextDom, formatCompact, formatDate } from '../../../Utils'
import Paragraph from '../../../Components/ui/Text/Paragraph'
import { FaAngleDown } from "react-icons/fa";
import { LoaderBox } from '../../../Components/ui/Loaders/Skeleton'
import { Link } from 'react-router-dom'
import { addBlackListCache } from '../../../Globals/channel'

function CommentTemplate({ data, children, smallProfile = false }: { data: replyType, smallProfile?: boolean, children?: ReactNode }) {

  return (
    <>
      <Link
        to={`/channels/${data.authorId}`}
        className={`relative ${smallProfile ? 'h-10 w-10' : 'h-12 w-12'} rounded-full flex items-center justify-center bg-zinc-900 overflow-hidden`}
        onClick={() => data.authorId && addBlackListCache(data.authorId)}
      >
        <div className='absolute inset-0 flex items-center justify-center'>
          <span className='text-2xl'>
            {data.author?.[1]}
          </span>
        </div>
        {
          data.profile && (
            <img
              src={data.profile}
              className='relative h-full object-cover' style={{ opacity: 0 }}
              onLoad={({ target }: { target: any }) => target.style.opacity = '1'}
            />
          )
        }
      </Link>
      <div className='flex flex-col gap-1'>
        <div className='flex gap-3 leading-none'>
          <Link to={`/channels/${data.authorId}`} className='text-sm hover:underline'>
            {data.author}
          </Link>
          <div className='flex gap-2 items-center opacity-50'>
            <ListDivisor divisor={
              <span className='text-[10px]'>
                &#9679;
              </span>
            }>
              {
                data.likes && (
                  <div className='flex gap-1'>
                    <BiLike /> {formatCompact(data.likes)}
                  </div>
                )
              }
              {
                data.date && (
                  <div className='flex gap-1'>
                    {formatDate(data.date)}
                  </div>
                )
              }
            </ListDivisor>
          </div>
        </div>
        {
          data.text && (
            <Paragraph className='max-w-2xl' clamp={4}>
              <TextDom>
                {data.text}
              </TextDom>
            </Paragraph>
          )
        }
        {children}
      </div>
    </>

  )

}

function CommentReplies({ replies }: { replies: replyType[] }) {

  const [open, setOpen] = useState(false)

  return (
    <div className='flex flex-col gap-3 items-start'>
      <button
        className='flex items-center gap-2 rounded-full text-white text-opacity-70 hover:text-opacity-100'
        onClick={() => setOpen(open => !open)}
      >
        <motion.span
          className='transition-transform'
          style={{
            rotateX: open ? '0.5turn' : '0turn'
          }}
        >
          <FaAngleDown size={18} />
        </motion.span>
        {replies.length} replies
      </button>
      {
        open && (
          <motion.div className='flex flex-col gap-5'>
            {
              replies.map((reply, index) => {

                return (
                  <motion.div
                    key={index}
                    className='flex gap-3'
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <CommentTemplate data={reply} smallProfile />
                  </motion.div>
                )

              })
            }
          </motion.div>
        )
      }
    </div>
  )

}

function Comment({ data }: { data: commentType }) {

  return (
    <div className='flex gap-3'>
      <CommentTemplate data={data}>
        {
          data.replies.length > 0 && (
            <CommentReplies replies={data.replies} />
          )
        }
      </CommentTemplate>
    </div>
  )

}

function LoaderComments({ viewRef, moreComments, amount = 10, hidden = false, currentId }: {
  amount?: number,
  currentId?: string | undefined,
  viewRef: MutableRefObject<HTMLDivElement | null>,
  moreComments?: Function,
  hidden?: boolean
}) {

  const containerRef = useRef<HTMLDivElement>(null)

  const getDiffBottom = (): number => {

    const { top = 0 } = containerRef.current?.getBoundingClientRect() || {}
    const { bottom = window.innerHeight } = viewRef.current?.getBoundingClientRect() || {}

    return top - bottom

  }

  const inView = useInView(containerRef, {
    root: viewRef
  })

  useEffect(() => {

    if (inView) {
      moreComments?.()
      return
    }

    getDiffBottom() < 0 && moreComments?.()

  }, [inView, currentId])

  return (

    <div ref={containerRef} className='flex flex-col gap-8 min-h-2'>
      {!hidden && Array(amount).fill({}).map(({ }, index) => {

        return (
          <div className='flex gap-3' key={index}>
            <LoaderBox className='h-12 w-12 rounded-full' />
            <div className='flex flex-col gap-2'>
              <LoaderBox className='h-4 w-32 rounded-full' />
              <LoaderBox
                key={index}
                className='h-5 w-56 rounded-full'
              />
            </div>
          </div>
        )

      })}
    </div>

  )

}

export default function Comments({ amount, currentId, viewRef }: {
  amount?: string,
  currentId?: string | undefined,
  viewRef: MutableRefObject<HTMLDivElement | null>
}) {

  const commentsCache = useRef<{ [key: string]: commentType[] }>({})
  const saveTokens = useRef<{ [key: string]: string }>({})

  const loadingRef = useRef(false)

  const comments = currentId ? commentsCache.current[currentId] ?? [] : []
  const amountReplies = comments.reduce((acc, { replies = [] }) => acc += replies.length + 1, 0)
  const limitReplies = parseInt(amount || '0') <= amountReplies

  const reload = useReload()

  const animateControl = useAnimationControls()

  const moreComments = () => {

    if (!currentId || loadingRef.current || limitReplies) return
    loadingRef.current = true

    restComments(currentId, {
      page: saveTokens.current[currentId]
    }).then(({ items, nextPageToken }) => {

      saveTokens.current[currentId] = nextPageToken

      commentsCache.current[currentId] = [
        ...(commentsCache.current[currentId] || []),
        ...items,
      ]

      loadingRef.current = false
      reload()

    })

  }

  useEffect(() => {

    animateControl.set({ opacity: 0 })
    animateControl.start({ opacity: 1 }, {
      delay: 1.4
    })

  }, [currentId])

  return (
    <div className="flex flex-col gap-3">
      <motion.h1
        key={`comments.${currentId}.h1`}
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 1.1 }}
        className='text-lg'
      >
        {amount ? formatCompact(amount) : '0'} comments
      </motion.h1>
      <motion.div
        className='flex flex-col gap-8'
        initial={{ opacity: 0 }}
        animate={animateControl}
        transition={{ delay: 1.3 }}
      >
        {
          amountReplies > 0 && (
            <div className='flex flex-col gap-8'>
              {
                comments.map((comment, index) => {

                  return <Comment key={index} data={comment} />

                })
              }
            </div>
          )
        }
        <LoaderComments
          viewRef={viewRef}
          currentId={currentId}
          hidden={limitReplies}
          moreComments={() => moreComments()}
        />
      </motion.div>
    </div>
  )

}