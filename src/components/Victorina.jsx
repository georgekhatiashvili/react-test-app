import React, { useState, useEffect } from "react";


const sampleWords = [
    {
      "word": "something",
      "description": "question about quiz"
    },
    {
      "word": "მთვარე",
      "description": "დაასახელეთ დედამიწის თანამგზავრი?"
    },
    {
      "word": "ვეფხვები",
      "description": "ზოლიანი კატები?"
    },
    {
      "word": "გველი",
      "description": "მცოცავი ცხოველი შხამით?"
    },
    {
      "word": "ნიანგი",
      "description": "ცხოველი, რომელსაც „მწვანე მორი“ ჰქვია, დიდი პირით?"
    },
    {
      "word": "მაიმუნი",
      "description": "რომელი ცხოველი ჰგავს თომას ყველაზე მეტად?"
    },
    {
      "word": "კურდღელი",
      "description": "გრძელი ყურები?"
    },
    {
      "word": "ძუძუმწოვარი",
      "description": "ცხოველები, რომლებიც თავიანთ შვილებს რძით კვებავენ"
    },
    {
      "word": "ბუქარესტი",
      "description": "რუმინეთის დედაქალაქია?"
    },
    {
      "word": "მიჩიგანი",
      "description": "ყველაზე დიდი ტბა ამერიკაში"
    },
    {
      "word": "ბაიკალი",
      "description": "ყველაზე დიდი ტბა რუსეთში"
    },
    {
      "word": "ჩეხებს",
      "description": "ვის მოუგო საქართველომ"
    },
    {
      "word": "ავსტრალია",
      "description": "კუნძულ ქვეყანა"
    },
    {
      "word": "ხმელთაშუა",
      "description": "თურქეთის ზღვა"
    },
    {
      "word": "კასპიის",
      "description": "აზერბაიჯანის ზღვა"
    },
    {
      "word": "სევანი",
      "description": "ტბა სომხეთში"
    },
    {
      "word": "იშხანი",
      "description": "რა ჭამა თომამ სომხეთში"
    },
    {
      "word": "გიუმრი",
      "description": "რომელი ქალაქი ნახა თომამ სომხეთში"
    },
    {
      "word": "მართვისმოწმობა",
      "description": "რა ქვია თომას შავ კატას"
    },
    {
      "word": "პინგვინი",
      "description": "ძუძუმწოვარი ფრინველი"
    },
    {
      "word": "თხა",
      "description": "წვერებიანი ცხოველი"
    },
    {
      "word": "წისქვილი",
      "description": "ცნობილი რესტორანი თბილისში"
    },
    {
      "word": "ქოში",
      "description": "რა დაკარგა კონკიამ"
    },
    {
      "word": "ლაურიტო",
      "description": "თომას შეყვარებულის სახელი"
    }
  ];

const getRandomWord = () => {
    const randomPlace = Math.floor(Math.random() * sampleWords.length);
    return sampleWords[randomPlace];
};

function Victorina() {
    const [wordData, setWordData] = useState(getRandomWord());
    const [msg, setMsg] = useState("");
    const [chosenLetters, setChosenLetters] = useState([]);
    const [hints, setHints] = useState(3);
    const [displayWord, setDisplayWord] = useState(false);
    const [wrongGuesses, setWrongGuesses] = useState(0);

    useEffect(() => {
        if (wrongGuesses >= 3) {
            window.alert("Game Over! You made too many wrong guesses.");
            restartGameFunction();
        }
    }, [wrongGuesses]);

    const letterSelectFunction = (letter) => {
        if (!chosenLetters.includes(letter)) {
            setChosenLetters([...chosenLetters, letter]);
            if (!wordData.word.includes(letter)) {
                setWrongGuesses(wrongGuesses + 1);
            }
        }
    };

    const hintFunction = () => {
        if (hints > 0) {
            const hiddenLetterIndex = wordData.word
                .split("")
                .findIndex((letter) => !chosenLetters.includes(letter));
            setChosenLetters([...chosenLetters, wordData.word[hiddenLetterIndex]]);
            setHints(hints - 1);
        }
    };

    const removeCharacterFunction = () => {
        setChosenLetters(chosenLetters.slice(0, -1));
    };

    const displayLettersFunction = () => {
        const letters = "აბგდევზთიკლმნოპურსტუფქღყშჩცძწჭხჯჰ";
        return Array.from(letters).map((letter, index) => (
            <button
                key={index}
                onClick={() => letterSelectFunction(letter)}
                disabled={chosenLetters.includes(letter)}
                className={`letter-button ${chosenLetters.includes(letter) ? "selected" : ""}`}
            >
                {letter}
            </button>
        ));
    };

    const checkWordGuessedFunction = () => {
        return wordData.word.split("").every((letter) => chosenLetters.includes(letter));
    };

    const guessFunction = () => {
        if (checkWordGuessedFunction()) {
            setMsg("Congratulations! You guessed the word correctly!");
        } else {
            setMsg("Incorrect guess! Try again.");
            setDisplayWord(true);
        }
    };

    const restartGameFunction = () => {
        setWordData(getRandomWord());
        setMsg("");
        setChosenLetters([]);
        setHints(3);
        setDisplayWord(false);
        setWrongGuesses(0);
    };

    return (
        <div className="container">
            <h1>Word Guess Game</h1>
            <div className="word-container">
                {Array.from(wordData.word).map((letter, index) => (
                    <div
                        key={index}
                        className={`letter ${chosenLetters.includes(letter) ? "visible" : ""}`}
                    >
                        {chosenLetters.includes(letter) ? letter : "_"}
                    </div>
                ))}
            </div>
            <p className="word-description">Hint: {wordData.description}</p>
            {msg && (
                <div className="message">
                    <p>{msg}</p>
                    {displayWord && <p>Correct word was: {wordData.word}</p>}
                </div>
            )}
            <div className="button-section">
                <div className="guess-section">
                    <button onClick={restartGameFunction} className="restart-button">
                        Restart
                    </button>
                    <button
                        onClick={removeCharacterFunction}
                        disabled={!chosenLetters.length}
                        className="remove-button"
                    >
                        Remove Letter
                    </button>
                </div>
                <div className="letter-selection">
                    {displayLettersFunction()}
                </div>
                <div className="hints">
                    Hints Remaining: {hints}{" "}
                    <button onClick={hintFunction} disabled={hints === 0} className="hint-button">
                        Get Hint
                    </button>
                </div>
                {!msg && (
                    <button
                        onClick={guessFunction}
                        disabled={!chosenLetters.length}
                        className="guess-button"
                    >
                        Guess
                    </button>
                )}
            </div>
        </div>
    );
}

export default Victorina;
