import { MotionProps } from "framer-motion";

export const dropInShrinkOutVariant: MotionProps = {
    initial: {
        y: -100,
        opacity: 0,
    },
    animate: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.5,
            delay: 0.5,
            type: "spring",
            bounce: 0.5,
        },
    },
    exit: {
        scale: 0,
        opacity: 0,
        transition: {
            duration: 1,
        },
    },
};

export const foldInOutVariant: MotionProps = {
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

export const blinkVariant: MotionProps = {
    initial: {
        scaleY: 0,
        opacity: 0,
    },
    animate: {
        scaleY: 1,
        opacity: 1,
    },
    exit: {
        scaleY: 0,
        opacity: 0,
    },
};
