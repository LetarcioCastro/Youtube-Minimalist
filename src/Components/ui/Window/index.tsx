
import * as ScrollArea from '@radix-ui/react-scroll-area';
import { useScroll, useTransform, motion, motionValue, HTMLMotionProps } from 'framer-motion';
import { HTMLAttributes, createContext, useContext, useEffect, useRef } from 'react';
import { twMerge } from 'tailwind-merge';

type headerType = HTMLDivElement | null

type windowProps = HTMLAttributes<HTMLDivElement> & {
  defaultHeight?: number,
  name: string,
  saveScroll?: boolean,
  viewRef?: Function
}

const WindowContext = createContext({ y: motionValue(0), setHeaderRef: (ref: headerType) => { ref } })

const scrollsTop: { [key: string]: number } = {}

export default function Window({ children, defaultHeight = 72, name, saveScroll = false, viewRef }: windowProps) {

  const scrollRef = useRef<HTMLDivElement | null>(null)
  const headerRef = useRef<headerType>(null)

  const setHeaderRef = (ref: headerType) => { ref && (headerRef.current = ref) }

  const { scrollY } = useScroll({
    container: scrollRef
  })

  const topRef = useRef(0)

  const headerHeight = headerRef.current?.offsetHeight || defaultHeight

  useEffect(() => {

    saveScroll && scrollRef.current?.scrollTo({ top: scrollsTop[name] })

  }, [])

  const y = useTransform(() => {

    const y = scrollY.get()
    const headerHeight = headerRef.current?.offsetHeight || defaultHeight
    if (y <= topRef.current) {
      y <= headerHeight && headerRef.current?.style.setProperty('--tw-bg-opacity', `${y / headerHeight}`)
      return topRef.current = y
    }

    if (y >= topRef.current + headerHeight) {
      headerRef.current?.style.setProperty('--tw-bg-opacity', `1`)
      return topRef.current = y - headerHeight
    }

    return topRef.current

  })

  return (
    <motion.div
      key={`window.${name}`}
      className='h-full flex-1 rounded-3xl bg-zinc-900 bg-opacity-60 flex flex-col overflow-hidden'
    >
      <ScrollArea.Root className='relative h-full w-full'>
        <ScrollArea.ScrollAreaViewport className='h-full w-full' ref={(ref) => {
          scrollRef.current = ref
          viewRef?.(ref)
        }}
          onScroll={() => {
            scrollsTop[name] = scrollRef.current?.scrollTop || 0
          }}>
          <WindowContext.Provider value={{ y, setHeaderRef }}>
            <div className='flex flex-col gap-4'>
              {children}
            </div>
          </WindowContext.Provider>
        </ScrollArea.ScrollAreaViewport>
        <ScrollArea.ScrollAreaScrollbar className='relative w-2 p-[1px] rounded-full bg-zinc-900 mb-1 mr-10' style={{
          marginTop: `${headerHeight + 16}px`
        }}>
          <ScrollArea.ScrollAreaThumb className='w-full rounded-full bg-zinc-800 hover:bg-zinc-700' />
        </ScrollArea.ScrollAreaScrollbar>
      </ScrollArea.Root>
    </motion.div>
  )

}


function WindowHeader({ className, children, style, ...props }: HTMLMotionProps<'div'>) {

  const { y, setHeaderRef } = useContext(WindowContext)

  return (
    <motion.div
      className={twMerge(
        'flex gap-7 justify-between items-end z-30 px-14 bg-zinc-900 pb-4 bg-opacity-0 shadow shadow-transparent transition-colors h-[72px]',
        className
      )}
      ref={setHeaderRef}
      style={{
        y,
        ...style,
      }}
      {...props}
    >
      {children}
    </motion.div>
  )

}

Window.Header = WindowHeader