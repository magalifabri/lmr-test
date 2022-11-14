import styles from "../styles/Quiz.module.scss";
import IQuizData from "../interfaces/IQuizData";
import IButtonStyles from "../interfaces/IButtonStyles";
import { GamePhase } from "../pages/index";
import { useEffect, useState } from "react";

type AppProps = {
    quizData: IQuizData;
    gamePhase: GamePhase;
    setGamePhase: Function;
};

export default function Quiz({ quizData, gamePhase, setGamePhase }: AppProps) {
    //#region VARIABLES

    const [secondsRemaining, setSecondsRemaining] = useState(
        quizData.time_limit_s
    );
    const [intervalId, setIntervalId] =
        useState<ReturnType<typeof setInterval>>();
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [buttonStyles, setButtonStyles] = useState<IButtonStyles>({});
    //#endregion

    //#region USE EFFECTS

    // count down selection phase time remaining
    useEffect(() => {
        if (gamePhase === GamePhase.SELECTION) {
            const interval = setInterval(() => {
                setSecondsRemaining((a) => a - 1);
            }, 1000);

            setIntervalId(interval);
        }
    }, [gamePhase]);

    // trigger end of selection phase
    useEffect(() => {
        if (!secondsRemaining) {
            clearInterval(intervalId);
            console.log("time's up!"); // TODO: remove before prod
        }
    }, [secondsRemaining]);
    //#endregion

    //#region UI HANDLERS

    const onAnswerSelect = (answerUid: string) => {
        if (selectedOptions.includes(answerUid)) {
            const newSelectedOptions = selectedOptions;
            newSelectedOptions.splice(selectedOptions.indexOf(answerUid), 1);
            setSelectedOptions([...newSelectedOptions]);
        } else {
            setSelectedOptions((prevState) => [...prevState, answerUid]);
        }
    };

    const onReadyButtonClick = () => {
        // move to next game phase
        setGamePhase(GamePhase.POST_SELECTION);

        const newButtonStyles = buttonStyles;

        // assign style to buttons to indicate correctness of selection state
        quizData.answers.forEach((answer) => {
            if (answer.correct) {
                if (selectedOptions.includes(answer.uid)) {
                    newButtonStyles[answer.uid] = styles.correctlySelected;
                } else {
                    newButtonStyles[answer.uid] = styles.incorrectlyUnselected;
                }
            } else {
                if (selectedOptions.includes(answer.uid)) {
                    newButtonStyles[answer.uid] = styles.incorrectlySelected;
                }
            }
        });

        setButtonStyles({ ...newButtonStyles });
    };
    //#endregion

    //#region UI HELPERS

    const getOptionButtonClassnames = (answerUid: string) => {
        if (
            gamePhase === GamePhase.SELECTION &&
            selectedOptions.includes(answerUid)
        ) {
            return `${styles.optionButton} ${styles.selected}`;
        } else if (gamePhase === GamePhase.POST_SELECTION) {
            return `${styles.optionButton} ${buttonStyles[answerUid]}`;
        } else {
            return `${styles.optionButton}`;
        }
    };
    //#endregion

    return (
        <div className={styles.container}>
            <div className={styles.innerContainer}>
                <div className={styles.timerContainer}>
                    {gamePhase === GamePhase.PRE_SELECTION ? (
                        <div className={styles.countdownBar}>
                            <div className={styles.countdownBar__fill}></div>
                        </div>
                    ) : (
                        <div className={styles.stopwatch}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 448 512"
                            >
                                {/* <!-- Font Awesome Pro 5.15.4 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) --> */}
                                <path d="M432 304c0 114.9-93.1 208-208 208S16 418.9 16 304c0-104 76.3-190.2 176-205.5V64h-28c-6.6 0-12-5.4-12-12V12c0-6.6 5.4-12 12-12h120c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12h-28v34.5c37.5 5.8 71.7 21.6 99.7 44.6l27.5-27.5c4.7-4.7 12.3-4.7 17 0l28.3 28.3c4.7 4.7 4.7 12.3 0 17l-29.4 29.4-.6.6C419.7 223.3 432 262.2 432 304zm-176 36V188.5c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12V340c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12z" />
                            </svg>
                            0:
                            {secondsRemaining >= 10
                                ? secondsRemaining
                                : "0" + secondsRemaining}
                        </div>
                    )}
                </div>

                <h1 className={styles.question}>{quizData.question}</h1>

                <div
                    className={`${styles.options} ${
                        gamePhase === GamePhase.PRE_SELECTION
                            ? styles.options__hidden
                            : styles.undef
                    }`}
                >
                    {quizData.answers.map((answer) => (
                        <button
                            className={getOptionButtonClassnames(answer.uid)}
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

                <button
                    disabled={!selectedOptions.length}
                    className={`${styles.bigButton} ${
                        selectedOptions.length ? styles.bigButton__yellow : ""
                    }`}
                    onClick={() => onReadyButtonClick()}
                >
                    Klaar!
                </button>

                <button className={styles.bigButton}>Geef me een tip...</button>
                {/* <button>Doorgaan</button> */}
            </div>
        </div>
    );
}
