import "./style.css";
import "animate.css";
import {bird_list} from './birds'

// make list of five letter bird words
let word_list:string[] = [];
bird_list.forEach(bird => {
  if (bird.length === 5) {
    word_list.push(bird);
    return
  }
  if (bird.includes(' ')) {
    const parts:string[] = bird.split(' ');
    const last = parts.pop()!;
    if (last.length === 5) {
      word_list.push(last)
    }
    
  }
});
word_list = [...new Set(word_list)];
console.log(word_list);

// pick one for today
var daysSinceEpoch = Math.floor(new Date().getTime() / (24 * 60 * 60 * 1000));
var index = daysSinceEpoch % word_list.length;
console.log(index);

let numberOfGuessedwords = 0;
let guessedWords: string[][] = [[]];
let availableSpace = 1;
let word = word_list[0];

document.addEventListener("DOMContentLoaded", () => {
  createSquares();
  createKeyboard();
});

function getCurrentWordArray() {
  return guessedWords[numberOfGuessedwords];
}

function updateGuessedWords(letter: string) {
  const currentWordArray = getCurrentWordArray();

  if (currentWordArray && currentWordArray.length < 5) {
    currentWordArray.push(letter);
    const availableSpaceEl = document.getElementById(String(availableSpace))!;
    availableSpace = availableSpace + 1;
    availableSpaceEl.textContent = letter;
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

      if (letter ==='del') {
        handleDeleteLetter();
        return;
      }

      updateGuessedWords(letter);
    };
  }
}




function checkLetterGuess(letter:string, index:number) {

  // not in word
  if (!word.includes(letter)) {
    return "letter-not-present"
  } else {
    // in correct position
    if (letter == word.charAt(index)) {
      return "letter-in-position"
    }
  }
  return "letter-out-of-position"
}

function handleDeleteLetter() {
  const currentWordArray = getCurrentWordArray();
  currentWordArray.pop()

  guessedWords[guessedWords.length-1] = currentWordArray;

  const lastLetterEl = document.getElementById(String(availableSpace-1))!;
  lastLetterEl.textContent = '';
  availableSpace = availableSpace -1;
}

function handleSubmitWord() {
  const currentWordArray = getCurrentWordArray();
  if (currentWordArray.length !== 5) {
    window.alert("Word must be 5 letters");
    return;
  }

  const currentWord = currentWordArray.join("");

  if (!bird_list.includes(currentWord)) {
    window.alert("Not a bird.");
    return;
  }

  const firstLetterId = numberOfGuessedwords * 5 + 1;
  const interval = 200;
  currentWordArray.forEach((letter, index) => {
    setTimeout(() => {
      const letterGuess = checkLetterGuess(letter, index);
      const letterId = firstLetterId + index;
      const letterEl = document.getElementById(letterId.toString())! as HTMLElement;
      letterEl.classList.add("animate__flipInX");
      letterEl.classList.add(letterGuess);

    }, interval * index);
  })
  
  if (currentWord === word) {
    window.alert("Contrats! You won!!");
  }

  numberOfGuessedwords++;

  if (guessedWords.length === 6) {
    window.alert(`you lose, the word is ${word}`);
  }
  guessedWords.push([]);
}
