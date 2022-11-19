import { useEffect, useState } from "react";
import { SpeechBubbleLocation, TIP } from "../interfaces/enums";
import styles from "../styles/SpeechBubble.module.scss";

const SPEECH_BUBBLE_DURATION_MS = 5000;

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

    // set custom css variables programmatically
    useEffect(() => {
        document.documentElement.style.setProperty(
            "--speechBubbleDurationMs",
            `${SPEECH_BUBBLE_DURATION_MS}ms`
        );
    }, []);

    // set content of the speech bubble
    useEffect(() => {
        if (message) {
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
        }, SPEECH_BUBBLE_DURATION_MS);
    };

    const getRandomAdvice = async () => {
        const data = await fetch("https://api.adviceslip.com/advice");
        const randomAdviceObj = await data.json();

        return randomAdviceObj.slip.advice;
    };
    //#endregion

    //#region RENDER LOGIC

    const getContainerStyling = () => {
        let styling: string = styles.container + " " + styles[location];

        if (active) {
            styling += " " + styles.active;
        }

        return styling;
    };
    //#endregion

    return <div className={getContainerStyling()}>{content}</div>;
}
