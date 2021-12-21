import { 
    logout, 
    checkAuth,
    getGames,
    createGame,
} from '../fetch-utils.js';
import { renderGame } from '../render-utils.js';

const currentGameEl = document.getElementById('current-game-container');
const pastGamesEl = document.getElementById('past-games-container');
const logoutButton = document.getElementById('logout');

const nameForm = document.getElementById('name-form');
const teamOneAddButton = document.getElementById('team-one-add-button');
const teamTwoAddButton = document.getElementById('team-two-add-button');
const teamOneSubtractButton = document.getElementById('team-one-subtract-button');
const teamTwoSubtractButton = document.getElementById('team-two-subtract-button');
const finishGameButton = document.getElementById('finish-game-button');
const teamOneLabel = document.getElementById('team-one-name');
const teamTwoLabel = document.getElementById('team-two-name');

checkAuth();


let name1 = '';
let name2 = '';
let score1 = 0;
let score2 = 0;

nameForm.addEventListener('submit', (e) => {
    // don't forget to prevent the default form behavior!
    e.preventDefault();

    // get the name data from the form
    let gameForm = new FormData(nameForm);

    // set the state to this data from the form
    name1 = gameForm.get('team-one');
    name2 = gameForm.get('team-two');

    // reset the form values
    nameForm.reset();

    displayCurrentGameEl();
});


teamOneAddButton.addEventListener('click', () => {
    // increment the current state for team one's score
    score1++;
    displayCurrentGameEl();
});

teamTwoAddButton.addEventListener('click', () => {
    // increment the current state for team two's score
    score2++;
    displayCurrentGameEl();
});

teamOneSubtractButton.addEventListener('click', () => {
    // decrement the current state for team one's score
    score1--;
    displayCurrentGameEl();
});

teamTwoSubtractButton.addEventListener('click', () => {
    // decrement the current state for team two's score
    score2--;
    displayCurrentGameEl();
});

finishGameButton.addEventListener('click', async() => {
    // create a new game using the current game state
    let currentGame = {
        name1,
        name2,
        score1,
        score2
    };
    await createGame(currentGame);
    await displayAllGames();
    
    // after creating this new game, re-fetch the games to get the updated state and display them (hint: call displayAllGames())
            
    name1 = '';
    name2 = '';
    score1 = 0;
    score2 = 0;

    displayCurrentGameEl();
});

logoutButton.addEventListener('click', () => {
    logout();
});

 // on load . . .
window.addEventListener('load', async() => {
    // display all past games (hint: call displayAllGames())
    await displayAllGames();
});


function displayCurrentGameEl() {
    // clear out the current game div
    currentGameEl.textContent = '';

    // change the label to show team one's name;
    teamOneLabel.textContent = name1;
    // change the label to show team two's name;
    teamTwoLabel.textContent = name2;
    // call the render game function to create a game element
    let newgame = {
        name1,
        name2,
        score1,
        score2
    };
    let currentGame = renderGame(newgame);
    
    // append the element to the cleared out current game div
    currentGameEl.append(currentGame);
}


async function displayAllGames() {
    // clear out the past games list in the DOM
    pastGamesEl.textContent = '';
    
    // FETCH ALL GAMES from supabase
    let allGames = await getGames();

    // loop through the past games 
    for (const game of allGames) {
        let newGameEl = renderGame(game);
        pastGamesEl.append(newGameEl);
    }
    // render and append a past game for each past game in state
}


displayCurrentGameEl();
