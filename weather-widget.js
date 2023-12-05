class weatherWidget extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: "open" });
        this.shadow = shadow;

        shadow.innerHTML = `
        <style>    
            section {
                background-color: var(--double-bg-color);
                transition: 0.5s;
            }

            .main-information {
                padding: 30px;
                text-align: center;
                transition: 0.5s;
            }

            .main-information>h1 {
                margin: 30px 0;
            }

            .other-information {
                padding: 10px 50px;
                background-color: var(--other-information-bg);
                text-align: start;
                transition: 0.5s;
            }

            .daily-information {
                display: flex;
            }

            .daily-card {
                background-color: var(--daily-bg);
                border: 2px solid var(--daily-border);
                text-align: center;
                width: 135px;
                transition: 0.5s;
            }

            .customization-menu {
                margin-top: 30px;
                display: flex;
                justify-content: space-between;
                gap: 20px;
            }

            select,
            input,
            button {
                width: 130px;
                padding: 5px 15px;

                color: whitesmoke;
                background-color: var(--double-bg-color);
                outline-color: currentcolor;

                border: 2px solid var(--input-color);

                cursor: pointer;
                outline: none;

                transition: 0.5s;
            }

            select:hover,
            input:hover {
                border: 2px solid var(--input-hover-color);
            }

            button:hover {
                background-color: var(--input-color);
                border: 2px solid var(--input-hover-color);
            }
        </style>

        <main>
            <section>
                <div class="main-information"></div>
                <div class="other-information"></div>
                <div class="daily-information"></div>
            </section>
            <div class="customization-menu">
                <select class='theme'>
                    <option>Dark mode</option>
                    <option>Light mode</option>
                </select>
                <select class='font'>
                    <option>Montserrat</option>
                    <option>Stick</option>
                    <option>Pixelify Sans</option>
                </select>
                <input type="number" id="numInput" placeholder="Размер шрифта">
                <button type="submit">Применить стилизацию</button>
            </div>
        </main>
        `;

        shadow.querySelector('button').addEventListener('click', () => this.webCustom());
        this.renderWeather()

    }

    renderWeather() {
        const mainInfo = this.shadow.querySelector(".main-information");
        const otherInfo = this.shadow.querySelector(".other-information");
        const dailyInfo = this.shadow.querySelector(".daily-information");

        async function get_response() {
            let response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=55.7522&longitude=37.6156&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,wind_speed_10m_max&timezone=Europe%2FMoscow')
            let content = await response.json()

            let degAndPlace = document.createElement("h1")
            degAndPlace.textContent = `${content.current?.temperature_2m}${content.current_units?.temperature_2m} | ${content.timezone}`
            mainInfo.appendChild(degAndPlace)

            otherInfo.innerHTML += `
            <p>Date and time: ${content.current?.time}</p>
            <p>Interval: ${content.current?.interval} ${content.current_units?.interval}</p>
            <p>Temperature: ${content.current?.temperature_2m}${content.current_units?.temperature_2m}</p>
            <p>Relative humidity (2m): ${content.current?.relative_humidity_2m}${content.current_units?.relative_humidity_2m}</p>
            <p>Precipitation: ${content.current?.precipitation}${content.current_units?.precipitation}</p>
            <p>Wind speed (10m): ${content.current?.wind_speed_10m}${content.current_units?.wind_speed_10m}</p>
            `

let daily_days = content.daily?.time;
            for (let i = 0; i < daily_days.length; i++) {
                dailyInfo.innerHTML += `
                <div class="daily-card">
                <h4>${content.daily?.time[i]}</h4>
                <p>Max: ${content.daily?.temperature_2m_max[i]}${content.current_units?.temperature_2m}</p>
                <p>Min: ${content.daily?.temperature_2m_min[i]}${content.current_units?.temperature_2m}</p>
                </div>
                `
            }
        }
        get_response()
    }


    // кастомизация:
    webCustom() {
        const selectTheme = this.shadow.querySelector('.theme');
        const fontFamily = this.shadow.querySelector('.font');
        const fontSize = this.shadow.querySelector('#numInput');

        const dailyCards = this.shadow.querySelectorAll('.daily-card')

        document.body.style = `
            font-family: '${fontFamily.value}', sans-serif;
            font-size: ${fontSize.value}px;
        `

        if (selectTheme.value == 'Dark mode') {

            document.body.style.color = 'var(--main-text-color)';

            this.shadow.querySelector('.main-information').style = `
            background-color: var(--main-information-bg);
            `

            this.shadow.querySelector('.other-information').style = `
            var(--other-information-bg);
            `

            dailyCards.forEach(card => {
                card.style.backgroundColor = 'var(--daily-bg)';
                card.style.border = '2px solid var(--daily-border)';
            });

        }
        else if (selectTheme.value == 'Light mode') {

            document.body.style.color = 'var(--dark-text-color)';

            this.shadow.querySelector('.main-information').style = `
                background-color: var(--light-main-bg);
            `

            this.shadow.querySelector('.other-information').style = `
                background-color: var(--light-other-bg);
            `

            dailyCards.forEach(card => {
                card.style.backgroundColor = 'var(--light-daily-bg)';
                card.style.border = '2px solid var(--daily-border-light)'
            });
        }
    }

}

customElements.define("weather-widget", weatherWidget);