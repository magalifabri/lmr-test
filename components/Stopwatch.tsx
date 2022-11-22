import { useEffect } from "react";
import { motion, Variants } from "framer-motion";
import { dropInShrinkOutVariant } from "../styles/FramerMotionVariants";
import {
    GamePhase,
    PRE_SELECTION_PHASE_DURATION_MS,
} from "../interfaces/enums";
import styles from "../styles/Stopwatch.module.scss";

interface AppProps {
    gamePhase: GamePhase;
    secondsRemaining: number;
}

export default function Stopwatch({ gamePhase, secondsRemaining }: AppProps) {
    //#region useEffects

    // set custom css variables programmatically
    useEffect(() => {
        document.documentElement.style.setProperty(
            "--timeRemainingMs",
            `${PRE_SELECTION_PHASE_DURATION_MS}ms`
        );
    }, []);
    //#endregion

    //#region RENDER LOGIC

    const getStopwatchStyling = () => {
        let styling = styles.stopwatch;

        if (
            secondsRemaining <= 5 &&
            secondsRemaining > 0 &&
            gamePhase === GamePhase.SELECTION
        ) {
            styling += " " + styles.timeAlmostUp;
        }

        return styling;
    };
    //#endregion

    return (
        <motion.div
            className={getStopwatchStyling()}
            variants={dropInShrinkOutVariant as Variants}
            initial="initial"
            animate="animate"
            exit="exit"
        >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                {/* <!-- Font Awesome Pro 5.15.4 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) --> */}
                <path d="M432 304c0 114.9-93.1 208-208 208S16 418.9 16 304c0-104 76.3-190.2 176-205.5V64h-28c-6.6 0-12-5.4-12-12V12c0-6.6 5.4-12 12-12h120c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12h-28v34.5c37.5 5.8 71.7 21.6 99.7 44.6l27.5-27.5c4.7-4.7 12.3-4.7 17 0l28.3 28.3c4.7 4.7 4.7 12.3 0 17l-29.4 29.4-.6.6C419.7 223.3 432 262.2 432 304zm-176 36V188.5c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12V340c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12z" />
            </svg>
            0:
            {secondsRemaining >= 10 ? secondsRemaining : "0" + secondsRemaining}
        </motion.div>
    );
}
