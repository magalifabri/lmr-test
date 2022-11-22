import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { speechBubbleVariant } from "../styles/FramerMotionVariants";
import { SpeechBubbleLocation, SpeechBubbleParam } from "../interfaces/enums";
import styles from "../styles/SpeechBubble.module.scss";

const SPEECH_BUBBLE_DURATION_MS = 7500;

interface AppProps {
    location: SpeechBubbleLocation;
    param: SpeechBubbleParam;
    setParam: Function;
}

export default function SpeechBubble({ location, param, setParam }: AppProps) {
    const [content, setContent] = useState("");

    // set content of the speech bubble
    useEffect(() => {
        // don't load new content when there already is content
        if (param !== SpeechBubbleParam.OFF && !content) {
            loadContent();
        }
    }, [param]);

    const loadContent = async () => {
        if (param === SpeechBubbleParam.TIP) {
            const randomAdvice = await getRandomAdvice();
            setContent(randomAdvice);
        } else {
            setContent(param);
        }

        setTimeout(() => {
            setParam(SpeechBubbleParam.OFF);
            setContent("");
        }, SPEECH_BUBBLE_DURATION_MS);
    };

    const getRandomAdvice = async () => {
        const data = await fetch("https://api.adviceslip.com/advice");
        const randomAdviceObj = await data.json();

        return randomAdviceObj.slip.advice;
    };

    return (
        <AnimatePresence>
            {param !== SpeechBubbleParam.OFF && content && (
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
