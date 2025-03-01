import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faDiscord,
  faYoutube,
  faTwitch,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons"
import { faTrophy } from "@fortawesome/free-solid-svg-icons"

export default function Footer(): JSX.Element {
  return (
    <div className="relative left-0 mt-auto flex w-full select-none items-center justify-center bg-black p-3">
      <span className="mr-5 text-xs text-white md:text-base">
        Made by Noah Kaiser, design layout inspired by{" "}
        <a
          href="https://colorlib.com"
          target="_blank"
          className="text-white underline hover:text-red-500"
        >
          Colorlib
        </a>
        .
      </span>
      <span className="mr-5">
        <a
          href="https://discord.gg/7Y3rNBT"
          target="_blank"
          draggable="false"
          className="text-white no-underline hover:text-red-500"
        >
          <FontAwesomeIcon icon={faDiscord}></FontAwesomeIcon>
        </a>
      </span>
      <span className="mr-5">
        <a
          href="https://www.youtube.com/@ccrcofficial"
          target="_blank"
          draggable="false"
          className="text-white no-underline hover:text-red-500"
        >
          <FontAwesomeIcon icon={faYoutube}></FontAwesomeIcon>
        </a>
      </span>
      <span className="mr-5">
        <a
          href="https://www.twitch.tv/ccrcofficial"
          target="_blank"
          draggable="false"
          className="text-white no-underline hover:text-red-500"
        >
          <FontAwesomeIcon icon={faTwitch}></FontAwesomeIcon>
        </a>
      </span>
      <span className="mr-5">
        <a
          href="https://twitter.com/crossyoff"
          target="_blank"
          draggable="false"
          className="text-white no-underline hover:text-red-500"
        >
          <FontAwesomeIcon icon={faTwitter}></FontAwesomeIcon>
        </a>
      </span>
      <span className="mr-5">
        <a
          href="https://challonge.com/communities/crossyroad"
          target="_blank"
          draggable="false"
          className="text-white no-underline hover:text-red-500"
        >
          <FontAwesomeIcon icon={faTrophy}></FontAwesomeIcon>
        </a>
      </span>
    </div>
  )
}
