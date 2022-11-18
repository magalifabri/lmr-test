import styles from "../styles/Quiz.module.scss";
import Avatar from "./Avatar";
import SpeechBubble from "./SpeechBubble";
import IQuizDataItem from "../interfaces/IQuizDataItem";
import IButtonStyles from "../interfaces/IButtonStyles";
import { GamePhase } from "../pages/index";
import { useEffect, useState } from "react";

const PRE_SELECTION_PHASE_DURATION_MS = 5000;

type AppProps = {
    quizData: Array<IQuizDataItem>;
    gamePhase: GamePhase;
    setGamePhase: Function;
    menuActive: boolean;
    speechBubbleActive: boolean;
    setSpeechBubbleActive: Function;
};

export default function Quiz({
    quizData,
    gamePhase,
    setGamePhase,
    menuActive,
    speechBubbleActive,
    setSpeechBubbleActive,
}: AppProps) {
    //#region VARIABLES

    const [intervalId, setIntervalId] =
        useState<ReturnType<typeof setInterval>>();
    const [buttonStyles, setButtonStyles] = useState<IButtonStyles>({});
    const [numSelected, setNumSelected] = useState(0);
    const [questionIndex, setQuestionIndex] = useState(0);
    const [question, setQuestion] = useState(quizData[questionIndex]);
    const [secondsRemaining, setSecondsRemaining] = useState(
        question.time_limit_s
    );
    //#endregion

    //#region USE EFFECTS

    // set progress bar styling variables programmatically
    useEffect(() => {
        document.documentElement.style.setProperty(
            "--timeRemainingPercentage",
            "100%"
        );

        document.documentElement.style.setProperty(
            "--timeRemainingMs",
            `${PRE_SELECTION_PHASE_DURATION_MS}ms`
        );
    }, []);

    useEffect(() => {
        if (gamePhase === GamePhase.PRE_SELECTION) {
            setPreSelectionPhaseTimer();
        }

        if (
            gamePhase === GamePhase.GETTING_READY ||
            gamePhase === GamePhase.PRE_SELECTION
        ) {
            initButtonsStyles();
        }
    }, [gamePhase]);

    const setPreSelectionPhaseTimer = () => {
        setTimeout(() => {
            setGamePhase(GamePhase.SELECTION);
        }, PRE_SELECTION_PHASE_DURATION_MS);
    };

    const initButtonsStyles = () => {
        const newButtonStyles = buttonStyles;

        question.answers.forEach((answer) => {
            newButtonStyles[answer.uid] = [styles.optionButton];
        });

        setButtonStyles({ ...newButtonStyles });
    };

    // count down selection phase time remaining
    useEffect(() => {
        if (gamePhase === GamePhase.SELECTION) {
            let seconds = question.time_limit_s;

            const interval = setInterval(() => {
                seconds--;

                setSecondsRemaining(seconds);

                // end of selection phase
                if (seconds === 0) {
                    clearInterval(interval);
                    endSelectionPhase();
                }
            }, 1000);

            setIntervalId(interval);
        }
    }, [gamePhase]);
    //#endregion

    const endSelectionPhase = () => {
        // move to next game phase
        setGamePhase(GamePhase.POST_SELECTION);

        const newButtonStyles = buttonStyles;

        // assign styles to buttons to indicate correctness of selection state
        question.answers.forEach((answer) => {
            if (answer.correct) {
                if (buttonStyles[answer.uid].includes(styles.selected)) {
                    newButtonStyles[answer.uid].push(styles.correctlySelected);
                } else {
                    newButtonStyles[answer.uid].push(
                        styles.incorrectlyUnselected
                    );
                }
            } else {
                if (buttonStyles[answer.uid].includes(styles.selected)) {
                    newButtonStyles[answer.uid].push(
                        styles.incorrectlySelected
                    );
                }
            }
        });

        setButtonStyles({ ...newButtonStyles });
    };

    const goToNextQuestion = () => {
        const nextQuestionIndex =
            questionIndex >= quizData.length - 1 ? 0 : questionIndex + 1;

        setGamePhase(GamePhase.PRE_SELECTION);
        setQuestionIndex(nextQuestionIndex);
        setQuestion(quizData[nextQuestionIndex]);
        setSecondsRemaining(quizData[nextQuestionIndex].time_limit_s);
        setNumSelected(0);
    };

    //#region UI HANDLERS

    const onAnswerSelect = (answerUid: string) => {
        const newButtonStyles = buttonStyles;

        if (buttonStyles[answerUid].includes(styles.selected)) {
            newButtonStyles[answerUid].splice(
                buttonStyles[answerUid].indexOf(answerUid),
                1
            );

            setButtonStyles({ ...newButtonStyles });
            setNumSelected((prevState) => prevState - 1);
        } else {
            newButtonStyles[answerUid].push(styles.selected);

            setButtonStyles({ ...newButtonStyles });
            setNumSelected((prevState) => prevState + 1);
        }
    };

    const onReadyButtonClick = () => {
        clearInterval(intervalId);
        endSelectionPhase();
    };

    const onProceedButtonClick = () => {
        goToNextQuestion();
    };
    //#endregion

    //#region RENDER LOGIC

    const getStopwatchStyle = () => {
        if (
            secondsRemaining <= 5 &&
            secondsRemaining > 0 &&
            gamePhase === GamePhase.SELECTION
        ) {
            return `${styles.stopwatch} ${styles.timeAlmostUp}`;
        } else {
            return styles.stopwatch;
        }
    };

    const getOptionsStyle = () => {
        if (
            gamePhase === GamePhase.GETTING_READY ||
            gamePhase === GamePhase.PRE_SELECTION
        ) {
            return styles.options + " " + styles.options__hidden;
        } else {
            return styles.options;
        }
    };

    const getAvatarContainerStyle = () => {
        if (menuActive) {
            return styles.avatarContainer;
        } else {
            return styles.avatarContainer + " " + styles.active;
        }
    };

    const getTipButtonDisabledState = () => {
        if (gamePhase !== GamePhase.SELECTION || speechBubbleActive) {
            return true;
        } else {
            return false;
        }
    };
    //#endregion

    return (
        <div className={styles.container}>
            {/* avatar container present on mobile only */}
            <div className={getAvatarContainerStyle()}>
                <Avatar />
                <SpeechBubble
                    active={speechBubbleActive}
                    setActive={setSpeechBubbleActive}
                    location={"quiz"}
                />
            </div>

            <div className={styles.innerContainer}>
                <div className={styles.timerContainer}>
                    {gamePhase === GamePhase.PRE_SELECTION ? (
                        <div className={styles.countdownBar}>
                            <div className={styles.countdownBar__fill}></div>
                        </div>
                    ) : (
                        <div className={getStopwatchStyle()}>
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

                <h1 className={styles.question}>{question.question}</h1>

                <div className={getOptionsStyle()}>
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

                {gamePhase === GamePhase.POST_SELECTION ? (
                    <button
                        className={`${styles.bigButton} ${styles.bigButton__yellow}`}
                        onClick={() => onProceedButtonClick()}
                    >
                        Doorgaan
                    </button>
                ) : (
                    <>
                        <button
                            disabled={!numSelected}
                            className={`${styles.bigButton} ${
                                numSelected ? styles.bigButton__yellow : ""
                            }`}
                            onClick={() => onReadyButtonClick()}
                        >
                            Klaar!
                        </button>

                        <button
                            disabled={getTipButtonDisabledState()}
                            className={`${styles.bigButton} ${styles.bigButton__white}`}
                            onClick={() => setSpeechBubbleActive(true)}
                        >
                            Geef me een tip...
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
