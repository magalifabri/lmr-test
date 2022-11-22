import { motion, Variants } from "framer-motion";
import { foldInOutVariant } from "../styles/FramerMotionVariants";
import styles from "../styles/ButtonsContainer.module.scss";

interface AppProps {
    children: React.ReactNode;
}

export default function ButtonsContainer({ children }: AppProps) {
    return (
        <motion.div
            className={styles.buttonsContainer}
            layout
            variants={foldInOutVariant as Variants}
            initial="initial"
            animate="animate"
            exit="exit"
        >
            {children}
        </motion.div>
    );
}
