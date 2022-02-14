import "./style.css";
import "animate.css";
import { AllWords, GuessWords } from "./words";

// pick one for today
var daysSinceEpoch = Math.floor(new Date().getTime() / (24 * 60 * 60 * 1000));
var todayIndex = daysSinceEpoch % GuessWords.length;

const sn_function = () => {
  return state.currentRowIndex * 5 + state.currentLetterIndex + 1;
};

let guessArray: string[] = [];
let state = {
  boardState: ["", "", "", "", "", ""],
  guesses: guessArray,
  currentRowIndex: 0,
  currentLetterIndex: 0,
  squareNumber: sn_function,
  currentGuess: ["", "", "", "", ""],
  solution: GuessWords[todayIndex],
};

document.addEventListener("DOMContentLoaded", () => {
  console.log(new Date().getDate());
  createSquares();
  createKeyboard();
  initHelpModal();
  initShareModal();
});

function checkNewLetterGuess(letter: string) {
  // if adding letters after the 5th return
  if (state.currentLetterIndex === 5) {
    return;
  }
  if (state.currentRowIndex < 6) {
    state.currentGuess[state.currentLetterIndex] = letter;
    const sq_num = state.squareNumber();
    const availableSpaceEl = document.getElementById(String(sq_num))!;
    availableSpaceEl.textContent = letter;
    if (state.currentLetterIndex < 5) {
      state.currentLetterIndex++;
    }
  }
}

function createSquares() {
  const gameBoard = document.getElementById("board");

  for (let index = 0; index < 30; index++) {
    let square = document.createElement("div");
    square.classList.add("square");
    square.classList.add("animate__animated");
    square.setAttribute("id", (index + 1).toString());
    gameBoard?.appendChild(square);
  }
}

function createKeyboard() {
  const keys: NodeListOf<HTMLElement> = document.querySelectorAll(
    ".keyboard-row button"
  );

  for (let i = 0; i < keys.length; i++) {
    keys[i].onclick = ({ target }) => {
      const t = target as unknown as HTMLInputElement;
      const letter = t.getAttribute("data-key")!;
      if (letter === "enter") {
        handleSubmitWord();
        return;
      }

      if (letter === "del") {
        handleDeleteLetter();
        return;
      }

      checkNewLetterGuess(letter);
    };
  }
}

function checkLetterGuess(letter: string, index: number) {
  // not in word
  if (!state.solution.includes(letter)) {
    state.guesses.push("absent");
    return "letter-not-present";
  } else {
    // in correct position
    if (letter == state.solution.charAt(index)) {
      state.guesses.push("correct");
      return "letter-in-position";
    }
  }
  state.guesses.push("present");
  return "letter-out-of-position";
}

function handleDeleteLetter() {
  // if we are on first tile, do nothing
  if (state.currentLetterIndex === 0) {
    return;
  }

  // otherwise clear tile and rewind state
  const lastLetterEl = document.getElementById(
    String(state.squareNumber() - 1)
  )!;
  lastLetterEl.textContent = "";

  state.currentLetterIndex--;
}

function handleSubmitWord() {
  //const currentWordArray = getCurrentWordArray();
  if (state.currentGuess.length !== 5) {
    window.alert("Word must be 5 letters");
    return;
  }

  const currentWord = state.currentGuess.join("");
  console.log(currentWord);
  if (!AllWords.includes(currentWord)) {
    window.alert("Not a bird.");
    return;
  }

  // animate the tile reveal
  const firstLetterId = state.currentRowIndex * 5 + 1;
  const interval = 200;
  state.currentGuess.forEach((letter, index) => {
    setTimeout(() => {
      const letterGuess = checkLetterGuess(letter, index);
      const letterId = firstLetterId + index;
      const letterEl = document.getElementById(
        letterId.toString()
      )! as HTMLElement;
      letterEl.classList.add("animate__flipInX");
      letterEl.classList.add(letterGuess);

      // set keyboard color too
      const keyboardEl = document.querySelector(`[data-key=${letter}`)!;
      if (keyboardEl.className != "letter-in-position") {
        keyboardEl.className = letterGuess;
      }
    }, interval * index);
  });

  if (currentWord === state.solution) {
    window.alert("Contrats! You won!!");

    // hack to stop playing more words
    state.currentRowIndex = 7;
  }

  // add this guess to the state
  state.boardState[state.currentRowIndex] = currentWord;
  state.currentRowIndex++;
  state.currentGuess = ["", "", "", "", ""];
  state.currentLetterIndex = 0;

  if (state.currentRowIndex === 6) {
    window.alert(`you lose, reload to try again!`);
  }
}

function initHelpModal() {

  const modal = document.getElementById("help-modal")!;

  // Get the button that opens the modal
  const btn = document.getElementById("help")!;

  // Get the <span> element that closes the modal
  const span = document.getElementById("close-help")!;

  // When the user clicks on the button, open the modal
  btn.addEventListener("click", function () {
    modal.style.display = "block";
  });

  // When the user clicks on <span> (x), close the modal
  span.addEventListener("click", function () {
    modal.style.display = "none";
  });

  // When the user clicks anywhere outside of the modal, close it
  window.addEventListener("click", function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  });
}

function getShare() {
  console.log(state);
  const d = new Date();
  const today = d.getMonth() + "/" + d.getDate();
  let text = `Birdle! ${today}`;
  text += "\n";
  let count = 1;
  state.guesses.forEach((guess) => {
    switch (guess) {
      case "absent":
        text += `\u{2B1C}`;
        break;
      case "present":
        text += `\u{1F7E8}`;
        break;
      case "correct":
        text += `\u{1F7E9}`;
        break;
    }
    if (count === 5) {
      text += "\n";
      count = 1;
    } else {
      count++;
    }
  });
  return text;
}

function initShareModal() {
  const modal = document.getElementById("share-modal")!;

  // Get the button that opens the modal
  const btn = document.getElementById("share")!;

  // Get the <span> element that closes the modal
  const span = document.getElementById("close-share")!;

  // get button to share score
  const share_button = document.getElementById("share-button")!;

  share_button.addEventListener("click", function () {
    // put results
    const resultP = document.getElementById("share-results")!;

    // share score
    const shareString = getShare();
    console.log(shareString);
    if (navigator.share) {
      let shareData = {
        title: "Birdle",
        text: shareString,
        url: "https://birdle.pages.dev",
      };
      navigator.share(shareData).then(() => {
        console.log("shared sucessfully");
        resultP.textContent = "Share Complete!";
      });
    } else {
      resultP.textContent = shareString;
    }
  });

  // When the user clicks on the button, open the modal
  btn.addEventListener("click", function () {
    // updateShareModal();
    modal.style.display = "block";
  });

  // When the user clicks on <span> (x), close the modal
  span.addEventListener("click", function () {
    modal.style.display = "none";
  });

  // When the user clicks anywhere outside of the modal, close it
  window.addEventListener("click", function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  });
}
