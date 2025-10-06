"use client"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBars } from "@fortawesome/free-solid-svg-icons"
import { logout } from "@/app/actions"

export default function ClientNavbar({
  avatar,
  latestTable,
}: {
  avatar: string | undefined
  latestTable: string | null
}) {
  const [dropdownsVisible, setDropdownsVisible] = useState<{
    ranks: "block" | "none"
    rules: "block" | "none"
    profile: "block" | "none"
  }>({
    ranks: "none",
    rules: "none",
    profile: "none",
  })
  const [mobileNavbarVisible, setMobileNavbarVisible] = useState<
    "flex" | "none"
  >("none")
  const [navbarShadow, setNavbarShadow] = useState("")
  const pathname = usePathname()

  const toggleMobileNavbar = () => {
    const oppositeState = mobileNavbarVisible === "none" ? "flex" : "none"
    setMobileNavbarVisible(oppositeState)
  }

  const highlightNavbar = () => {
    const navHeight = 100
    window.scrollY >= navHeight
      ? setNavbarShadow("shadow")
      : setNavbarShadow("")
  }

  const rankDropdownHover = () => {
    setDropdownsVisible((prevState) => ({
      ...prevState,
      ranks: "block",
    }))
  }

  const rankDropdownHoverOff = () => {
    setDropdownsVisible((prevState) => ({
      ...prevState,
      ranks: "none",
    }))
  }

  const rulesDropdownHover = () => {
    setDropdownsVisible((prevState) => ({
      ...prevState,
      rules: "block",
    }))
  }

  const rulesDropdownHoverOff = () => {
    setDropdownsVisible((prevState) => ({
      ...prevState,
      rules: "none",
    }))
  }

  const profileDropdownHover = () => {
    setDropdownsVisible((prevState) => ({
      ...prevState,
      profile: "block",
    }))
  }

  const profileDropdownHoverOff = () => {
    setDropdownsVisible((prevState) => ({
      ...prevState,
      profile: "none",
    }))
  }

  const handleLogout = async () => {
    setDropdownsVisible((prevState) => ({
      ...prevState,
      profile: "none",
    }))
    await logout()
  }

  useEffect(() => {
    window.addEventListener("scroll", highlightNavbar)
    return () => window.removeEventListener("scroll", highlightNavbar)
  }, [])

  useEffect(() => {
    if (
      dropdownsVisible.ranks === "block" ||
      dropdownsVisible.rules === "block"
    )
      setDropdownsVisible({ ranks: "none", rules: "none", profile: "none" })
    if (mobileNavbarVisible === "flex") setMobileNavbarVisible("none")
  }, [pathname])

  return (
    <nav
      className={`fixed left-0 top-0 z-[1] flex h-[100px] w-full transform-none items-center bg-white font-sans xl:left-1/2 xl:w-[1200px] xl:-translate-x-1/2 ${navbarShadow && "shadow-custom"}`}
    >
      <Image
        src="/img/logo.png"
        priority={true}
        draggable="false"
        width="100"
        height="100"
        alt="nav logo"
      />
      <h1 className={"z-[1] ml-[10px] select-none text-[30px] font-bold"}>
        <Link className="text-black no-underline hover:text-red-500" href="/">
          CrossyOff
        </Link>
      </h1>
      <ul
        className={`shadow-custom absolute left-0 top-full mt-0 text-sm md:text-base lg:text-lg lg:shadow-none xl:text-xl ${mobileNavbarVisible === "flex" ? "flex" : "hidden"} w-full flex-col items-center bg-white lg:relative lg:left-auto lg:top-auto lg:ml-12 lg:!flex lg:flex-row lg:bg-transparent`}
      >
        <li className="relative mr-[10px] block w-fit select-none list-none p-1">
          <Link
            draggable="false"
            href="/"
            className="text-black no-underline hover:cursor-pointer hover:text-red-500"
          >
            Home
          </Link>
        </li>
        {(latestTable || avatar) && (
          <li className="relative mr-[10px] block w-fit select-none list-none p-1">
            <Link
              draggable="false"
              href={
                latestTable
                  ? `/crossy-road-castle/leaderboard/${latestTable}`
                  : "/crossy-road-castle"
              }
              className="text-black no-underline hover:cursor-pointer hover:text-red-500"
            >
              Crossy Road Castle
            </Link>
          </li>
        )}
        <li
          className="relative mr-[10px] block w-fit select-none list-none p-1"
          onMouseEnter={rankDropdownHover}
          onMouseLeave={rankDropdownHoverOff}
        >
          <a
            draggable="false"
            className="text-black no-underline hover:cursor-pointer hover:text-red-500"
          >
            Rankings
          </a>
          <ul
            className={`text-sm md:text-base lg:text-lg xl:text-xl ${dropdownsVisible.ranks === "block" ? "block" : "hidden"} absolute z-[2] mt-1 w-[200px] bg-[#d3d3d3] pb-2 pl-1 pr-1 pt-2`}
          >
            <li className="relative mr-[10px] block w-fit select-none list-none p-1">
              <Link
                draggable="false"
                href="/rankings/elo"
                className="text-black no-underline hover:cursor-pointer hover:text-red-500"
              >
                Elo
              </Link>
            </li>
            <li className="relative mr-[10px] block w-fit select-none list-none p-1">
              <Link
                draggable="false"
                href="/rankings/mobile"
                className="text-black no-underline hover:cursor-pointer hover:text-red-500"
              >
                Mobile
              </Link>
            </li>
            <li className="relative mr-[10px] block w-fit select-none list-none p-1">
              <Link
                draggable="false"
                href="/rankings/pc"
                className="text-black no-underline hover:cursor-pointer hover:text-red-500"
              >
                PC
              </Link>
            </li>
          </ul>
        </li>
        <li className="relative mr-[10px] block w-fit select-none list-none p-1">
          <Link
            draggable="false"
            href="/schedule"
            className="text-black no-underline hover:cursor-pointer hover:text-red-500"
          >
            Tournament Schedule
          </Link>
        </li>
        <li
          className="relative mr-[10px] block w-fit select-none list-none p-1"
          onMouseEnter={rulesDropdownHover}
          onMouseLeave={rulesDropdownHoverOff}
        >
          <a
            draggable="false"
            className="text-black no-underline hover:cursor-pointer hover:text-red-500"
          >
            Rules
          </a>
          <ul
            className={`text-sm md:text-base lg:text-lg xl:text-xl ${dropdownsVisible.rules === "block" ? "block" : "hidden"} absolute z-[2] mt-1 w-[200px] bg-[#d3d3d3] pb-2 pl-1 pr-1 pt-2`}
          >
            <li className="relative mr-[10px] block w-fit select-none list-none p-1">
              <Link
                draggable="false"
                href="/rules/lcs"
                className="text-black no-underline hover:cursor-pointer hover:text-red-500"
              >
                Last Chicken Standing
              </Link>
            </li>
            <li className="relative mr-[10px] block w-fit select-none list-none p-1">
              <Link
                draggable="false"
                href="/rules/koc"
                className="text-black no-underline hover:cursor-pointer hover:text-red-500"
              >
                King of Cross
              </Link>
            </li>
            <li className="relative mr-[10px] block w-fit select-none list-none p-1">
              <Link
                draggable="false"
                href="/rules/worlds"
                className="text-black no-underline hover:cursor-pointer hover:text-red-500"
              >
                CrossyOff Worlds
              </Link>
            </li>
            <li className="relative mr-[10px] block w-fit select-none list-none p-1">
              <Link
                draggable="false"
                href="/rules/challenges"
                className="text-black no-underline hover:cursor-pointer hover:text-red-500"
              >
                Challenges
              </Link>
            </li>
          </ul>
        </li>
        <li
          className={`relative ${avatar && "lg:ml-auto"} mr-[10px] block w-fit select-none list-none p-1`}
        >
          {avatar ? (
            <div
              onMouseEnter={profileDropdownHover}
              onMouseLeave={profileDropdownHoverOff}
            >
              <div
                className="relative h-12 w-12 cursor-pointer rounded-full border-2 border-black bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: avatar ? `url(${avatar})` : undefined,
                }}
              >
                <ul
                  className={`relative text-sm md:text-base lg:text-lg xl:text-xl ${dropdownsVisible.profile === "block" ? "block" : "hidden"} absolute left-1/2 top-full z-[2] w-20 -translate-x-1/2 bg-[#d3d3d3] pb-2 pl-1 pr-1 pt-2`}
                >
                  <li className="mr-[10px] block w-full select-none list-none p-1 text-center">
                    <span
                      className="text-black no-underline hover:cursor-pointer hover:text-red-500"
                      onClick={handleLogout}
                    >
                      Logoff
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <Link
              draggable="false"
              href={"/login"}
              className="text-black no-underline hover:cursor-pointer hover:text-red-500"
            >
              Login
            </Link>
          )}
        </li>
      </ul>
      <FontAwesomeIcon
        onClick={toggleMobileNavbar}
        icon={faBars}
        className="ml-auto mr-[10px] block cursor-pointer hover:text-red-500 lg:mr-5 lg:!hidden"
        size="2xl"
      />
    </nav>
  )
}
