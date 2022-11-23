import Avatar from "./Avatar";
import Timer from "./Timer";
import Level from "./Level";
import Description from "./Description";
import StartButton from "./StartButton";
import Navigation from "./Navigation";
import { GamePhase } from "../interfaces/enums";
import styles from "../styles/Sidebar.module.scss";

interface AppProps {
    menuActive: boolean;
    gamePhase: GamePhase;
    setMenuActive: Function;
    setGamePhase: Function;
    children: React.ReactNode;
}

export default function Sidebar({
    menuActive,
    gamePhase,
    setMenuActive,
    setGamePhase,
    children,
}: AppProps) {
    //#region UI HANDLERS

    const onStartButtonClick = () => {
        setGamePhase(GamePhase.PRE_SELECTION);
        setMenuActive(false);
    };
    //#endregion

    //#region RENDER LOGIC

    const getContainerStyling = () => {
        let styling = styles.container;

        if (menuActive) {
            styling += " menuActive " + styles.active;
        }

        return styling;
    };
    //#endregion

    return (
        <div className={getContainerStyling()}>
            <div className={styles.intro}>
                <div className={styles.cover}>
                    <div className={styles.info}>
                        <Timer />
                        <Level />
                    </div>

                    <div className={styles.avatarContainer}>
                        <Avatar />
                        {children} {/* SpeechBubble */}
                    </div>
                </div>

                <div className={styles.content}>
                    <Description />

                    <StartButton
                        condition={gamePhase === GamePhase.GETTING_READY}
                        onStartButtonClick={onStartButtonClick}
                    />
                </div>
            </div>

            <Navigation />
        </div>
    );
}
