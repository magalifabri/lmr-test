import { motion, AnimatePresence } from "framer-motion";
import styles from "../styles/Question.module.scss";

interface AppProps {
    question: string;
}

export default function Question({ question }: AppProps) {
    return (
        <AnimatePresence mode="wait">
            <motion.h1
                key={question}
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{ scaleY: 1, opacity: 1 }}
                exit={{ scaleY: 0, opacity: 0 }}
                className={styles.question}
            >
                {question}
            </motion.h1>
        </AnimatePresence>
    );
}
