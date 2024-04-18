import { HTMLAttributes, ReactNode, createContext, useContext, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { LayoutGroup, motion } from "framer-motion";

type TabsType = {
  value: string,
  valueChange?: Function
}

type contextType = {
  value: string,
  setTab?: Function,
}

const tabsContext = createContext<contextType>({ value: 'default' })

export default function Tabs({ children, value: initValue, valueChange }: TabsType & HTMLAttributes<HTMLDivElement>) {

  const [value, setValue] = useState(initValue)

  const setTab = (value: string) => {
    valueChange?.(value)
    setValue?.(value)
  }

  useEffect(() => {

    setValue(value)

  }, [initValue])

  return (
    <tabsContext.Provider value={{ value, setTab }}>
      <LayoutGroup>
        {children}
      </LayoutGroup>
    </tabsContext.Provider>

  )

}

export function TabsTrigger({ className, children, value: valueTab, ...props }: { value: string } & HTMLAttributes<HTMLButtonElement>) {

  const { value, setTab } = useContext(tabsContext)

  const isCurrentTab = value == valueTab

  return (
    <button className={twMerge('relative px-2 pb-4 leading-none opacity-70 hover:opacity-100', isCurrentTab && 'opacity-100', className)} onClick={() => setTab?.(valueTab)} {...props}>
      {children}
      {
        isCurrentTab && (
          <motion.div
            layoutId='underline'
            initial={{ y: '0' }}
            className="absolute h-[3px] bg-zinc-200 inset-x-0 bottom-0 rounded"
          />
        )
      }
    </button>
  )

}

Tabs.trigger = TabsTrigger

export function TabsList({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {

  return (
    <div className={twMerge('flex gap-1 border-b border-zinc-500', className)} {...props}>
      {children}
    </div>
  )

}

Tabs.list = TabsList

export function TabsContent({ value: valueTab, children }: { value: string, children: ReactNode }) {

  const { value } = useContext(tabsContext)

  return value == valueTab && (
    <>
      {children}
    </>
  )

}

Tabs.content = TabsContent