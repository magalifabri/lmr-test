import Image from "next/image";
import styles from "../styles/Sidebar.module.scss";

export default function Sidebar() {
    return (
        <div className={styles.container}>
            <div className={styles.intro}>
                <div className={styles.cover}>
                    <div className={styles.info}>
                        <div className={styles.timer}>(icon) 31:55</div>

                        <div className={styles.level}>
                            <div className={styles.progressBar}>
                                (progress bar)
                            </div>
                            <span>Level 3 / 10</span>
                        </div>
                    </div>

                    <div className={styles.avatarContainer}>
                        <div className={styles.avatarForeground}></div>
                        <div className={styles.avatarBackground}></div>
                    </div>
                </div>

                <div className={styles.text}>
                    <h1>De fabriek</h1>

                    <hr className={styles.line} />

                    <p>
                        Aha, je bent terug! Net op tijd: Onze eerste bestelling
                        is binnen. Een lokale school wil haar studenten
                        vegetarische lunch maaltijden aanbieden. Stel de
                        machines in voor...
                    </p>
                    <p>
                        Een gezonde <b>vegetarische</b> pizza met 7 gepaste
                        ingrediënten.
                    </p>
                </div>
            </div>

            <div className={styles.navigation}>
                <button>?</button>
                <button>r</button>
                <button>m</button>
                <button>Naar de kaart</button>
            </div>
        </div>
    );
}
