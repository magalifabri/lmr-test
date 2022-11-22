import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Avatar from "./Avatar";
import Gif from "./Gif";
import SpeechBubble from "./SpeechBubble";
import CountdownBar from "./CountdownBar";
import Stopwatch from "./Stopwatch";
import Question from "./Question";
import Options from "./Options";
import ButtonsContainer from "./ButtonsContainer";
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
    const [consecCorrectAnswers, setConsecCorrectAnswers] = useState(0);
    const [showGif, setShowGif] = useState(false);
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

                if (seconds === 0) {
                    clearInterval(interval);
                    endSelectionPhase();
                }
            }, 1000);

            setIntervalId(interval);
        }
    }, [gamePhase]);
    //#endregion

    //#region GENERAL FUNCTIONS

    const endSelectionPhase = () => {
        setGamePhase(GamePhase.POST_SELECTION);

        const [newButtonStyles, numCorrectlySelected, numIncorrectlySelected] =
            processSelectedOptions();
        setButtonStyles({ ...newButtonStyles });

        const isAnswerCorrect = checkIsAnswerCorrect(
            numCorrectlySelected,
            numIncorrectlySelected
        );

        if (isAnswerCorrect === true) {
            setSpeechBubbleMessage("Goed gedaan!");
            setConsecCorrectAnswers(consecCorrectAnswers + 1);

            if (consecCorrectAnswers + 1 === quizData.length) {
                setShowGif(true);
                setTimeout(() => {
                    setShowGif(false);
                }, 3000);
            }
        } else {
            setSpeechBubbleMessage("Volgende keer beter!");
            setConsecCorrectAnswers(0);
        }
    };

    const processSelectedOptions = (): [IButtonStyles, number, number] => {
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

    const checkIsAnswerCorrect = (
        numCorrectlySelected: number,
        numIncorrectlySelected: number
    ) => {
        const numCorrectOptions = calcNumCorrectOptions();

        if (
            numCorrectOptions === numCorrectlySelected &&
            !numIncorrectlySelected
        ) {
            return true;
        } else {
            return false;
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
    //#endregion

    //#region UI HANDLERS

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

    const getProceedButtonText = () => {
        const isLastQuestion =
            quizData[quizData.length - 1].question === question.question;

        if (isLastQuestion) {
            return "Opnieuw";
        } else {
            return "Doorgaan";
        }
    };
    //#endregion

    //#region FRAMER MOTION VARIANTS

    const timerVariant = {
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

            <Gif showGif={showGif} />

            <div className={styles.innerContainer}>
                <div className={styles.timerContainer}>
                    <AnimatePresence>
                        {gamePhase === GamePhase.PRE_SELECTION ? (
                            <CountdownBar
                                key="CountdownBar" // required by AnimatePresence
                                animationProps={timerVariant}
                            />
                        ) : (
                            <Stopwatch
                                gamePhase={gamePhase}
                                secondsRemaining={secondsRemaining}
                                key="Stopwatch"
                                animationProps={timerVariant}
                            />
                        )}
                    </AnimatePresence>
                </div>

                <Question question={question.question} />

                <Options
                    question={question}
                    buttonStyles={buttonStyles}
                    setButtonStyles={setButtonStyles}
                    gamePhase={gamePhase}
                    setNumSelected={setNumSelected}
                />

                <AnimatePresence mode="wait" initial={false}>
                    {gamePhase === GamePhase.POST_SELECTION ? (
                        <ButtonsContainer key="buttons1">
                            <button
                                className={
                                    styles.bigButton +
                                    " " +
                                    styles.bigButton__yellow
                                }
                                onClick={() => onProceedButtonClick()}
                            >
                                {getProceedButtonText()}
                            </button>
                        </ButtonsContainer>
                    ) : (
                        <ButtonsContainer key="buttons2">
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
                        </ButtonsContainer>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
