import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { speechBubbleVariant } from "../styles/FramerMotionVariants";
import { SpeechBubbleLocation, TIP } from "../interfaces/enums";
import styles from "../styles/SpeechBubble.module.scss";

const SPEECH_BUBBLE_DURATION_MS = 7500;

interface AppProps {
    location: SpeechBubbleLocation;
    message: string;
    setMessage: Function;
}

export default function SpeechBubble({
    location,
    message,
    setMessage,
}: AppProps) {
    //#region VARIABLES

    const [active, setActive] = useState(false);
    const [content, setContent] = useState("");
    //#endregion

    //#region useEffects

    // set content of the speech bubble
    useEffect(() => {
        // check that message has a value and that content isn't already being
        // displayed
        if (message && !content) {
            loadContent();
        }
    }, [message]);

    const loadContent = async () => {
        if (message === TIP) {
            const randomAdvice = await getRandomAdvice();
            setContent(randomAdvice);
        } else {
            setContent(message);
        }

        setActive(true);

        setTimeout(() => {
            setActive(false);
            setMessage("");
            setContent("");
        }, SPEECH_BUBBLE_DURATION_MS);
    };

    const getRandomAdvice = async () => {
        const data = await fetch("https://api.adviceslip.com/advice");
        const randomAdviceObj = await data.json();

        return randomAdviceObj.slip.advice;
    };
    //#endregion

    return (
        <AnimatePresence>
            {message && content && (
                <motion.div
                    className={styles.container + " " + styles[location]}
                    key="speechBubble"
                    variants={speechBubbleVariant}
                    custom={location}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                >
                    {content}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
