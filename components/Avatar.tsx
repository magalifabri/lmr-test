import styles from "../styles/Avatar.module.scss";

export default function Avatar() {
    return (
        <>
            <div
                className={styles.avatar + " " + styles.avatar__background}
            ></div>
            <div
                className={styles.avatar + " " + styles.avatar__foreground}
            ></div>
        </>
    );
}
