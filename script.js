const initialWords = ['AMOR', 'CARINHO', 'BEIJO', 'ABRAÇO', 'PAIXÃO', 'NAMORO'];
let words = [...initialWords];
let gridSize = 10;
let selectedCells = [];
let score = 0;

function generateGrid(size) {
    const grid = Array.from({ length: size }, () => Array(size).fill(''));
    words.forEach(word => placeWordInGrid(grid, word));
    fillEmptySpaces(grid);
    return grid;
}

function placeWordInGrid(grid, word) {
    const direction = Math.random() > 0.5 ? 'horizontal' : 'vertical';
    let placed = false;
    while (!placed) {
        let row = Math.floor(Math.random() * (direction === 'horizontal' ? gridSize : gridSize - word.length));
        let col = Math.floor(Math.random() * (direction === 'horizontal' ? gridSize - word.length : gridSize));
        if (canPlaceWord(grid, word, row, col, direction)) {
            for (let i = 0; i < word.length; i++) {
                if (direction === 'horizontal') {
                    grid[row][col + i] = word[i];
                } else {
                    grid[row + i][col] = word[i];
                }
            }
            placed = true;
        }
    }
}

function canPlaceWord(grid, word, row, col, direction) {
    for (let i = 0; i < word.length; i++) {
        if (direction === 'horizontal') {
            if (grid[row][col + i] !== '') return false;
        } else {
            if (grid[row + i][col] !== '') return false;
        }
    }
    return true;
}

function fillEmptySpaces(grid) {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            if (!grid[row][col]) {
                grid[row][col] = letters[Math.floor(Math.random() * letters.length)];
            }
        }
    }
}

function createWordSearch() {
    const grid = generateGrid(gridSize);
    const wordSearchDiv = document.getElementById('word-search');
    wordSearchDiv.style.gridTemplateColumns = `repeat(${gridSize}, 30px)`;
    wordSearchDiv.innerHTML = '';
    grid.forEach((row, rowIndex) => {
        row.forEach((letter, colIndex) => {
            const cell = document.createElement('div');
            cell.textContent = letter;
            cell.dataset.row = rowIndex;
            cell.dataset.col = colIndex;
            cell.addEventListener('click', () => selectCell(cell, letter, rowIndex, colIndex));
            wordSearchDiv.appendChild(cell);
        });
    });
}

function displayWordList() {
    const wordList = document.getElementById('words');
    wordList.innerHTML = '';
    words.forEach(word => {
        const li = document.createElement('li');
        li.textContent = word;
        wordList.appendChild(li);
    });
}

function displayScore() {
    const scoreDiv = document.getElementById('score');
    scoreDiv.textContent = `Pontuação: ${score}`;
}

function selectCell(cell, letter, rowIndex, colIndex) {
    const cellIndex = selectedCells.findIndex(selectedCell => selectedCell.cell === cell);
    if (cellIndex !== -1) {
        cell.classList.remove('selected');
        selectedCells.splice(cellIndex, 1);
    } else {
        cell.classList.add('selected');
        selectedCells.push({ cell, letter, rowIndex, colIndex });
    }
    checkSelectedWord();
}

function checkSelectedWord() {
    const selectedWord = selectedCells.map(selectedCell => selectedCell.letter).join('');
    if (words.includes(selectedWord)) {
        selectedCells.forEach(selectedCell => selectedCell.cell.classList.add('found'));
        words.splice(words.indexOf(selectedWord), 1);
        score += 10;
        displayScore();
        displayWordList();
        selectedCells = [];
        if (words.length === 0) {
            setTimeout(newGame, 1000);
        }
    }
}

function newGame() {
    gridSize += 2;
    words = [...initialWords, ...generateRandomWords()];
    selectedCells = [];
    createWordSearch();
    displayWordList();
}

function generateRandomWords() {
    const randomWords = ['SORRISO', 'ROMANCE', 'SAUDADE', 'FELICIDADE', 'AFETO', 'EMOÇÃO', 'EUTEAMO', 'ENCANTO', 'DOÇURA', 'TERNURA', 'ETERNIDADE', 'APAIXONADA'];
    return randomWords.slice(0, Math.min(randomWords.length, gridSize / 2));
}

document.addEventListener('DOMContentLoaded', () => {
    const scoreDiv = document.createElement('div');
    scoreDiv.id = 'score';
    scoreDiv.textContent = `Pontuação: ${score}`;
    document.body.insertBefore(scoreDiv, document.getElementById('game-container'));
    createWordSearch();
    displayWordList();
    displayScore();
});
