const domButtonPlay = document.querySelector('#button-play');
const domButtonStop = document.querySelector('#button-stop');
const myContainerDom = document.querySelector('.container-xxl');
const grid = document.querySelector('#grid');
const volumeControl = document.getElementById('volume-control');
let moves = document.getElementById('moves');
let numberMoves = parseInt(moves.textContent);
let timesDom = document.getElementById('times');
let errors = document.getElementById('errors');
let numberErrors = parseInt(errors.textContent);
let mexStartGame = document.getElementById('newGameText').textContent;
const ciao = document.querySelectorAll('.box');

domButtonPlay.addEventListener('click', generatorGame);

let firstCard = null;
let secondCard = null;
let thirdCard = null;
let lookClick = false;
let audioLoop = null;
let timerInterval = null; // Variabile per il riferimento del timer
let point = 0;
const startingMinutes = 0;
let time = startingMinutes * 60;
numberMoves = 0;
numberErrors = 0;
let cardTimesSelected = 1000;


// Funzione che avvia il gioco
function generatorGame() {

    // audio start button 
    playAudio("start.mp3");

    // svuoto la griglia 
    grid.innerHTML = '';

    // funzione del tempo 
    timer();

    // card array 
    const sonicArray = [

        'sonic-1.png',
        'sonic-1.png',
        'sonic-2.png',
        'sonic-2.png',
        'sonic-3.png',
        'sonic-3.png',
        'sonic-4.png',
        'sonic-4.png',
        'sonic-5.png',
        'sonic-5.png',
        'sonic-6.png',
        'sonic-6.png',

    ];
    const simpsonArray = [

        'sim-1.png',
        'sim-1.png',
        'sim-2.png',
        'sim-2.png',
        'sim-3.png',
        'sim-3.png',
        'sim-4.png',
        'sim-4.png',
        'sim-5.png',
        'sim-5.png',
        'sim-6.png',
        'sim-6.png',
    ]
    const brosArray = [
        'mario.png',
        'mario.png',
        'queen.webp',
        'queen.webp',
        'luigi.png',
        'luigi.png',
        'bowser.png',
        'bowser.png',
        'donkey.webp',
        'donkey.webp',
        'fungo.png',
        'fungo.png',
    ];
    // audio loop 
    if (audioLoop) {
        audioLoop.pause();
        audioLoop.currentTime = 0;
    }
    audioLoop = new Audio("loop.mp3");
    audioLoop.loop = true;
    audioLoop.volume = volumeControl.value;
    audioLoop.play();

    // verifico il layout 
    const layoutSelect = document.querySelector('#layout').value;
    let arrayLayout = [];
    if (layoutSelect === 'bros') {
        arrayLayout = brosArray;

    } else if (layoutSelect === 'simpson') {
        arrayLayout = simpsonArray;
    } else {
        arrayLayout = sonicArray;

    }
    // verifico il livello del gioco 
    const level = document.querySelector('#level').value;
    let arraySelected = [];
    if (level === 'easy') {
        point = 6;
        arraySelected = arrayLayout;
    } else if (level === 'hard') {
        point = 8;
        arraySelected = arrayLayout;
        arraySelected.push('g', 'g', 'h', 'h')
    } else {
        point = 10;
        arraySelected = arrayLayout;
        arraySelected.push('g', 'g', 'h', 'h', 'i', 'i', 'l', 'l')

    }
    // funzione che stoppa il gioco 
    domButtonStop.addEventListener('click', stopGame);
    volumeControl.addEventListener('input', function () {
        audioLoop.volume = this.value;
    });

    // funzione che mescola le carte 
    arrayLayout.sort(() => 0.5 - Math.random());

    // ciclo delle carte 
    for (let i = 0; i < arrayLayout.length; i++) {
        let singleCard = arrayLayout[i];
        switch (singleCard) {
            case 'g':
                if (layoutSelect === 'bros') {
                    singleCard = 'Waluigi.png';
                } else if (layoutSelect === 'simpson') {
                    singleCard = 'sim-7.png';
                } else {
                    singleCard = 'sonic-7.png';
                }
                break;
            case 'h':
                if (layoutSelect === 'bros') {
                    singleCard = 'Wario.png';

                } else if (layoutSelect === 'simpson') {
                    singleCard = 'sim-8.png';
                } else {
                    singleCard = 'sonic-8.png'
                }
                break;
            case 'i':
                if (layoutSelect === 'bros') {
                    singleCard = 'cheep.webp';
                } else if (layoutSelect === 'simpson') {
                    singleCard = 'sim-9.png';
                } else {
                    singleCard = 'sonic-9.png'
                }
                break;
            case 'l':
                if (layoutSelect === 'bros') {
                    singleCard = 'boo.png';
                } else if (layoutSelect === 'simpson') {
                    singleCard = 'sim-10.png';
                } else {
                    singleCard = 'sonic-10.png'
                }
                break;
        }
        // funziona che genera i singoli box all'interno della griglia 
        const cell = generateCell(singleCard, singleCard, level, layoutSelect);
        console.log(level)
        cell.addEventListener('click', clickCard);
        grid.append(cell);
    }
}

// Funzione che genera una cella
function generateCell(value, symbol, type) {
    const myDiv = document.createElement('div');
    myDiv.classList.add('box', 'none', 'bg-square');
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
    setTimeout(controlMatch, cardTimesSelected);
}

// Funzione per controllare se le carte corrispondono
function controlMatch() {

    let match = firstCard.dataset.symbol === secondCard.dataset.symbol;
    numberMoves++;
    moves.textContent = numberMoves;
    if (match) {
        point--;
        if (point === 0) {
            setTimeout(() => {
                const ciao = document.querySelectorAll('.box');
                ciao.forEach(function (element) {
                    element.parentNode.removeChild(element);
                });
                generateMessage(moves.textContent, errors.textContent, timesDom.textContent)
            }, 2000)
        }
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
        const minutes = Math.floor(time / 60);
        let seconds = time % 60;
        timesDom.textContent = `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
        time++;
    }, 1000);
}
function generateMessage(moves, errors, times) {
    playAudio("win.mp3");
    const myDiv = document.createElement('div');
    myDiv.classList.add('message')
    myDiv.innerHTML = `
           <h3>Hai vinto</h3>
           <p>Questi sono i tuoi record</p>
           <div id="action">
            <div class="text">
              Mosse:
              <div id="moves">${moves}</div>
            </div>
            <div class="text">
              Tempo:
              <div id="times">
             <div> ${times} <br> <div>secondi</div></div>
              </div>
            </div>
            <div class="text">
              Errori:
              <div id="errors">${errors <= 0 ? '0' : errors}</div>
            </div>
          </div>
          <h2 id="newGameText">inizia un'altra partita</h2>
    `;
    if (errors <= 0) {
        numberErrors.textContent = 0;
    }
    grid.append(myDiv);
}
