import styles from "../styles/Description.module.scss";

export default function Description() {
    return (
        <>
            <h1>De fabriek</h1>

            <hr className={styles.line} />

            <p className={styles.paragraph}>
                Aha, je bent terug! Net op tijd: Onze eerste bestelling is
                binnen. Een lokale school wil haar studenten vegetarische lunch
                maaltijden aanbieden. Stel de machines in voor...
            </p>

            <p className={styles.paragraph}>
                Een gezonde <b>vegetarische</b> pizza met 7 gepaste
                ingrediënten.
            </p>
        </>
    );
}
