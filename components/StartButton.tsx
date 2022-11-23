import { motion, AnimatePresence, Variants } from "framer-motion";
import { jiggleAnimSquashOutVariant } from "../styles/FramerMotionVariants";
import styles from "../styles/StartButton.module.scss";

interface AppProps {
    condition: boolean;
    onStartButtonClick: Function;
}

export default function StartButton({
    condition,
    onStartButtonClick,
}: AppProps) {
    return (
        <AnimatePresence>
            {condition && (
                <motion.button
                    onClick={() => {
                        onStartButtonClick();
                    }}
                    className={styles.startButton}
                    variants={jiggleAnimSquashOutVariant as Variants}
                    animate="animate"
                    exit="exit"
                    key="startButton"
                >
                    Aan de slag!
                </motion.button>
            )}
        </AnimatePresence>
    );
}
