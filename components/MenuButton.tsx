import styles from "../styles/MenuButton.module.scss";

interface AppProps {
    menuActive: boolean;
    setMenuActive: Function;
}

export default function MenuButton({ menuActive, setMenuActive }: AppProps) {
    //#region RENDER LOGIC

    const getMenuButtonStyling = () => {
        let styling = styles.menuButton;

        if (menuActive) {
            styling += " " + styles.active;
        }

        return styling;
    };
    //#endregion

    return (
        <div
            className={getMenuButtonStyling()}
            onClick={() => setMenuActive(!menuActive)}
        >
            <span className={styles.menuButton__bar}></span>
            <span className={styles.menuButton__bar}></span>
        </div>
    );
}
