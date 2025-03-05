"use client"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBars } from "@fortawesome/free-solid-svg-icons"

export default function Navbar(): JSX.Element {
  const [dropdownsVisible, setDropdownsVisible] = useState({
    ranks: "none",
    rules: "none",
  })
  const [mobileNavbarVisible, setMobileNavbarVisible] = useState("none")
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

  const toggleRankDropdown = () => {
    setDropdownsVisible((prevState) => ({
      ...prevState,
      ranks: prevState.ranks === "block" ? "none" : "block",
    }))
  }

  const toggleRulesDropdown = () => {
    setDropdownsVisible((prevState) => ({
      ...prevState,
      rules: prevState.rules === "block" ? "none" : "block",
    }))
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
      setDropdownsVisible({ ranks: "none", rules: "none" })
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
        className={`shadow-custom absolute left-0 top-full mt-0 lg:shadow-none ${mobileNavbarVisible === "flex" ? "flex" : "hidden"} right-[150px] w-full flex-col items-center justify-end bg-white lg:relative lg:left-auto lg:top-auto lg:!flex lg:w-[900px] lg:flex-row lg:bg-transparent`}
      >
        <li className="relative mr-[10px] block w-fit select-none list-none p-1">
          <Link
            draggable="false"
            href="/"
            className="text-xl text-black no-underline hover:cursor-pointer hover:text-red-500"
          >
            Home
          </Link>
        </li>
        <li
          className="relative mr-[10px] block w-fit select-none list-none p-1"
          onMouseEnter={toggleRankDropdown}
          onMouseLeave={toggleRankDropdown}
        >
          <a
            draggable="false"
            className="text-xl text-black no-underline hover:cursor-pointer hover:text-red-500"
          >
            Rankings
          </a>
          <ul
            className={`${dropdownsVisible.ranks === "block" ? "block" : "hidden"} absolute z-[2] mt-1 w-[200px] bg-[#d3d3d3] pb-2 pl-1 pr-1 pt-2`}
          >
            <li className="relative mr-[10px] block w-fit select-none list-none p-1">
              <Link
                draggable="false"
                href="/rankings/elo"
                className="text-xl text-black no-underline hover:cursor-pointer hover:text-red-500"
              >
                Elo
              </Link>
            </li>
            <li className="relative mr-[10px] block w-fit select-none list-none p-1">
              <Link
                draggable="false"
                href="/rankings/mobile"
                className="text-xl text-black no-underline hover:cursor-pointer hover:text-red-500"
              >
                Mobile
              </Link>
            </li>
            <li className="relative mr-[10px] block w-fit select-none list-none p-1">
              <Link
                draggable="false"
                href="/rankings/pc"
                className="text-xl text-black no-underline hover:cursor-pointer hover:text-red-500"
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
            className="text-xl text-black no-underline hover:cursor-pointer hover:text-red-500"
          >
            Tournament Schedule
          </Link>
        </li>
        <li
          className="relative mr-[10px] block w-fit select-none list-none p-1"
          onMouseEnter={toggleRulesDropdown}
          onMouseLeave={toggleRulesDropdown}
        >
          <a
            draggable="false"
            className="text-xl text-black no-underline hover:cursor-pointer hover:text-red-500"
          >
            Rules
          </a>
          <ul
            className={`${dropdownsVisible.rules === "block" ? "block" : "hidden"} absolute z-[2] mt-1 w-[200px] bg-[#d3d3d3] pb-2 pl-1 pr-1 pt-2`}
          >
            <li className="relative mr-[10px] block w-fit select-none list-none p-1">
              <Link
                draggable="false"
                href="/rules/lcs"
                className="text-xl text-black no-underline hover:cursor-pointer hover:text-red-500"
              >
                Last Chicken Standing
              </Link>
            </li>
            <li className="relative mr-[10px] block w-fit select-none list-none p-1">
              <Link
                draggable="false"
                href="/rules/koc"
                className="text-xl text-black no-underline hover:cursor-pointer hover:text-red-500"
              >
                King of Cross
              </Link>
            </li>
            <li className="relative mr-[10px] block w-fit select-none list-none p-1">
              <Link
                draggable="false"
                href="/rules/worlds"
                className="text-xl text-black no-underline hover:cursor-pointer hover:text-red-500"
              >
                CrossyOff Worlds
              </Link>
            </li>
            <li className="relative mr-[10px] block w-fit select-none list-none p-1">
              <Link
                draggable="false"
                href="/rules/challenges"
                className="text-xl text-black no-underline hover:cursor-pointer hover:text-red-500"
              >
                Challenges
              </Link>
            </li>
          </ul>
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
