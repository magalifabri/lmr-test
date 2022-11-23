import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GamePhase } from "../data_structures/enums";
import IButtonStyles from "../data_structures/IButtonStyles";
import IQuizDataItem from "../data_structures/IQuizDataItem";
import styles from "../styles/Options.module.scss";

interface AppProps {
    question: IQuizDataItem;
    buttonStyles: IButtonStyles;
    setButtonStyles: Function;
    gamePhase: GamePhase;
    setNumSelected: Function;
}

export default function Options({
    question,
    buttonStyles,
    setButtonStyles,
    gamePhase,
    setNumSelected,
}: AppProps) {
    //#region useEffects

    useEffect(() => {
        if (
            gamePhase === GamePhase.GETTING_READY ||
            gamePhase === GamePhase.PRE_SELECTION
        ) {
            initButtonsStyles();
        }
    }, [gamePhase]);

    const initButtonsStyles = () => {
        const newButtonStyles = buttonStyles;

        question.answers.forEach((answer) => {
            newButtonStyles[answer.uid] = [styles.optionButton];
        });

        setButtonStyles({ ...newButtonStyles });
    };
    //#endregion

    //#region UI HANDLERS

    const onOptionClick = (answerUid: string) => {
        const isOptionSelected = buttonStyles[answerUid].includes(
            styles.selected
        );
        const newButtonStyles = buttonStyles;

        if (isOptionSelected) {
            newButtonStyles[answerUid].pop();
            setNumSelected((prevState: number) => prevState - 1);
        } else {
            newButtonStyles[answerUid].push(styles.selected);
            setNumSelected((prevState: number) => prevState + 1);
        }

        setButtonStyles({ ...newButtonStyles });
    };
    //#endregion

    //#region RENDER LOGIC

    const getOptionsStyling = () => {
        let styling = styles.options;

        if (
            gamePhase === GamePhase.GETTING_READY ||
            gamePhase === GamePhase.PRE_SELECTION
        ) {
            styling += " " + styles.options__hidden;
        }

        return styling;
    };
    //#endregion

    return (
        <AnimatePresence mode="wait">
            <motion.div
                className={getOptionsStyling()}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                key={question.question}
            >
                {question.answers.map((answer, i) => (
                    <motion.button
                        className={buttonStyles[answer.uid]?.join(" ")}
                        key={answer.uid}
                        disabled={gamePhase !== GamePhase.SELECTION}
                        id={answer.uid}
                        onClick={(e) => {
                            onOptionClick((e.target as HTMLElement).id);
                        }}
                    >
                        {answer.answer}
                    </motion.button>
                ))}
            </motion.div>
        </AnimatePresence>
    );
}
