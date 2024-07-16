import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {faDiscord, faYoutube, faTwitch, faTwitter} from "@fortawesome/free-brands-svg-icons"
import {faTrophy} from "@fortawesome/free-solid-svg-icons"

export default function Footer(): JSX.Element {
    return (
        <div id="footer">
            <span className="footer-item" style={{color: 'white'}}>
                Made by Noah Kaiser, design layout inspired by <a href="https://colorlib.com" target="_blank" style={{textDecoration: "underline"}}>Colorlib</a>.
            </span>
            <span className="footer-item">
                <a href="https://discord.gg/7Y3rNBT" target="_blank" draggable="false">
                <FontAwesomeIcon icon={faDiscord}></FontAwesomeIcon>
                </a>
            </span>
            <span className="footer-item">
                <a href="https://www.youtube.com/@ccrcofficial" target="_blank" draggable="false">
                <FontAwesomeIcon icon={faYoutube}></FontAwesomeIcon>
                </a>
            </span>
            <span className="footer-item">
                <a href="https://www.twitch.tv/ccrcofficial" target="_blank" draggable="false">
                <FontAwesomeIcon icon={faTwitch}></FontAwesomeIcon>
                </a>
            </span>
            <span className="footer-item">
                <a href="https://twitter.com/crossyoff" target="_blank" draggable="false">
                <FontAwesomeIcon icon={faTwitter}></FontAwesomeIcon>
                </a>
            </span>
            <span className="footer-item">
                <a href="https://challonge.com/communities/crossyroad" target="_blank" draggable="false">
                <FontAwesomeIcon icon={faTrophy}></FontAwesomeIcon>
                </a>
            </span>
        </div>
    )
}