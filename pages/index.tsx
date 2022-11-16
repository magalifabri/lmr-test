import { useState } from "react";
import Head from "next/head";
import { v4 as uuid } from "uuid";

import Sidebar from "../components/Sidebar";
import Quiz from "../components/Quiz";
import MenuButton from "../components/MenuButton";
import IQuizDataItem from "../interfaces/IQuizDataItem";
import IAnswer from "../interfaces/IAnswer";

import styles from "../styles/Home.module.scss";

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

export enum GamePhase {
    PRE_SELECTION,
    SELECTION,
    POST_SELECTION,
}

type AppProps = {
    quizData: IQuizDataItem[];
};

export default function Home({ quizData }: AppProps) {
    const [menuActive, setMenuActive] = useState(true);

    return (
        <>
            <Head>
                <title>page title</title>
                <meta name="description" content="page description" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className={styles.container}>
                <MenuButton
                    menuActive={menuActive}
                    setMenuActive={setMenuActive}
                />

                <Sidebar menuActive={menuActive} />

                <Quiz quizData={quizData} />
            </div>
        </>
    );
}
