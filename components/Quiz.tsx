import styles from "../styles/Quiz.module.scss";

export default function Quiz() {
    return (
        <div className="quiz-window">
            <div className="timer">[0:20]</div>

            <h1>[question]</h1>

            <div className="options">[options]</div>

            <button>Klaar!</button>
            <button>Geef me een tip...</button>
            {/* <button>Doorgaan</button> */}
        </div>
    );
}
