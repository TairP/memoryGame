//prettier-ignore
const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => parent.querySelectorAll(selector);
const random = (max, min = 0) => {
  return min + Math.round(Math.random() * (max - min));
};

const colors = [
  "#FAEBD7",
  "#E9967A",
  "#E0FFFF",
  "#b0e0e6",
  "#F0E68C",
  "#E6E6FA",
  "#bc8f8f",
  "#8FBC8F",
  "#D3D3D3",
  "#DEB887",
  "#708090",
  "#FFF0F5"
];

const instructions = $(".instructions");
const startButton = $("button");
let cardsContainer = $(".cards-box");
let colorsContainer = $(".picker-box");
let cards = $$(".card");
let started = false;
let numOfCards = 3;
let hideSeconds = 2000;
let randomColors = [];
let currentCard_Index = 0;

function once() {
  startButton.removeEventListener("click", once);
  startButton.classList.add("gone");
  instructions.style.display = "none";
  init();
}
startButton.addEventListener("click", once);

function init() {
  if (started === false) {
    creatingEmptyCards();
    creatingColorsPicker();
    started = true;
  } else {
    resetBorder();
  }
  randomColorsTimer();
  setTimeout(removeColorsTimer, hideSeconds);
  setTimeout(currentCard, hideSeconds);
  setTimeout(function () {
    colorsContainer.addEventListener("click", compareColors);
  }, 2000);
}

const resetBorder = () => {
  let current_card = cards[currentCard_Index];
  current_card.classList.remove("marked-card");
  current_card.classList.add("unmarked-card");
  currentCard_Index = 0;
};

let creatingEmptyCards = () => {
  for (let i = 0; i < numOfCards; i++) {
    let card = document.createElement("div");
    card.className = "card";
    cardsContainer.appendChild(card);
  }
};

let creatingColorsPicker = () => {
  for (let i = 0; i < 12; i++) {
    let div = document.createElement("div");
    div.className = "picker";
    div.style.backgroundColor = colors[i];
    colorsContainer.appendChild(div);
    div.dataset.color = colors[i];
  }
};

const randomColorsTimer = () => {
  randomColors = [];
  while (randomColors.length < numOfCards) {
    let color = colors[random(colors.length - 1)];
    if (randomColors.includes(color) === false) {
      randomColors.push(color);
    }
    cards = $$(".card", cardsContainer);
    for (let i = 0; i < cards.length; i++) {
      cards[i].style.backgroundColor = randomColors[i];
    }
  }
  clearTimeout(removeColorsTimer);
};

const removeColorsTimer = () => {
  cards.forEach((card) => {
    card.style.backgroundColor = "transparent";
  });
};

const currentCard = () => {
  const classList = cards[currentCard_Index].classList;
  classList.remove("unmarked-card");
  classList.add("marked-card");
};

const compareColors = (event) => {
  const playerPick = event.target;
  if (playerPick.dataset.color === randomColors[currentCard_Index]) {
    colorIsCorrect();
    if (currentCard_Index === numOfCards - 1) {
      setTimeout(failedOrWon, 200, true);
    } else {
      colorIsCorrect();
      let currentCard = cards[currentCard_Index];
      currentCard.classList.remove("marked-card");
      currentCard.classList.add("unmarked-card");
      currentCard_Index++;
      currentCard = cards[currentCard_Index];
      currentCard.classList.add("marked-card");
      currentCard.classList.remove("unmarked-card");
    }
  } else {
    setTimeout(failedOrWon, 100, false);
  }
};

const colorIsCorrect = () => {
  cards[currentCard_Index].style.backgroundColor =
    randomColors[currentCard_Index];
};

const failedOrWon = (winner) => {
  const msg = winner ? "won" : "lost";
  const choice = window.confirm(`You ${msg}! /n do you want to play again?`);
  if (choice === true) {
    init();
  } else {
    window.location.href = "http://make-everything-ok.com/";
  }
};
