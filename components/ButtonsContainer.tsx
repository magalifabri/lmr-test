import { motion } from "framer-motion";
import styles from "../styles/ButtonsContainer.module.scss";

interface AppProps {
    children: React.ReactNode;
}

export default function ButtonsContainer({ children }: AppProps) {
    const buttonsContainerVariant = {
        initial: {
            scaleY: 0,
            opacity: 0,
        },
        animate: {
            scaleY: 1,
            opacity: 1,
        },
        exit: {
            scaleX: 0,
            opacity: 0,
        },
    };

    return (
        <motion.div
            className={styles.buttonsContainer}
            layout
            variants={buttonsContainerVariant}
            initial="initial"
            animate="animate"
            exit="exit"
        >
            {children}
        </motion.div>
    );
}
