import { useEffect, useState } from "react";
import styles from "../styles/SpeechBubble.module.scss";

type AppProps = {
    active: boolean;
    setActive: Function;
    message?: string;
};
export default function SpeechBubble({ active, setActive, message }: AppProps) {
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
        if (active) {
            return styles.container + " " + styles.active;
        } else {
            return styles.container;
        }
    };

    return <div className={getContainerStyle()}>{message || randomAdvice}</div>;
}
