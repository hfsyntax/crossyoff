"use cache"

import Image from "next/image"
import Link from "next/link"
import { getMembersCount, getTournamentCount } from "@/actions"
import { unstable_cacheLife as cacheLife } from "next/cache"

export default async function Home() {
  cacheLife("days")
  const tournaments = await getTournamentCount()
  const members = await getMembersCount()
  return (
    <div className="relative left-0 mt-0 flex min-h-[500px] w-full flex-[1_1] transform-none select-none flex-col overflow-auto font-sans md:mt-[150px] md:flex-initial md:flex-row xl:left-1/2 xl:w-[1200px] xl:-translate-x-1/2">
      <Image
        priority={true}
        sizes="(max-width: 768px) 100%, 50%"
        fill={true}
        className="!relative mt-[150px] w-full object-contain md:mb-auto md:mt-auto md:!w-1/2"
        src="/img/main.png"
        alt="home logo"
      />
      <div className="relative flex w-full flex-col md:w-1/2">
        <h2 className="w-full pb-5 pr-5 pt-5 text-center text-[40px] font-bold md:ml-[100px] md:w-[calc(100%_-_120px)] md:text-start">
          Hey, thanks for <span className="text-red-500">crossing</span> by!
        </h2>
        <p className="w-full pb-5 pr-5 pt-5 text-center text-base md:ml-[100px] md:w-[calc(100%_-_120px)] md:text-start">
          CrossyOff is a fan-made Crossy Road platform which allows players at
          any level to compete, learn and meet new friends along the way.
        </p>
        <Link
          href={"https://discord.gg/7Y3rNBT"}
          target="_blank"
          className="relative mb-[50px] ml-auto mr-auto mt-[50px] w-fit border-none bg-red-500 pb-5 pl-10 pr-10 pt-5 font-bold text-white no-underline duration-500 ease-in-out hover:rounded-xl hover:bg-slate-100 hover:text-red-500 lg:left-[100px] lg:ml-0 lg:mr-0"
        >
          Join the Community
        </Link>
        <div className="relative mb-4 mt-auto w-full text-center lg:ml-[100px] lg:w-[calc(100%_-_100px)] lg:text-left">
          <div className="mr-10 inline-block">
            <span className="text-[50px]">{tournaments}</span>
            <br />
            <span className="text-xl">Tournaments</span>
          </div>
          <div className="mr-10 inline-block">
            <span className="text-[50px]">{members}</span>
            <br />
            <span className="text-xl">Members</span>
          </div>
        </div>
      </div>
    </div>
  )
}
