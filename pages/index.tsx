import type { NextPage } from "next";
import Head from "next/head";
import { useState, useEffect, Key } from "react";
import axios, { AxiosResponse, AxiosRequestConfig } from "axios";
import { Rings } from "react-loader-spinner";
import styles from "../styles/Home.module.css";
import Footer from "../components/footer";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  const [quizList, setQuizList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [number, setNumber] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isShow, setIsShow] = useState(false);
  const [score, setScore] = useState(0);
  const [color, setColor] = useState("#ecf0f1");
  const [isEnd, setIsEnd] = useState<boolean>(false);

  const handleNext = () => {
    setNumber((prev) => prev + 1);
    setIsShow(false);
  };

  const handleAnswer = (index: number, correctNumber: number) => {
    setIsShow(true);

    if (number !== 9) {
      if (correctNumber == index + 1) {
        setIsCorrect(true);
        setScore((prev) => prev + 1);
        setColor("green");
      } else if (correctNumber !== index + 1) {
        setIsCorrect(false);
        setColor("red");
      }
    } else if (number == 9) {
      setTimeout(() => {
        setIsEnd(!isEnd);
      }, 1000);
    }

    // setTimeout(() => {
    //   setNumber((prev) => prev + 1);
    //   setIsShow(false);
    // }, 2000);
  };

  const fetchQuiz = () => {
    const options: AxiosRequestConfig<any> = {
      method: "GET",
      url: "https://twinword-word-association-quiz.p.rapidapi.com/type1/",
      params: { level: "3", area: "sat" },
      headers: {
        "X-RapidAPI-Key": `${process.env.NEXT_PUBLIC_RAPIDKEYAPI}`,
        "X-RapidAPI-Host": `${process.env.NEXT_PUBLIC_RAPIDKEYHOST}`,
      },
    };

    axios
      .request(options)
      .then((response: AxiosResponse<any, any>) => {
        setTimeout(() => {
          setQuizList(response.data.quizlist);
        }, 300);

        setTimeout(() => {
          setIsLoading(false);
        }, 1500);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps

    fetchQuiz();
  }, []);

  useEffect(() => {
    console.log(number, "number");
  }, [number]);

  const router = useRouter();

  const refreshPage = () => {
    window.location.reload();
  };

  return (
    <div className={styles.container}>
      <Head>
        <title> Word Association App</title>
        <meta
          name="description"
          content="Word association app built by winpeed"
        />
      </Head>

      <main className={styles.main}>
        {!isLoading ? (
          !isEnd ? (
            <section>
              <section>
                <div className={styles.topWrapper}>
                  <h2 className={styles.qnumber}>
                    Question {number + 1} of {quizList.length}
                  </h2>
                  {score !== 0 ? (
                    <h3 className={styles.scores}>Score: {score} </h3>
                  ) : null}
                </div>

                <hr />
                <h4 className={styles.question}>
                  Which of the options relates to the following words?
                </h4>

                {quizList[number].quiz.map((item: Key | null | undefined) => {
                  return (
                    <span key={item} className={styles.words}>
                      {item}
                    </span>
                  );
                })}

                {quizList[number].option.map(
                  (item: Key | null | undefined, index: number) => {
                    return (
                      <span
                        className={styles.option}
                        key={item}
                        onClick={() =>
                          handleAnswer(index, quizList[number].correct)
                        }
                      >
                        {item}
                      </span>
                    );
                  }
                )}
              </section>

              {isShow ? (
                isCorrect ? (
                  <p className={styles.correct}>Correct!</p>
                ) : (
                  <p className={styles.wrong}>Wrong!</p>
                )
              ) : null}

              {number + 1 !== 10 ? (
                <button className={styles.button} onClick={handleNext}>
                  Next
                </button>
              ) : null}
            </section>
          ) : (
            <div>
              <h2>Your Score: {(score / 10) * 100}%</h2>

              <button className={styles.button} onClick={refreshPage}>
                Go Home
              </button>
            </div>
          )
        ) : (
          <Rings ariaLabel="loading-indicator" />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Home;
