import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Avatar from "./Avatar";
import SpeechBubble from "./SpeechBubble";
import CountdownBar from "./CountdownBar";
import Stopwatch from "./Stopwatch";
import Options from "./Options";
import IQuizDataItem from "../interfaces/IQuizDataItem";
import IButtonStyles from "../interfaces/IButtonStyles";
import {
    GamePhase,
    PRE_SELECTION_PHASE_DURATION_MS,
    SpeechBubbleLocation,
    TIP,
} from "../interfaces/enums";
import styles from "../styles/Quiz.module.scss";
import optionsStyles from "../styles/Options.module.scss";

interface AppProps {
    quizData: Array<IQuizDataItem>;
    gamePhase: GamePhase;
    setGamePhase: Function;
    menuActive: boolean;
    speechBubbleMessage: string;
    setSpeechBubbleMessage: Function;
}

export default function Quiz({
    quizData,
    gamePhase,
    setGamePhase,
    menuActive,
    speechBubbleMessage,
    setSpeechBubbleMessage,
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

    //#region useEffects

    useEffect(() => {
        if (gamePhase === GamePhase.PRE_SELECTION) {
            setPreSelectionPhaseTimer();
        }
    }, [gamePhase]);

    const setPreSelectionPhaseTimer = () => {
        setTimeout(() => {
            setGamePhase(GamePhase.SELECTION);
        }, PRE_SELECTION_PHASE_DURATION_MS);
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
        setGamePhase(GamePhase.POST_SELECTION);

        const [newButtonStyles, numCorrectlySelected, numIncorrectlySelected] =
            checkAnswers();
        setButtonStyles({ ...newButtonStyles });

        const speechBubbleMessage = selectSpeechBubbleMessage(
            numCorrectlySelected,
            numIncorrectlySelected
        );
        setSpeechBubbleMessage(speechBubbleMessage);
    };

    const checkAnswers = (): [IButtonStyles, number, number] => {
        const newButtonStyles = buttonStyles;
        let numCorrectlySelected = 0;
        let numIncorrectlySelected = 0;

        // assign styles to buttons to indicate correctness of selection state
        question.answers.forEach((answer) => {
            if (answer.correct) {
                if (buttonStyles[answer.uid].includes(optionsStyles.selected)) {
                    newButtonStyles[answer.uid].push(
                        optionsStyles.correctlySelected
                    );
                    numCorrectlySelected++;
                } else {
                    newButtonStyles[answer.uid].push(
                        optionsStyles.incorrectlyUnselected
                    );
                }
            } else {
                if (buttonStyles[answer.uid].includes(optionsStyles.selected)) {
                    newButtonStyles[answer.uid].push(
                        optionsStyles.incorrectlySelected
                    );
                    numIncorrectlySelected++;
                }
            }
        });

        return [newButtonStyles, numCorrectlySelected, numIncorrectlySelected];
    };

    const selectSpeechBubbleMessage = (
        numCorrectlySelected: number,
        numIncorrectlySelected: number
    ) => {
        const numCorrectOptions = calcNumCorrectOptions();

        if (
            numCorrectOptions === numCorrectlySelected &&
            !numIncorrectlySelected
        ) {
            return "Goed gedaan!";
        } else if (
            numIncorrectlySelected <= 1 &&
            (numCorrectlySelected === numCorrectOptions ||
                numCorrectlySelected + 1 === numCorrectOptions ||
                numCorrectlySelected - 1 === numCorrectOptions)
        ) {
            return "Bijna!";
        } else {
            return "Volgende keer beter!";
        }
    };

    const calcNumCorrectOptions = () => {
        let numCorrectOptions = 0;

        question.answers.forEach(
            (answer) => answer.correct && numCorrectOptions++
        );

        return numCorrectOptions;
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

        if (buttonStyles[answerUid].includes(optionsStyles.selected)) {
            newButtonStyles[answerUid].splice(
                buttonStyles[answerUid].indexOf(answerUid),
                1
            );

            setButtonStyles({ ...newButtonStyles });
            setNumSelected((prevState) => prevState - 1);
        } else {
            newButtonStyles[answerUid].push(optionsStyles.selected);

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

    const getAvatarContainerStyling = () => {
        let styling = styles.avatarContainer;

        if (!menuActive) {
            styling += " " + styles.active;
        }

        return styling;
    };

    const getTipButtonDisabledState = () => {
        if (gamePhase !== GamePhase.SELECTION || speechBubbleMessage) {
            return true;
        } else {
            return false;
        }
    };
    //#endregion

    //#region FRAMER MOTION VARIANTS

    const animationProps = {
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
    //#endregion

    return (
        <div className={styles.container}>
            {/* avatar container present on mobile only */}
            <div className={getAvatarContainerStyling()}>
                <Avatar />
                <SpeechBubble
                    location={SpeechBubbleLocation.QUIZ}
                    message={speechBubbleMessage}
                    setMessage={setSpeechBubbleMessage}
                />
            </div>

            <div className={styles.innerContainer}>
                <div className={styles.timerContainer}>
                    <AnimatePresence>
                        {gamePhase === GamePhase.PRE_SELECTION ? (
                            <CountdownBar
                                key="CountdownBar" // required by AnimatePresence
                                animationProps={animationProps}
                            />
                        ) : (
                            <Stopwatch
                                gamePhase={gamePhase}
                                secondsRemaining={secondsRemaining}
                                key="Stopwatch" // required by AnimatePresence
                                animationProps={animationProps}
                            />
                        )}
                    </AnimatePresence>
                </div>

                <h1 className={styles.question}>{question.question}</h1>

                <Options
                    question={question}
                    buttonStyles={buttonStyles}
                    setButtonStyles={setButtonStyles}
                    gamePhase={gamePhase}
                    onAnswerSelect={onAnswerSelect}
                />

                <AnimatePresence exitBeforeEnter initial={false}>
                    {gamePhase === GamePhase.POST_SELECTION ? (
                        <motion.div
                            className={styles.buttonsContainer}
                            key="buttons1"
                            layout
                            variants={buttonsContainerVariant}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                        >
                            <button
                                className={
                                    styles.bigButton +
                                    " " +
                                    styles.bigButton__yellow
                                }
                                onClick={() => onProceedButtonClick()}
                            >
                                Doorgaan
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            className={styles.buttonsContainer}
                            key="buttons2"
                            layout
                            variants={buttonsContainerVariant}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                        >
                            <button
                                disabled={!numSelected}
                                className={
                                    styles.bigButton +
                                    " " +
                                    styles.bigButton__yellow
                                }
                                onClick={() => onReadyButtonClick()}
                            >
                                Klaar!
                            </button>

                            <button
                                disabled={getTipButtonDisabledState()}
                                className={
                                    styles.bigButton +
                                    " " +
                                    styles.bigButton__white
                                }
                                onClick={() => setSpeechBubbleMessage(TIP)}
                            >
                                Geef me een tip...
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
