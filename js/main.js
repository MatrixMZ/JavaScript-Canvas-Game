// Creating the variables that will handle the 
// html elements to help later get some data from html 
// and insert some text inside the html elements
var container = document.getElementById('game'); // canvas element
var formHandler = document.getElementById('form'); // form modal
var pauseHolder = document.getElementById('pasue'); // pause button
var finalScore = document.getElementById('finalScore'); // final score element in the game over modal

// Fitting the canvas html element to the screen size
var canvasWidth = window.innerWidth; 
var canvasHeight = window.innerHeight - 62; // 62px is the navigation bar height
container.width = canvasWidth;
container.height = canvasHeight;

var canvas = container.getContext('2d');

var nick = null; // will store the name of the player

// States are very useful in this game,
// the currentState variable under the states
// variable is used in many loops to decide what the 
// applicaton should do in the current state
//
// The states can be like showing game over screen, pausing the game etc.
var states = {
    LOADING_DATA: 0,
    WAITING_FOR_USER_INPUT: 1,
    INIALIZING_GAME: 2,
    PLAYING: 3,
    PAUSE: 4,
    GAMEOVER: 5
};
var currentState = states.LOADING_DATA;

// The settings variable will store the difficulty
// modes that will be later downloaded as json data
// form the php file that will connect with the database.
//
// The difficulty modes keep the data about the objects speed in the game and the player lives.
var settings = [];
var currentSettings = {
    difficulty: 'MEDIUM',
    bulletspeed: 2,
    playermisslespeed: 5,
    playermovespeed: .35,
    playerlives: 5
};


// The XMLHttpRequest is used to get settings from the php file,
// http.onreadystatechange will execute the function that will 
// set the downloaded settings (difficulty modes) into variable, 
// and change the state to let the player choose the difficulty option
const http = new XMLHttpRequest();
const url='../getSettings.php';
http.open('GET', url);
http.send();
http.onreadystatechange = (response) => {
    if(response.target.response != ''){
        settings = JSON.parse(response.target.response);
        currentSettings = settings[0];
        currentState = states.WAITING_FOR_USER_INPUT;
    }
};

// this variable will store the current mouse position on the screen,
// it will be changed in every mouse move in the event listener
var mouse = {
    x: canvasWidth / 2,
    y: canvasHeight / 2
};

// global variables to handle player, game objects, and asteroids objects list
var game;
var player;
var asteroids = [];

// this function is executed when the player submits the form 
// with name and difficulty mode provided,
// it sets the data from the form to the global variables and changes 
// the state to playing state
function setUserData(form) {
    nick = form.elements.namedItem('nick').value
    settings.forEach((value) => {
        if (value.difficulty == form.elements.namedItem('difficulty').value) {
            currentSettings = value;
            this.currentState = states.INIALIZING_GAME;
            formHandler.style.display = "none";
            return false
        }
    });
    formHandler.style.display = 'none';
    return false; // return false to dont reload the page after submitting the form
}

// it is used by INITIALIZE_GAME state to create the game and player objects,
// run handle inputs and change the state to the PLAYING state to run the game
function init() {
    game = new Game(currentSettings);
    runHandleInput();
    player = new Player(currentSettings);
    
    currentState = states.PLAYING;
}

// runs a set of events listeners that will be running in the
// background and execute the function after theevents like mouse moveed, 
// a w s d buttons clicked, widow resized etc 
// to let the player interact with the game
function runHandleInput() {
    window.addEventListener('resize', () => {
        canvasWidth = window.innerWidth;
        canvasHeight = window.innerHeight - 62;
    });

    document.addEventListener('mousemove', (event) => {
        currentX = event.pageX || event.clientX;
        currentY = event.pageY || event.clientY;

        lastMouse = {
            x: (mouse.x - currentX),
            y: (mouse.y - currentY)
        };

        mouse = {
            x: currentX,
            y: currentY
        };
    });

    container.addEventListener('click', (event) => {player.shoot()});
    pauseHolder.addEventListener('click', () => {
        switch(currentState) {
            case states.PLAYING: 
                currentState = states.PAUSE;
                pauseHolder.innerHTML = 'PLAY';
                break;
            case states.PAUSE:
                currentState = states.PLAYING;
                pauseHolder.innerHTML = 'PAUSE';
                break;
        }
    });
    

    function keyListener(event) {
        const keyState = (event.type == 'keydown') ? true : false; 
        switch(event.keyCode) {
            case 87: // W
            player.nextMove.top = keyState;
                break;
            case 65: // A
            player.nextMove.left = keyState;
                break;
            case 68: // D
            player.nextMove.right = keyState;
                break;
            case 83: // S
            player.nextMove.down = keyState;
                break;
        }
    }

    document.addEventListener('keydown', keyListener);
    document.addEventListener('keyup', keyListener);
}

// This is one of the most important finction in this game,
// it is executed many times per second and it updates the objects
// in the game what helps with updating the position of the objects,
// checking collision, etc.
//
// This function uses switch case with the states to decide
// what the application should do in the current state.
function update() {
    switch(currentState) {           
        case states.INIALIZING_GAME:
            init();
        break;

        case states.PLAYING:
            player.update();
            asteroids.forEach((asteroid) => {
                asteroid.update();
            });
            game.update();
            break;
    }
    
}

// Render function is similar to update() function, 
// it displays the objects with the updated position on the screen
function render() {
    switch(currentState) {
        case states.PLAYING:
            canvas.clearRect(0, 0, window.innerWidth, window.innerHeight);
            player.render();
            asteroids.forEach((asteroid) => {
                asteroid.render();
            });
            game.render();
            break;
        case states.GAMEOVER:
            console.log('GAMEOVER, Your Score', game.score);
            break;
    }
    
}

// requestAnimationFrame() creates the recursion in the function 
// so the function will be executed many times per second, 
// usually it is 60 frames per second
function animate() {
    requestAnimationFrame(animate);
    update();
    render();
}

// executing the engine of this game
animate();