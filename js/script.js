const domButtonPlay = document.querySelector('#button-play');
const domButtonStop = document.querySelector('#button-stop');
const grid = document.querySelector('#grid');
const volumeControl = document.getElementById('volume-control'); // Correggi il nome della variabile
let moves =document.getElementById('moves');
domButtonPlay.addEventListener('click', generatorGame);

let firstCard = null;
let secondCard = null;
let lookClick = false;
let audioLoop = null; // Variabile per il riferimento dell'audio di loop
moves = 0;
// Funzione che avvia il gioco
function generatorGame() {
    let cardArray = ['a', 'a', 'b', 'b', 'c', 'c', 'd', 'd', 'e', 'e', 'f', 'f'];
    playAudio("start.mp3");
    grid.innerHTML = '';

    // Avvia l'audio di loop
    if (audioLoop) {
        audioLoop.pause();
        audioLoop.currentTime = 0;
    }
    audioLoop = new Audio("loop.mp3");
    audioLoop.loop = true; // Assicura che l'audio sia in loop
    audioLoop.volume = volumeControl.value; // Imposta il volume iniziale
    audioLoop.play();

    // Aggiunge l'event listener per il pulsante stop una sola volta
    domButtonStop.removeEventListener('click', stopGame);
    domButtonStop.addEventListener('click', stopGame);

    // Aggiunge l'event listener per il controllo del volume
    volumeControl.addEventListener('input', function() {
        audioLoop.volume = this.value;
    });

    // Mescola l'array delle carte
    cardArray.sort(() => 0.5 - Math.random());

    // Crea e aggiunge le celle alla griglia
    for (let i = 0; i < cardArray.length; i++) {
        let singleCard = cardArray[i];
        switch(singleCard) {
            case 'a':
                singleCard = 'mario.png';
                break;
            case 'b':
                singleCard = 'queen.webp';
                break;
            case 'c':
                singleCard = 'luigi.png';
                break;
            case 'd':
                singleCard = 'bowser.png';
                break;
            case 'e':
                singleCard = 'donkey.webp';
                break;
            case 'f':
                singleCard = 'fungo.png';
                break;
        }

        const cell = generateCell(singleCard, singleCard);
        cell.addEventListener('click', clickCard);
        grid.append(cell);
    }
}

// Funzione che genera una cella
function generateCell(value, symbol) {
    const myDiv = document.createElement('div');
    myDiv.classList.add('box', 'none');
    myDiv.innerHTML = `
        <span>
            <img src="./img/${value}" alt="">
        </span>
    `;
    myDiv.dataset.symbol = symbol;
    return myDiv;
}

// Funzione per riprodurre l'audio
function playAudio(sound) {
    let audio = new Audio(sound);
    audio.oncanplaythrough = function () {
        audio.play();
    }
    return audio;
}

// Funzione per fermare il gioco
function stopGame() {
    playAudio("stop.mp3");

    // Ferma l'audio di loop
    if (audioLoop) {
        audioLoop.pause();
        audioLoop.currentTime = 0; // Riavvia l'audio al tempo zero
    }

    grid.innerHTML = '';
    reset();
}

// Funzione che gestisce i click sulle carte
function clickCard() {
    playAudio("beep.mp3");
    if (lookClick) return;
    if (this === firstCard) return;

    this.classList.add('active');
    if (!firstCard) {
        firstCard = this;
        return;
    }
    secondCard = this;
    lookClick = true;
    setTimeout(controlMatch, 800);
    setTimeout(playAudio())
}

// Funzione per controllare se le carte corrispondono
function controlMatch() {
    let match = firstCard.dataset.symbol === secondCard.dataset.symbol;

    if (match) {
        firstCard.removeEventListener("click", clickCard);
        secondCard.removeEventListener("click", clickCard);
        firstCard.classList.add('true')
        secondCard.classList.add('true')
        playAudio("card-points.mp3")
    } else {
        firstCard.classList.remove('active');
        secondCard.classList.remove('active');
        playAudio("error.mp3")
        console.log('lll')

    }
    reset();
}

// Funzione per resettare le carte e lo stato del gioco
function reset() {
    [firstCard, secondCard, lookClick] = [null, null, false];
}

