const domButtonPlay = document.querySelector('#button-play');
const domButtonStop = document.querySelector('#button-stop');
const grid = document.querySelector('#grid');
const volumeControl = document.getElementById('volume-control');
let moves = document.getElementById('moves');
let numberMoves = parseInt(moves.textContent);
let timesDom = document.getElementById('times');
let errors = document.getElementById('errors');
let numberErrors = parseInt(errors.textContent);
let mexStartGame = document.getElementById('newGameText').textContent;

domButtonPlay.addEventListener('click', generatorGame);

let firstCard = null;
let secondCard = null;
let thirdCard = null;
let lookClick = false;
let audioLoop = null;
let timerInterval = null; // Variabile per il riferimento del timer

numberMoves = 0;
let times = 0;
numberErrors = 0;

// Funzione che avvia il gioco
function generatorGame() {
    // audio start button 
    playAudio("start.mp3");

    // svuoto la griglia 
    grid.innerHTML = '';

    // funzione del tempo 
    timer();

    // card array 
    let cardArraySmall = ['a', 'a', 'b', 'b', 'c', 'c', 'd', 'd', 'e', 'e', 'f', 'f'];
    // 'g','g','h','h','i','i','l','l'

    // audio loop 
    if (audioLoop) {
        audioLoop.pause();
        audioLoop.currentTime = 0;
    }
    audioLoop = new Audio("loop.mp3");
    audioLoop.loop = true;
    audioLoop.volume = volumeControl.value;
    audioLoop.play();

    // verifico il livello del gioco 
    const level = document.querySelector('#level').value;
    let arraySelected = [];
    if (level === 'easy') {
        arraySelected = cardArraySmall;
    } else if (level === 'hard') {
        arraySelected = cardArraySmall;
        arraySelected.push('g','g','h','h')
    } else {
        arraySelected = cardArraySmall;
        arraySelected.push('g','g','h','h','i','i','l','l')

    }


    // funzione che stoppa il gioco 
    domButtonStop.addEventListener('click', stopGame);
    volumeControl.addEventListener('input', function () {
        audioLoop.volume = this.value;
    });

    // funzione che mescola le carte 
    cardArraySmall.sort(() => 0.5 - Math.random());

    // ciclo delle carte 
    for (let i = 0; i < cardArraySmall.length; i++) {
        let singleCard = cardArraySmall[i];
        switch (singleCard) {
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
            case 'g':
                singleCard = 'Waluigi.png';
                break;
            case 'h':
                singleCard = 'Wario.png';
                break;
            case 'i':
                singleCard = 'cheep.webp';
                break;
            case 'l':
                singleCard = 'boo.png';
                break;
        }
        // funziona che genera i singoli box all'interno della griglia 
        const cell = generateCell(singleCard, singleCard,level);
        console.log(level)
        cell.addEventListener('click', clickCard);
        grid.append(cell);
    }
}

// Funzione che genera una cella
function generateCell(value, symbol,type) {
    const myDiv = document.createElement('div');
    myDiv.classList.add( 'box','none', 'bg-square');
    myDiv.classList.add(`${type}`)
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
    if (audioLoop) {
        audioLoop.pause();
        audioLoop.currentTime = 0;
    }
    clearInterval(timerInterval); // Ferma il timer

    grid.innerHTML = '';
    moves.textContent = '';
    errors.textContent = '';
    timesDom.textContent = ''; // Resetta il timer
    mexStartGame.textContent = mexStartGame;
    console.log(mexStartGame)
    reset();
}

// Funzione che gestisce i click sulle carte
function clickCard() {
    playAudio("beep.mp3");
    if (lookClick) return;
    if (this === firstCard) return;
    this.classList.add('active');
    this.classList.remove('bg-square');
    if (!firstCard) {
        firstCard = this;
        return;
    }
    secondCard = this;
    thirdCard = this;
    lookClick = true;
    setTimeout(controlMatch, 800);
}

// Funzione per controllare se le carte corrispondono
function controlMatch() {
    let match = firstCard.dataset.symbol === secondCard.dataset.symbol;
    numberMoves++;
    moves.textContent = numberMoves;
    if (match) {
        firstCard.removeEventListener("click", clickCard);
        secondCard.removeEventListener("click", clickCard);
        firstCard.classList.remove('none');
        secondCard.classList.remove('none');
        firstCard.classList.add('true');
        secondCard.classList.add('true');
        playAudio("card-points.mp3");

        // Controlla se tutte le coppie sono state trovate
        if (document.querySelectorAll('.box.true').length === document.querySelectorAll('.box').length) {
            clearInterval(timerInterval); // Ferma il timer alla fine del gioco
            playAudio("win.mp3"); // Audio di vittoria
        }
    } else {
        numberErrors++;
        errors.textContent = numberErrors;
        firstCard.classList.remove('active');
        secondCard.classList.remove('active');
        firstCard.classList.add('bg-square');
        secondCard.classList.add('bg-square');
        playAudio("error.mp3");
    }
    reset();
}

// Funzione per resettare le carte e lo stato del gioco
function reset() {
    [firstCard, secondCard, lookClick] = [null, null, false];
}

function timer() {
    let sec = 0;
    clearInterval(timerInterval); // Assicura che il vecchio timer sia fermato
    timerInterval = setInterval(() => {
        sec++;
        timesDom.textContent = (sec < 10 ? '0' + sec : sec);
    }, 1000);
}
