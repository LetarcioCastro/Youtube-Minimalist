
import './style.css'
import { HiHome } from "react-icons/hi2";
import { SiYoutubeshorts } from "react-icons/si";
import { VscHistory } from "react-icons/vsc";
import { BsFillClockFill } from "react-icons/bs";
import { FaChevronDown } from "react-icons/fa6";
import { Link, Outlet } from 'react-router-dom';

export default function App({ }) {

  return (
    <div className=' h-screen w-screen bg-zinc-950 text-zinc-50 select-none overflow-hidden'>
      <div className='flex pr-3 py-3 h-full w-full'>
        <div className='flex flex-col p-8 gap-16 items-center'>
          <Link to='/' className='w-8'>
            <svg width="100%" height="auto" viewBox="0 0 800 564" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="800" height="564" rx="166" fill="#D01515" />
              <path d="M305 173.026C305 167.059 311.296 163.193 316.618 165.891L537.993 278.144C543.916 281.147 543.812 289.642 537.818 292.5L316.443 398.044C311.134 400.576 305 396.705 305 390.823V173.026Z" fill="white" />
            </svg>
          </Link>
          <div className='w-6'>
            <svg width="100%" height="auto" viewBox="0 0 783 285" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="783" height="57" rx="28.5" fill="#F1F1F1" />
              <rect x="153" y="228" width="477" height="57" rx="28.5" fill="#F1F1F1" />
            </svg>
          </div>
          <div className='flex flex-col gap-9 items-center'>
            <Link to='/'>
              <HiHome className='w-5 h-5 text-zinc-50' />
            </Link>
            <SiYoutubeshorts className='w-5 h-5 text-zinc-500' />
            <div className='w-5 text-zinc-500'>
              <svg width="100%" height="auto" viewBox="0 0 470 448" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M42 126.415C18.804 126.415 0 145.219 0 168.415V405.869C0 429.065 18.804 447.869 42 447.869H427.54C450.736 447.869 469.54 429.065 469.54 405.869V168.415C469.54 145.219 450.736 126.415 427.54 126.415H42ZM198.807 215.723C192.199 211.4 183 215.709 183 223.127V351.153C183 358.517 192.079 362.838 198.699 358.626L297.917 295.506C303.57 291.91 303.625 284.294 298.024 280.63L198.807 215.723Z" fill="currentColor" />
                <rect x="28.8948" y="63.2073" width="409.945" height="32.5066" rx="16.2533" fill="currentColor" />
                <rect x="74.0428" width="321.454" height="32.5066" rx="16.2533" fill="currentColor" />
              </svg>
            </div>
          </div>
          <div className='flex flex-col gap-9 items-center'>
            <div className='w-5 text-zinc-500'>
              <svg width="100%" height="auto" viewBox="0 0 392 396" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M124 0C96.3858 0 74 22.3858 74 50V268C74 295.614 96.3858 318 124 318H342C369.614 318 392 295.614 392 268V50C392 22.3858 369.614 0 342 0H124ZM209.195 101.72C201.893 96.7432 192 101.973 192 110.81V206.605C192 215.459 201.927 220.684 209.226 215.673L279.244 167.601C285.622 163.222 285.606 153.801 279.213 149.444L209.195 101.72Z" fill="currentColor" />
                <path d="M0 110C0 101.716 6.71573 95 15 95V95C23.2843 95 30 101.716 30 110V337.5C30 353.516 42.9837 366.5 59 366.5H295.25C303.396 366.5 310 373.104 310 381.25V381.25C310 389.396 303.396 396 295.25 396H50C22.3858 396 0 373.614 0 346V110Z" fill="currentColor" />
              </svg>
            </div>
            <VscHistory className='w-5 h-5 text-zinc-500' />
            <BsFillClockFill className='w-5 h-5 text-zinc-500' />
            <FaChevronDown className='w-5 h-5 text-zinc-500' />
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  )

}