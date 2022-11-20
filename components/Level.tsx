import styles from "../styles/Level.module.scss";

export default function Level() {
    return (
        <div className={styles.level}>
            <div className={styles.progressBar}>
                <div className={styles.progressBar__fill}></div>
            </div>
            <span>Level 3 / 10</span>
        </div>
    );
}
