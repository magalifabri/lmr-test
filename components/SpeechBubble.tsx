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
    const [randomAdvice, setRandomAdvice] = useState("");

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

    const getContainerStyle = () => {
        let style: string = styles.container + " " + styles[location];

        if (active) {
            style += " " + styles.active;
        }

        return style;
    };

    return <div className={getContainerStyle()}>{message || randomAdvice}</div>;
}
