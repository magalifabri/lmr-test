export default function Sidebar() {
    return (
        <div className="sidebar">
            <div className="intro">
                <div className="cover">
                    <div className="info">
                        <div className="timer">31:55</div>
                        {/* <div className="progress-bar">
                                    (progress bar)
                                </div> */}

                        <div className="level">
                            <div className="bar"></div>
                            Level 3 / 10
                        </div>
                    </div>

                    <div className="avatar">IMG:avatar</div>
                </div>

                <div className="text">
                    <h1>De fabriek</h1>
                </div>

                <hr />

                <p>
                    Aha, je bent terug! Net op tijd: Onze eerste bestelling is
                    binnen. Een lokale school wil haar studenten vegetarische
                    lunch maaltijden aanbieden. Stel de machines in voor...
                </p>
                <p>
                    Een gezonde <b>vegetarische</b> pizza met 7 gepaste
                    ingrediënten.
                </p>
            </div>

            <div className="navigation">
                <button>?</button>
                <button>r</button>
                <button>m</button>
                <button>Naar de kaart</button>
            </div>
        </div>
    );
}
