import { motion, Variants } from "framer-motion";

import styles from "../styles/CountdownBar.module.scss";

interface AppProps {
    animationProps: Variants;
}

export default function CountdownBar({ animationProps }: AppProps) {
    return (
        <motion.div
            className={styles.countdownBar}
            variants={animationProps}
            initial="initial"
            animate="animate"
            exit="exit"
        >
            <div className={styles.countdownBar__fill}></div>
        </motion.div>
    );
}
