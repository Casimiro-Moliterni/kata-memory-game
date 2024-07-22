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
const myBoxDom = document.querySelectorAll('.box');
const layoutSelect = document.querySelector('#layout').value;
domButtonPlay.addEventListener('click', generatorGame);

let firstCard = null;
let secondCard = null;
let lookClick = false;
let audioLoop = null;
let timerInterval = null; // Variabile per il riferimento del timer
let point = 0;
const startingMinutes = 0;
let time = startingMinutes * 60;
numberMoves = 0;
numberErrors = 0;
let cardTimesSelected = 1000;
let bgSquare = ''; // Inizializzazione della variabile bgSquare
let matchConsecutiveError = 0;

function generatorGame() {
    time = startingMinutes * 60;
    numberMoves = 0;
    numberErrors = 0;
    // Reimposta la variabile bgSquare
    nameBgSquare();

    // audio start button 
    playAudio("./audio/start.mp3");

    // svuoto la griglia 
    grid.innerHTML = '';
    moves.textContent = '0';
    errors.textContent = '0';
    timesDom.textContent = '00:00';
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

    // audio loop 
    if (audioLoop) {
        audioLoop.pause();
        audioLoop.currentTime = 0;
    }
    let audioLayout = null;

    if (layoutSelect === 'bros') {
        audioLayout = "./audio/loop.mp3";
        //  bros 
    } else if (layoutSelect === 'simpson') {
        audioLayout = "./audio/sim.mp3";
        //   simpson
    } else {
        audioLayout = "./audio/loop.mp3";
        //   sonic
    }
    audioLoop = new Audio(audioLayout);
    audioLoop.loop = true;
    audioLoop.volume = volumeControl.value;
    audioLoop.play();

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
        const cell = generateCell(singleCard, singleCard, level, bgSquare);
        cell.classList.add('active','true')
        cell.classList.remove(bgSquare)
        setTimeout(() => {
            cell.addEventListener('click', clickCard);
            cell.classList.remove('active','true')
            cell.classList.add(bgSquare)
        }, 3000)
        grid.append(cell);
    }
}


// Funzione che genera una cella
function generateCell(value, symbol, type, bgSquare) {
    const myDiv = document.createElement('div');
    myDiv.classList.add('box', 'none', `${bgSquare}`);
    myDiv.classList.add(`${type}`);
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
    playAudio("./audio/stop.mp3");
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
    reset();
}

// Funzione che gestisce i click sulle carte
function clickCard() {
    playAudio("./audio/beep.mp3");
    if (lookClick) return;
    if (this === firstCard) return;
    this.classList.add('active');
    this.classList.remove(bgSquare); // Usa la variabile bgSquare
    if (!firstCard) {
        firstCard = this;
        return;
    }
    secondCard = this;
    lookClick = true;
    setTimeout(() => controlMatch(bgSquare), cardTimesSelected); // Passa bgSquare alla funzione controlMatch
}

// Funzione per controllare se le carte corrispondono
function controlMatch(bgSquare) {
    const layoutSelect = document.querySelector('#layout').value;
    let match = firstCard.dataset.symbol === secondCard.dataset.symbol;
    let audioError;
    let audioPoint;
    if (layoutSelect === 'bros') {
        audioError = "./audio/error.mp3";
        audioPoint = "./audio/card-points.mp3";
        //  bros 
    } else if (layoutSelect === 'simpson') {
        audioError = "./audio/simError.mp3";
        audioPoint = "./audio/simPoint.mp3";
        audioErrorMast = "./audio/simError3;"
        //   simpson
    } else {
        audioError = "./audio/error.mp3";
        audioPoint = "./audio/card-points.mp3";
        //   sonic
    }
    numberMoves++;
    moves.textContent = numberMoves;
    if (match) {
        matchConsecutiveError = 0;
        point--;
        if (point === 0) {
            clearInterval(timerInterval);
            audioLoop.pause();
            setTimeout(() => {
                const myBoxDom = document.querySelectorAll('.box');
                myBoxDom.forEach(function (element) {
                    element.parentNode.removeChild(element);
                });
                generateMessage(moves.textContent, errors.textContent, timesDom.textContent);
            }, 2000)
        }
        firstCard.removeEventListener("click", clickCard);
        secondCard.removeEventListener("click", clickCard);
        firstCard.classList.remove('none');
        secondCard.classList.remove('none');
        firstCard.classList.add('true');
        secondCard.classList.add('true');
        playAudio(audioPoint);

        // Controlla se tutte le coppie sono state trovate
        if (document.querySelectorAll('.box.true').length === document.querySelectorAll('.box').length) {
            clearInterval(timerInterval); // Ferma il timer alla fine del gioco
        }
    } else {
        // match errato 
        matchConsecutiveError++;
        numberErrors++;
        errors.textContent = numberErrors;
        firstCard.classList.remove('active');
        secondCard.classList.remove('active');
        firstCard.classList.add(bgSquare); // Usa la variabile bgSquare
        secondCard.classList.add(bgSquare); // Usa la variabile bgSquare
        if (layoutSelect === 'simpson' && matchConsecutiveError === 3) {
            playAudio("./audio/simError3.mp3");
        } else {
            playAudio(audioError);
        }
        if (matchConsecutiveError >= 3) {
            matchConsecutiveError = 0;
        }
    }
    reset();
}

// Funzione per resettare le carte e lo stato del gioco
function reset() {
    [firstCard, secondCard, lookClick] = [null, null, false];
}

function timer() {
    clearInterval(timerInterval); // Assicura che il vecchio timer sia fermato
    timerInterval = setInterval(() => {
        const minutes = Math.floor(time / 60);
        let seconds = time % 60;
        timesDom.textContent = `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
        time++;
    }, 1000);
}

function generateMessage(moves, errors, times) {
    playAudio("./audio/win.mp3");
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

function nameBgSquare() {
    const layoutSelect = document.querySelector('#layout').value;
    if (layoutSelect === 'bros') {
        bgSquare = 'bg-square-bros';
        //  bros 
    } else if (layoutSelect === 'sonic') {
        bgSquare = 'bg-square-sonic';
        //   sonic 
    } else {
        bgSquare = 'bg-square-sim';
        //   simpson 
    }
}
