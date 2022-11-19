import styles from "../styles/CountdownBar.module.scss";

export default function CountdownBar() {
    return (
        <div className={styles.countdownBar}>
            <div className={styles.countdownBar__fill}></div>
        </div>
    );
}
