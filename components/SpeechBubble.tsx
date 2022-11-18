import { useEffect, useState } from "react";
import styles from "../styles/SpeechBubble.module.scss";

interface AppProps {
    active: boolean;
    setActive: Function;
    location: "sidebar" | "quiz";
    message?: string;
}

export default function SpeechBubble({
    active,
    setActive,
    location,
    message,
}: AppProps) {
    //#region VARIABLES

    const [randomAdvice, setRandomAdvice] = useState("");
    //#endregion

    //#region useEffects

    const getRandomAdvice = async () => {
        const res = await fetch("https://api.adviceslip.com/advice");
        const advice = await res.json();

        setRandomAdvice(advice.slip.advice);
    };

    useEffect(() => {
        if (active) {
            if (!message) {
                getRandomAdvice();
            }

            setTimeout(() => {
                setActive(false);
            }, 5000);
        }
    }, [active]);
    //#endregion

    //#region RENDER LOGIC

    const getContainerStyle = () => {
        let style: string = styles.container + " " + styles[location];

        if (active) {
            style += " " + styles.active;
        }

        return style;
    };
    //#endregion

    return <div className={getContainerStyle()}>{message || randomAdvice}</div>;
}
