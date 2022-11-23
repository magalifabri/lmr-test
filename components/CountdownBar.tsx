import { useEffect } from "react";
import { motion, Variants } from "framer-motion";
import { dropInShrinkOutVariant } from "../styles/FramerMotionVariants";
import styles from "../styles/CountdownBar.module.scss";

interface AppProps {
    duration: number;
}

export default function CountdownBar({ duration }: AppProps) {
    // set custom css variables programmatically
    useEffect(() => {
        document.documentElement.style.setProperty(
            "--preSelectionPhaseDuration",
            `${duration}ms`
        );
    }, []);

    return (
        <motion.div
            className={styles.countdownBar}
            variants={dropInShrinkOutVariant as Variants}
            initial="initial"
            animate="animate"
            exit="exit"
        >
            <div className={styles.countdownBar__fill}></div>
        </motion.div>
    );
}
