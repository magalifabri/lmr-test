import { useState } from "react";
import Head from "next/head";
import { v4 as uuid } from "uuid";
import Sidebar from "../components/Sidebar";
import Quiz from "../components/Quiz";
import MenuButton from "../components/MenuButton";
import IQuizDataItem from "../interfaces/IQuizDataItem";
import IAnswer from "../interfaces/IAnswer";
import styles from "../styles/Home.module.scss";
import SpeechBubble from "../components/SpeechBubble";
import { GamePhase } from "../interfaces/enums";

// fetch quiz data from API
export async function getServerSideProps() {
    const res = await fetch(`https://lab.lfwd.be/dev-test/quiz_data.json`);
    const quizData = await res.json();

    // add uid to answers to use as key prop
    quizData.map((entry: IQuizDataItem) => {
        entry.answers.map((answer: IAnswer) => {
            answer.uid = uuid();
        });
    });

    return { props: { quizData } };
}

interface AppProps {
    quizData: IQuizDataItem[];
}

export default function Home({ quizData }: AppProps) {
    const [menuActive, setMenuActive] = useState(true);
    const [gamePhase, setGamePhase] = useState(GamePhase.GETTING_READY);
    const [speechBubbleMessage, setSpeechBubbleMessage] = useState("");

    return (
        <>
            <Head>
                <title>page title</title>
                <meta name="description" content="page description" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className={styles.container}>
                {gamePhase !== GamePhase.GETTING_READY && (
                    <MenuButton
                        menuActive={menuActive}
                        setMenuActive={setMenuActive}
                    />
                )}

                <Sidebar
                    menuActive={menuActive}
                    setMenuActive={setMenuActive}
                    gamePhase={gamePhase}
                    setGamePhase={setGamePhase}
                >
                    <SpeechBubble
                        location={"sidebar"}
                        message={speechBubbleMessage}
                        setMessage={setSpeechBubbleMessage}
                    />
                </Sidebar>

                <Quiz
                    quizData={quizData}
                    gamePhase={gamePhase}
                    setGamePhase={setGamePhase}
                    menuActive={menuActive}
                    speechBubbleMessage={speechBubbleMessage}
                    setSpeechBubbleMessage={setSpeechBubbleMessage}
                />
            </div>
        </>
    );
}
