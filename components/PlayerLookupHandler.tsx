"use client"
import type { ChangeEvent } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"

export default function PlayerLookupHandler(): JSX.Element {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const handleSearch = (search: string) => {
    const params = new URLSearchParams(searchParams)
    if (search) {
      params.set("search", search)
    } else {
      params.delete("search")
    }
    replace(`${pathname}?${params.toString()}`)
  }

  return (
    <input
      type="text"
      placeholder="Search Player"
      onChange={(e: ChangeEvent<HTMLInputElement>) => {
        handleSearch(e.target.value)
      }}
      defaultValue={searchParams.get("search")?.toString()}
      spellCheck={false}
      className="ml-1 mr-1 box-border h-10 w-[200px] border border-black pb-0 pl-3 pr-5 pt-0 outline-none focus:border-red-500 xl:ml-0 xl:mr-0"
    />
  )
}
