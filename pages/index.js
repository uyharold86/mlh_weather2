import Head from 'next/head'
import {convertDayNumberToWord, formatTemp} from '../components/utils'


export async function getServerSideProps() {
  // https://api.openweathermap.org/data/2.5/onecall?lat=10.316870289959768&lon=123.89034075926665&exclude=hourly,minutely&appid=c66c733779f81fe1e75bb9dc3190cb87&units=metric
  //JavaScript URL manipulation

    const baseURL = "https://api.openweathermap.org/data/2.5/onecall";
    const searchParams = new URLSearchParams();

    const apiOptions = {
        lat: "10.316918868696487",
        lon: "123.89029542887974",
        apiKey: "c66c733779f81fe1e75bb9dc3190cb87",
        units: "metric",
        exclude: "hourly,minutely"
    }

    for (const [key, value] of Object.entries(apiOptions)) {
        searchParams.set(key, value);
    }

    const apiRoute = `${baseURL}?${searchParams.toString()}`;
    console.log(apiRoute);

    // Fetch data from external API
    const res = await fetch(apiRoute);
    const weather = await res.json();

    // Pass data to the page via props
    return { props: { weather } }
}

export default function Home({ weather }) {
    console.log(weather);
    return (
        <div className="container">
            <Head>
                <title>MLH Forecasting</title>
                <link rel="icon" href="/favicon.ico"/>
                <link rel="preconnect" href="https://fonts.gstatic.com"/>
                <link href="https://fonts.googleapis.com/css2?family=Noto+Sans&display=swap" rel="stylesheet"/> 
                <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet" />
                <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@600&display=swap" rel="stylesheet" />
            </Head>

            <main>
                <header>
                    <h1>
                        <span className="header-title-red">MLH</span>
                        <span className="header-title-blue">Weather</span>
                        <span className="header-title-yellow">App</span>
                    </h1>
                </header>
                <div className="transactions">
                    {weather.daily.map(forecast => (
                      <Forecast
                        day={ convertDayNumberToWord(new Date(forecast.dt *1000).getDay())}
                        minTemp={forecast.temp.min}
                        maxTemp={forecast.temp.max}
                        weather={forecast.weather[0].main}
                      />
                    ))}
                </div>
            </main>

            <style jsx>{`
              .container {
                min-height: 100vh;
                padding: 0;
              }

              main {
                width: 100%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                padding: 0;
                text-align: center;
              }

              .header-title-red {
                color: #e73427;
              }

              .header-title-blue {
                color: #1d539f;
              }

              .header-title-yellow {
                color: #f8b92a;
              }

              header {
                width: 100%;
                position: sticky;
                top: 0;
                z-index: 1000;
                background: #f9f9f9;
                border-bottom: 4px solid black;
                font-family: 'Noto Sans', sans-serif;
              }

              header h1 {
                font-size: 40px;
                display: flex;
                flex-direction: column;
                margin: 20px 0 12px 0;
              }
              
              .transactions {
                  font-family: 'Roboto', sans-serif;
              }

              code {
                background: #fafafa;
                border-radius: 5px;
                padding: 0.75rem;
                font-size: 1.1rem;
                font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
                DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
              }

            `}</style>

            <style jsx global>{`
              html,
              body {
                padding: 0;
                margin: 0;
                
              }

              * {
                box-sizing: border-box;
              }
            `}</style>
        </div>
    )
}

function Forecast({day, minTemp, maxTemp, weather}) {
    return (
        <>
            <div className="transaction">
                <div className="day">{day}</div>
                <div className="temp">min {formatTemp(minTemp)} | max {formatTemp(maxTemp)} </div>
                <div className="weather">{weather}</div>
            </div>

            <style jsx>{`
                .transaction {
                    display: grid;
                    grid-template-areas: "day weather"
                                         "temp weather";
                    grid-template-columns: 1fr 100px;
                    text-align: left;
                    position: relative;
                }
                
                .transaction::after {
                    content: '';
                    display: block;
                    height: 2px;
                    width: 180px;
                    background: #e0e8f3;
                    position: absolute;
                    left: calc(50% - 180px/2);
                    bottom: 0;
                }
                
                .transaction.income {
                    color: #2d6200;
                    background: #e9fae9;
                }
                
                .transaction.expense {
                    color: #430707;
                    background: #fcf3f3;
                }
                
                .day {
                    grid-area: day;
                    padding: 12px 6px 3px 16px;
                }
                
                .temp {
                    grid-area: temp;
                    padding: 3px 6px 12px 16px;
                }
                
                .weather {
                    grid-area: weather;
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    padding: 6px 16px 6px 6px;
                    font-family: 'Roboto Mono', monospace;
                    font-weight: 600;
                }
            `}</style>
        </>
    )
}
