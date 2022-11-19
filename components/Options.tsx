import { useEffect } from "react";
import { GamePhase } from "../interfaces/enums";
import IButtonStyles from "../interfaces/IButtonStyles";
import IQuizDataItem from "../interfaces/IQuizDataItem";
import styles from "../styles/Options.module.scss";

interface AppProps {
    question: IQuizDataItem;
    buttonStyles: IButtonStyles;
    setButtonStyles: Function;
    gamePhase: GamePhase;
    onAnswerSelect: Function;
}

export default function Options({
    question,
    buttonStyles,
    setButtonStyles,
    gamePhase,
    onAnswerSelect,
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
        <div className={getOptionsStyling()}>
            {question.answers.map((answer) => (
                <button
                    className={buttonStyles[answer.uid]?.join(" ")}
                    key={answer.uid}
                    disabled={gamePhase !== GamePhase.SELECTION}
                    id={answer.uid}
                    onClick={(e) => {
                        onAnswerSelect((e.target as HTMLElement).id);
                    }}
                >
                    {answer.answer}
                </button>
            ))}
        </div>
    );
}
