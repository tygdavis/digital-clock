import setting from "./assets/setting-white.png";
import menu from "./assets/hamburger-menu.png";
import noAudio from "./assets/no-audio.png";
import audio from "./assets/audio.png";
function Header({ onSettingsClick, player } ) {
    
    const {isPlaying, toggleMusic} = player;

    return(
        <header className="navbar">
            <nav>
                <ul>
                    <li>
                        <button
                            type="button"
                            className="icon-btn"
                            aria-label="Toggle music"
                            title="Music"
                            onClick={toggleMusic}
                        >
                            <img className="icon" src={isPlaying ? audio : noAudio} alt="No audio"/>
                        </button>
                    </li>
                    <li>
                        <button
                            type="button"
                            className="icon-btn"
                            onClick={onSettingsClick}
                            aria-label="Open settings"
                            title="Settings"
                        >
                            <img className="icon" src={setting} alt="Settings" />
                        </button>
                        
                    </li>
                    <li>
                        <button type="button" className="icon-btn" aria-label="Menu">
                            <img className="icon" src={menu} alt="Menu" />
                        </button>
                    </li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;