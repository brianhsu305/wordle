let guessAttempt = 1;
let guessWords = Array(6).fill('');
let correctWord = '';
const gameMessage = document.getElementById('gameMessage');

const wordsComparison = (attemptWord, correctWord) => {
	console.log(attemptWord, correctWord, guessAttempt);
	if (attemptWord === correctWord) {
		gameMessage.style.opacity = '1';
		gameMessage.innerHTML = 'Congratulations, you got the word!';
		removeEventListener('keydown', handleKeyDown);
	}
	let guessBoxes = document.querySelector('.guesses').children.item(guessAttempt - 1);
	for (let i = 0; i < 5; i++) {
		if (attemptWord[i] === correctWord[i]) {
			guessBoxes.children.item(i).classList.add('green');
		} else if (attemptWord[i] !== correctWord[i] && correctWord.includes(attemptWord[i])) {
			guessBoxes.children.item(i).classList.add('yellow');
		} else {
			guessBoxes.children.item(i).classList.add('grey');
		}
	}
	guessAttempt++;
};

const errorBoxesAffect = (message) => {
	let guessBoxes = document.getElementById(`${guessAttempt}-guess`);
	guessBoxes.classList.add('error');
	setTimeout(() => {
		guessBoxes.classList.remove('error');
	}, 500);
	gameMessage.innerHTML = message;
	gameMessage.classList.add('errorMessage');
	setTimeout(() => {
		gameMessage.classList.remove('errorMessage');
	}, 500);
};

const getWord = async () => {
	try {
		const promise = await fetch('https://words.dev-apis.com/word-of-the-day?random=1');
		const processedResponse = await promise.json();
		correctWord = processedResponse.word;
		console.log(`correct word ${correctWord}`);
	} catch (error) {
		console.log(error);
	}
};

const sendWord = async () => {
	try {
		const response = await fetch('https://words.dev-apis.com/validate-word', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				word: guessWords[guessAttempt - 1],
			}),
		});
		const data = await response.json();
		if (data.validWord) {
			wordsComparison(data.word, correctWord);
		} else {
			errorBoxesAffect('Not a valid word');
		}
	} catch (error) {
		console.log(error);
	}
};

const isLetter = (letter) => /^[a-zA-Z]$/.test(letter);

const update = () => {
	const guessGrid = document.querySelector('.guesses');
	for (let i = 0; i < 6; i++) {
		let guessBoxes = guessGrid.children.item(i);
		for (let j = 0; j < 5; j++) {
			let guessBox = guessBoxes.children.item(j);
			if (guessWords[i][j]) {
				guessBox.innerHTML = guessWords[i][j];
			} else guessBox.innerHTML = '';
		}
	}
};

function handleKeyDown(e) {
	// enter is pressed
	if (e.key === 'Enter') {
		if (guessWords[guessAttempt - 1].length === 5) {
			sendWord();
		} else {
			errorBoxesAffect('Word length not full yet');
		}
	}
	// letter is pressed
	else if (isLetter(e.key)) {
		if (guessWords[guessAttempt - 1].length < 5) {
			guessWords[guessAttempt - 1] += e.key;
		}
	} else if (e.key === 'Backspace') {
		guessWords[guessAttempt - 1] = guessWords[guessAttempt - 1].substring(0, guessWords[guessAttempt - 1].length - 1);
	}

	update();
};


getWord();
addEventListener('keydown', handleKeyDown);