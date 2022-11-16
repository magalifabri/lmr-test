import styles from "../styles/MenuButton.module.scss";

type AppProps = {
    menuActive: boolean;
    setMenuActive: Function;
};

export default function MenuButton({ menuActive, setMenuActive }: AppProps) {
    return (
        <div
            className={`${styles.menuButton} ${
                menuActive ? styles.active : ""
            }`}
            onClick={() => setMenuActive(!menuActive)}
        >
            <span className={styles.menuButton__bar}></span>
            <span className={styles.menuButton__bar}></span>
        </div>
    );
}
