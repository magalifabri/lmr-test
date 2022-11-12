import Head from "next/head";

import Sidebar from "../components/Sidebar";
import Quiz from "../components/Quiz";

import styles from "../styles/Home.module.scss";

export default function Home() {
    return (
        <>
            <Head>
                <title>page title</title>
                <meta name="description" content="page description" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className={styles.container}>
                <Sidebar />

                <Quiz />
            </div>
        </>
    );
}
