import { motion, AnimatePresence, Variants } from "framer-motion";
import { blinkVariant } from "../styles/FramerMotionVariants";
import styles from "../styles/Question.module.scss";

interface AppProps {
    question: string;
}

export default function Question({ question }: AppProps) {
    return (
        <AnimatePresence mode="wait">
            <motion.h1
                className={styles.question}
                key={question}
                variants={blinkVariant as Variants}
                initial="initial"
                animate="animate"
                exit="exit"
            >
                {question}
            </motion.h1>
        </AnimatePresence>
    );
}
