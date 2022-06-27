import type { NextPage } from "next";
import Head from "next/head";
import {
  useState,
  useEffect,
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactFragment,
} from "react";
import axios from "axios";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  const [quizList, setQuizList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [number, setNumber] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isShow, setIsShow] = useState(false);
  const [score, setScore] = useState(0);
  const [color, setColor] = useState("#ecf0f1");

  const handleNext = () => {
    setNumber((prev) => prev + 1);
    setIsShow(false);
  };

  const handleAnswer = (index: number, correctNumber: number) => {
    setIsShow(true);

    if (correctNumber == index + 1) {
      setIsCorrect(true);
      setScore((prev) => prev + 1);
      setColor("green");
    } else if (correctNumber !== index + 1) {
      setIsCorrect(false);
      setColor("red");
    }
  };

  const fetchQuiz = async () => {
    const options = {
      method: "GET",
      url: "https://twinword-word-association-quiz.p.rapidapi.com/type1/",
      params: { level: "3", area: "sat" },
      headers: {
        "X-RapidAPI-Key": "e506b8fb4amsh0137451d962cef4p19e70ajsndbc557e6172b",
        "X-RapidAPI-Host": "twinword-word-association-quiz.p.rapidapi.com",
      },
    };

    axios
      .request(options)
      .then((response) => {
        setQuizList(response.data.quizlist);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    fetchQuiz();
    console.log(quizList);
    console.log(number);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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

          {!isLoading ? (
            quizList[number].quiz.map(
              (
                item:
                  | boolean
                  | Key
                  | ReactElement<any, string | JSXElementConstructor<any>>
                  | ReactFragment
                  | null
                  | undefined
              ) => {
                return (
                  <span key={item} className={styles.words}>
                    {item}
                  </span>
                );
              }
            )
          ) : (
            <h2>Loading...</h2>
          )}

          {!isLoading
            ? quizList[number].option.map(
                (
                  item:
                    | boolean
                    | Key
                    | ReactFragment
                    | ReactElement<any, string | JSXElementConstructor<any>>
                    | null
                    | undefined,
                  index: any
                ) => {
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
              )
            : null}
        </section>

        {isShow ? (
          isCorrect ? (
            <p className={styles.correct}>Correct!</p>
          ) : (
            <p className={styles.correct}>Wrong!</p>
          )
        ) : null}

        {number + 1 !== 10 ? (
          <button className={styles.button} onClick={handleNext}>
            Next
          </button>
        ) : null}
      </main>

      <footer className={styles.footer}>
        <a href="https://winpeed.com" target="_blank" rel="noopener noreferrer">
          Built with love by <span className={styles.logo}>winpeed</span>
        </a>
      </footer>
    </div>
  );
};

export default Home;
