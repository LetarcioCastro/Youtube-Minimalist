import { HTMLAttributes, useEffect, useMemo, useRef, useState } from "react";
import { BiSearchAlt2, BiSolidVideoPlus } from "react-icons/bi";
import { BsFillBellFill } from "react-icons/bs";
import { MdOutlineMic } from "react-icons/md";
import { PiCirclesFourFill } from "react-icons/pi";
import { createSpeechRecognition } from "../../Utils";
import { motion, useAnimationControls } from "framer-motion";
import { useNavigate } from "react-router-dom";

const resultInText = (e: SpeechRecognitionEvent) => {

  let text = ''

  for (let list of e.results)
    for (let item of list)
      text += item.transcript || ''

  return text

}

function Speech({ onResult, onPointerDown }: { onResult?: Function, onPointerDown?: Function }) {

  const recognition = useMemo(() => createSpeechRecognition(), [])
  const [listening, setListening] = useState(false)
  const animateControls = useAnimationControls()

  useEffect(() => {
    if (!recognition) return

    recognition.onstart = () => {
      animateControls.start({ scale: 1 })
      setListening(true)
    }
    recognition.onend = () => {
      animateControls.start({ scale: 0 })
      setListening(false)
    }
    recognition.onresult = (e) => onResult?.(resultInText(e))

  }, [])

  return (
    <button className={`relative flex items-center justify-center`}
      onPointerDown={(e) => {
        listening ? recognition?.stop() : recognition?.start()
        onPointerDown?.(e)
      }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={animateControls}
        className="absolute h-10 w-10 rounded-full bg-zinc-800 pointer-events-none"
      />
      <MdOutlineMic className='relative h-6 w-6 cursor-pointer' />
      <motion.div
        initial={{ scale: 0 }}
        animate={animateControls}
        className="absolute h-2 w-2 top-0 right-1 rounded-full bg-red-700 pointer-events-none animate-pulse"
      />
    </button>
  )

}

function ButtonSearch({ ...props }: HTMLAttributes<HTMLButtonElement>) {

  const animateControls = useAnimationControls()

  return (
    <button
      className="relative group flex items-center justify-center"
      onPointerEnter={() => {
        animateControls.start({ scale: 1 })
      }}
      onPointerLeave={() => {
        animateControls.start({ scale: 0 })
      }}
      {...props}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={animateControls}
        className="absolute h-10 w-10 bg-zinc-800 rounded-full pointer-events-none"
      />
      <BiSearchAlt2
        className='relative h-6 w-6 cursor-pointer'
      />
    </button>
  )

}

export function InputSearch({ defaultValue }: { defaultValue?: string }) {

  const [open, setOpen] = useState(!!defaultValue)
  const focusRef = useRef(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const redirect = useNavigate()

  const search = (text: string) => redirect(`/search/${encodeURI(text)}`)

  useEffect(() => {

    open && inputRef.current?.focus()

  }, [open])

  useEffect(() => {

    setOpen(!!defaultValue)

    if (defaultValue == undefined || !inputRef.current) return

    inputRef.current.value = defaultValue

  }, [defaultValue])

  return (
    <div
      className={`flex items-center text-zinc-200 rounded-full gap-3`}
    >
      <ButtonSearch
        onPointerDownCapture={(e) => {
          e.preventDefault()
          setOpen(true)
        }}
        onClick={() => {
          const value = inputRef.current?.value
          value && search(value)
        }}
      />
      <input
        className={`bg-transparent outline-none p-0 leading-none transition-all placeholder:transition-opacity  ${open ? 'w-72 placeholder:opacity-100' : 'w-0 placeholder:opacity-0'}`}
        placeholder="search..."
        ref={inputRef}
        onFocus={() => {
          focusRef.current = true
        }}
        onBlur={({ target }) => {
          target.value == '' && focusRef.current && setOpen(false)
        }}
        onChange={({ target }) => {

          target.value = target.value.replace(/\//g, '')

        }}
        onKeyDown={({ code, target }: any) => code == 'Enter' && search(target.value)}
      />
      <Speech
        onPointerDown={(e: any) => {
          e.preventDefault()
          setOpen(true)
        }}
        onResult={(result: any) => {
          if (!inputRef.current) return

          inputRef.current.value = result

        }}
      />
    </div>
  )
}

export default function Header({ defaultSearch }: { defaultSearch?: string }) {

  return (
    <>
      <InputSearch defaultValue={defaultSearch} />
      <div className='flex gap-6 items-center text-zinc-200'>
        <PiCirclesFourFill className='h-6 w-6' />
        <BiSolidVideoPlus className='h-6 w-6' />
        <BsFillBellFill className='h-6 w-6' />
        <div className='flex items-center justify-center h-8 w-8 rounded-full bg-teal-900 text-sm'>
          d
        </div>
      </div>
    </>
  )

}