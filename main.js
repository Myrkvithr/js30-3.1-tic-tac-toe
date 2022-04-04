'use strict'
// alert('OK');


let move = 0,
    winner = '',
    finish = false;

let recordsArr = JSON.parse(localStorage.getItem("recordsArr") || "[]");
console.log(recordsArr);
const recordTime = document.querySelector('.table-records__item-time');
const recordWinner = document.querySelector('.table-records__item-winner');
const recordMoves = document.querySelector('.table-records__item-moves');

printTableData();




const area = document.querySelector('.area');
const btnNewGame = document.querySelector('.btn__new-game');
const areaItemsArr = document.querySelectorAll('.area__item');
const result = document.querySelector('.area__result');

let step = false,

    circle = `<svg class="circle">
<circle r="35" cx="48" cy="48" stroke="rgb(250, 218, 91)" stroke-width="3" fill="none"
    stroke-linecap="round" />
</svg>`,

    cross = `<svg class="cross">
<line class="first" x1="15" y1="15" x2="80" y2="80" stroke="rgb(250, 218, 91)" stroke-width="3"
    stroke-linecap="round" />
<line class="second" x1="80" y1="15" x2="15" y2="80" stroke="rgb(250, 218, 91)" stroke-width="3"
    stroke-linecap="round" />
</svg>`;



function stepCross(target) {
    target.innerHTML = cross;
    target.classList.add('cross-label');
    let crossAudio = new Audio('assets/audio/cross.mp3');
    crossAudio.play();
    move++; //-----увеличить количество ходов на 1
}

function stepCircle(target) {
    target.innerHTML = circle;
    target.classList.add('circle-label');
    let circleAudio = new Audio('assets/audio/circle.mp3');
    circleAudio.play();
    move++; //-----увеличить количество ходов на 1
}




function init(elem) {
    //--- проверка попадания по ячейке
    // console.log(!elem.target.classList.contains('area') && elem.target.classList.contains('area__item'), elem.target.classList);

    if (!elem.target.classList.contains('area') && elem.target.classList.contains('area__item')) {
        if (!step) {
            stepCross(elem.target);
            // console.log(elem.target)
        } else {
            stepCircle(elem.target);
            // console.log(elem.target)
        }
        step = !step;
        win();
    }
}




function win() {
    const winArr = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ]

    for (let i = 0; i < winArr.length; i++) {
        //--Проверка выигрыша крестиков
        if (areaItemsArr[winArr[i][0]].classList.contains('cross-label') &&
            areaItemsArr[winArr[i][1]].classList.contains('cross-label') &&
            areaItemsArr[winArr[i][2]].classList.contains('cross-label')) {


            finish = true;

            area.removeEventListener('click', init); //--убирает слушателя нажатия на поле игры
            areaItemsArr[winArr[i][0]].classList.add('active');
            areaItemsArr[winArr[i][1]].classList.add('active');
            areaItemsArr[winArr[i][2]].classList.add('active');
            setTimeout(() => { //--задержка для отрисовки фигуры в ячейке
                result.innerHTML = 'Выиграли Крестики!!';
            }, 1000);
            winner = 'крестики';
            let date = new Date().toLocaleString();
            setDataToTable(winner, move, date);
            localStorage.setItem('recordsArr', JSON.stringify(recordsArr));

        }

        //--Проверка выигрыша ноликов
        else if (areaItemsArr[winArr[i][0]].classList.contains('circle-label') &&
            areaItemsArr[winArr[i][1]].classList.contains('circle-label') &&
            areaItemsArr[winArr[i][2]].classList.contains('circle-label')) {


            finish = true;
            move--;

            area.removeEventListener('click', init); //--убирает слушателя нажатия на поле игры
            areaItemsArr[winArr[i][0]].classList.add('active');
            areaItemsArr[winArr[i][1]].classList.add('active');
            areaItemsArr[winArr[i][2]].classList.add('active');
            setTimeout(() => { //--задержка для отрисовки фигуры в ячейке
                result.innerHTML = 'Выиграли Нолики!!';
            }, 1000);
            winner = 'нолики';
            let date = new Date().toLocaleString();
            setDataToTable(winner, move, date);
            localStorage.setItem('recordsArr', JSON.stringify(recordsArr));


        }

    }
    if (move === 9 && finish === false) {

        area.removeEventListener('click', init); //--убирает слушателя нажатия на поле игры
        setTimeout(() => { //--задержка для отрисовки фигуры в ячейке

            result.innerHTML = 'НИЧЬЯ!!';
        }, 1000);
        winner = 'ничья';
        let date = new Date().toLocaleString();
        setDataToTable(winner, move, date);
        localStorage.setItem('recordsArr', JSON.stringify(recordsArr));

    }
}


function newGame() {
    step = false;
    move = 0;
    winner = '';
    finish = false;
    result.innerHTML = '';
    areaItemsArr.forEach(elem => {
        elem.innerHTML = '';
        elem.classList.remove('cross-label', 'circle-label', 'active');
    });

    area.addEventListener('click', init);
}










function setDataToTable(winner, move, date) {


    if (recordsArr.length < 10) {
        recordsArr.push({
            date,
            winner,
            move
        });
    } else {
        recordsArr.pop();
        recordsArr.push({
            date,
            winner,
            move
        });
    }
    recordsArr.sort(function (a, b) {
        return a.move - b.move;
    });

    printTableData();
}

function printTableData() {
    document.querySelector('.table-records__item-time').innerHTML = '';
    document.querySelector('.table-records__item-winner').innerHTML = '';
    document.querySelector('.table-records__item-moves').innerHTML = '';

    recordsArr.forEach((el) => {
        let timeData = document.createElement(`div`);
        timeData.innerHTML = `${el.date}`;
        recordTime.append(timeData);

        let winnerData = document.createElement(`div`);
        winnerData.innerHTML = `${el.winner}`;
        recordWinner.append(winnerData);

        let moveData = document.createElement(`div`);
        moveData.innerHTML = `${el.move}`;
        recordMoves.append(moveData);
    });

}

btnNewGame.addEventListener('click', newGame);
area.addEventListener('click', init);
