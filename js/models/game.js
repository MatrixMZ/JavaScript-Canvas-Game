class Game {
    /**
     * Constructor sets the attributes for the game and bothers with the global variables,
     * sets the most important informations about the score, level, lives etc.
     * 
     * It also creates the html element handlers to help with updating their content.
     */
    constructor(settings) {
        this.score = 0;
        this.level = 0;
        this.lifes = settings.playerlives;
        this.scoreElement = document.getElementById('score');
        this.levelElement = document.getElementById('level');
        this.lifesElement = document.getElementById('lifes');
        this.asteroidImage = new Image();
        this.asteroidImage.src = './../images/asteroid.svg'; // The asterid image is loaded here to load it only once from the file and set it to every asteroid - asteroid
        this.settings = settings;
        this.gameOverElement = document.getElementById('gameover');
    }

    /**
     * Method generates specified number of asteroids with the position on the screen
     */
    generateAsteroids(number) {
        for(let i = 0; i < number; i++) {
            asteroids.push(new Asteroid(Math.random() * canvasWidth, Math.random() * canvasHeight, 30, 'orange', this.asteroidImage, this.settings));
        }
    }

    /**
     * Incremenets the level shows it on the navigation menu bar and generate
     * appropriate number or asteroids to that level.
     */
    levelUp() {
        this.level++;
        this.levelElement.innerHTML = this.level;
        this.generateAsteroids(this.level);
    }

    /**
     * Adds new points to score and displays it when the player destorys rockets 
     * (bullets) or asteroids.
     */
    addToScore(points) {
        this.score += points;
        this.scoreElement.innerHTML = this.score;
    }

    /** 
     * Updates the level when the asteroids is equals 0 or 
     * shows the game over screen when the amount of player lives is equals 0.
     */
    update() {
        if (this.lifes < 1) {
            finalScore.innerHTML = nick + ', your score is: ' + this.score;
            currentState = states.GAMEOVER;
            this.gameOverElement.style.display = 'block';
        }
        if (asteroids.length == 0) {
            this.levelUp();
        }

    }

    /**
     * Displays player's available lives on the navigation bar
     */
    render() {
        this.lifesElement.innerHTML = '';
        let string = '';
        for(let i = 0; i < this.lifes; i++) {
            string += '<i class="material-icons material-red">favorite</i>';
        }
        this.lifesElement.innerHTML = string;

    }
}