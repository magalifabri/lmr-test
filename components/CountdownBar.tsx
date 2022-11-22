import { motion, Variants } from "framer-motion";
import { dropInShrinkOutVariant } from "../styles/FramerMotionVariants";
import styles from "../styles/CountdownBar.module.scss";

export default function CountdownBar() {
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
