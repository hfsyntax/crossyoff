"use client"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Image from 'next/image'
import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {faBars} from "@fortawesome/free-solid-svg-icons"


export default function Navbar(): JSX.Element {
    const [dropdownsVisible, setDropdownsVisible] = useState({
        ranks: "none", rules: "none"
    });
    const [mobileNavbarVisible, setMobileNavbarVisible] = useState("none");
    const [navbarShadow, setNavbarShadow] = useState("")
    const pathname = usePathname()

    const toggleMobileNavbar = () => {
        const oppositeState = mobileNavbarVisible === "none" ? "flex" : "none"
        setMobileNavbarVisible(oppositeState)
    }

    const highlightNavbar = () => {
        const navHeight = 100
        window.scrollY >= navHeight ? setNavbarShadow("shadow") : setNavbarShadow("")
    }

    const rankDropdownHover = () => {
        setDropdownsVisible({ ...dropdownsVisible, ranks: "block" })
    }

    const rankDropdownHoverOff = () => {
        setDropdownsVisible({ ...dropdownsVisible, ranks: "none" })
    }
    
    const rulesDropdownHover = () => {
        setDropdownsVisible({ ...dropdownsVisible, rules: "block" })
    }

    const rulesDropdownHoverOff = () => {
        setDropdownsVisible({ ...dropdownsVisible, rules: "none" })
    } 
    
    useEffect(() => {
        window.addEventListener("scroll", highlightNavbar)
    }, [])

    useEffect(() => {
        setDropdownsVisible({ranks: "none", rules: "none"})
        setMobileNavbarVisible("none")
    }, [pathname])

    return (
        <nav id="navbar" className={navbarShadow}>
            <Image src="/img/logo.png" priority={true} draggable="false" width="100" height="100" alt="nav logo"/>
            <h1 id="logo"><Link href="/">CrossyOff</Link></h1>
            <ul id="navbar-container" style={{display: mobileNavbarVisible}}>
                <li className="nav-item"><Link draggable="false" href="/">Home</Link></li>
                <li className="nav-item" onMouseEnter={rankDropdownHover} onMouseLeave={rankDropdownHoverOff}><a draggable="false">Rankings</a>
                    <ul className="dropdown" style={{display: dropdownsVisible.ranks}}>
                        <li className="nav-item"><Link draggable="false" href="/rankings/elo">Elo</Link></li>
                        <li className="nav-item"><Link draggable="false" href="/rankings/mobile">Mobile</Link></li>
                        <li className="nav-item"><Link draggable="false" href="/rankings/pc">PC</Link></li>
                    </ul>
                </li>
                <li className="nav-item"><Link draggable="false" href="/schedule">Tournament Schedule</Link></li>
                <li className="nav-item" onMouseEnter={rulesDropdownHover} onMouseLeave={rulesDropdownHoverOff}><a draggable="false">Rules</a>
                    <ul className="dropdown" style={{display: dropdownsVisible.rules}}>
                        <li className="nav-item"><Link draggable="false" href="/rules/lcs">Last Chicken Standing</Link></li>
                        <li className="nav-item"><Link draggable="false" href="/rules/koc">King of Cross</Link></li>
                        <li className="nav-item"><Link draggable="false" href="/rules/worlds">CrossyOff Worlds</Link></li>
                        <li className="nav-item"><Link draggable="false" href="/rules/challenges">Challenges</Link></li>
                    </ul>
                </li>
            </ul>
            <FontAwesomeIcon onClick={toggleMobileNavbar} icon={faBars} id="navbar-mobile-icon" size="2xl"/>
        </nav>
    )
}