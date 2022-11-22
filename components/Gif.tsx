import { motion, AnimatePresence } from "framer-motion";
import styles from "../styles/Gif.module.scss";

interface AppProps {
    showGif: boolean;
}

export default function Gif({ showGif }: AppProps) {
    return (
        <>
            <AnimatePresence>
                {showGif && (
                    <motion.iframe
                        key="gif"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={styles.gif}
                        src="https://giphy.com/embed/kAUtsLfsEfqaJRwe80"
                        frameBorder="0"
                    ></motion.iframe>
                )}
            </AnimatePresence>
        </>
    );
}
