import { useEffect, useState } from "react";
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

        const [newButtonStyles, numCorrectlySelected] = checkAnswers();
        setButtonStyles({ ...newButtonStyles });

        const speechBubbleMessage =
            selectSpeechBubbleMessage(numCorrectlySelected);
        setSpeechBubbleMessage(speechBubbleMessage);
    };

    const checkAnswers = (): [IButtonStyles, number] => {
        const newButtonStyles = buttonStyles;
        let numCorrectlySelected = 0;

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
                }
            }
        });

        return [newButtonStyles, numCorrectlySelected];
    };

    const selectSpeechBubbleMessage = (numCorrectlySelected: number) => {
        const numCorrectOptions = calcNumCorrectOptions();

        if (numCorrectOptions === numCorrectlySelected) {
            return "Goed gedaan!";
        } else if (
            numCorrectlySelected &&
            numCorrectOptions > numCorrectlySelected
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
                    {gamePhase === GamePhase.PRE_SELECTION ? (
                        <CountdownBar />
                    ) : (
                        <Stopwatch
                            gamePhase={gamePhase}
                            secondsRemaining={secondsRemaining}
                        />
                    )}
                </div>

                <h1 className={styles.question}>{question.question}</h1>

                <Options
                    question={question}
                    buttonStyles={buttonStyles}
                    setButtonStyles={setButtonStyles}
                    gamePhase={gamePhase}
                    onAnswerSelect={onAnswerSelect}
                />

                {gamePhase === GamePhase.POST_SELECTION ? (
                    <button
                        className={
                            styles.bigButton + " " + styles.bigButton__yellow
                        }
                        onClick={() => onProceedButtonClick()}
                    >
                        Doorgaan
                    </button>
                ) : (
                    <>
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
                                styles.bigButton + " " + styles.bigButton__white
                            }
                            onClick={() => setSpeechBubbleMessage(TIP)}
                        >
                            Geef me een tip...
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
