import Head from "next/head";
import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";

import Sidebar from "../components/Sidebar";
import Quiz from "../components/Quiz";
import IQuizData from "../interfaces/IQuizData";
import IAnswer from "../interfaces/IAnswer";

import styles from "../styles/Home.module.scss";

// fetch quiz data from API
export async function getServerSideProps() {
    const res = await fetch(`https://lab.lfwd.be/dev-test/quiz_data.json`);
    const quizData = await res.json();

    // add uid to answers to use as key prop
    quizData.map((entry: IQuizData) => {
        entry.answers.map((answer: IAnswer) => {
            answer.uid = uuid();
        });
    });

    return { props: { quizData } };
}

export enum GamePhase {
    PRE_SELECTION,
    SELECTION,
    POST_SELECTION,
}

type AppProps = {
    quizData: IQuizData[];
};

export default function Home({ quizData }: AppProps) {
    const [question, setQuestion] = useState(quizData[0]);
    const [gamePhase, setGamePhase] = useState(GamePhase.PRE_SELECTION);

    useEffect(() => {
        setTimeout(() => {
            setGamePhase(GamePhase.SELECTION);
        }, 5000);
    }, []);

    return (
        <>
            <Head>
                <title>page title</title>
                <meta name="description" content="page description" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className={styles.container}>
                <Sidebar />

                <Quiz quizData={question} gamePhase={gamePhase} />
            </div>
        </>
    );
}
