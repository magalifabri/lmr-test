import Head from "next/head";
import styles from "../styles/Home.module.css";

export default function Home() {
    return (
        <div>
            <Head>
                <title>page title</title>
                <meta name="description" content="page description" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <p>Hello world</p>
        </div>
    );
}
