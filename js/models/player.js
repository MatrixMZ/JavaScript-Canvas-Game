class Player {
    /**
     * Initializes player with specified settings like player speed and missle speed,
     * sets the svg icon as the player object image,
     * uses the Vector objects to describes the player position, velocity and acceleration
     */
    constructor(customSettings) {
        this.img = new Image();
        this.img.src = './../images/player.svg';
        this.nextMove = {
            top: false,
            down: false,
            left: false,
            right: false
        };
        this.position = new Vector(canvasWidth / 2, canvasHeight / 2);
        this.velocity = new Vector(0, 0);
        this.acceleration = new Vector(0.9, 0.9);
        this.radius = 10;
        this.angle = new Vector(0, 0); // directed to the mouse position
        this.missles = [];
        this.speed = +customSettings.playermovespeed;
        this.missleSpeed = +customSettings.playermisslespeed;
    }

    /**
     * Launches the missle, puts the Missle object to the list of missles,
     * the missle takes the parameters ({...variable}) spread operator is to use 
     * the copy of the Vector object but not the reference
     * othervise all of the missles will have tha same position and speed
     */
    shoot() {
        this.missles.push(new Missle({...this.position}, {...this.angle}, this.missleSpeed));
    }

    /**
     * Updates the position of the player if the event listener 
     * has detected the A, W, S, D key pressed,
     * updates the positon of all of the player's missles
     */
    update() {
        // updates the angle to direct the player's arrow icon to the mouse position
        this.angle = new Vector(mouse.x, mouse.y - 62).sub(new Vector(this.position.x, this.position.y));

        if (this.nextMove.left) {
            this.velocity.add(new Vector(-this.speed, 0));
        } 
        if (this.nextMove.right) {
            this.velocity.add(new Vector(this.speed, 0));
        } 
        if (this.nextMove.top) {
            this.velocity.add(new Vector(0, -this.speed));
        } 
        if (this.nextMove.down) {
            this.velocity.add(new Vector(0, this.speed));
        } 
        
        let next = this.position;
        next.add(this.velocity);
        next.mag(0.9);

        // checks the collision with window orders to dont let player move outside from the screen
        if (next.x - this.radius < 0) { this.position.x = this.radius; } 
        if (next.x + this.radius > canvasWidth) { this.position.x = canvasWidth - this.radius; } 
        if (next.y - this.radius < 0) { this.position.y = this.radius; } 
        if (next.y + this.radius > canvasHeight) { this.position.y = canvasHeight - this.radius; } 

        // .mult helps to deduct player speed when he releses the A W S D button.
        this.velocity.mult(0.9);
        this.position.add(this.velocity);

        this.missles.forEach(missle => missle.update());
    }


    /**
     * Lets all of the missles to render itself,
     * uses rotation and transorm to rotate the player arrow to be directed to the mouse position
     */
    render() {
        this.missles.forEach(missle => missle.render());

        canvas.save(); // save current state
        canvas.translate(this.position.x, this.position.y);
        canvas.rotate(Math.atan2(this.angle.x, -this.angle.y)); // rotate with radian degrees
        canvas.translate(-this.position.x, -this.position.y);
        canvas.drawImage(this.img, this.position.x - 25, this.position.y - 25 , 50, 50); // drows arrow
        canvas.restore(); // takes back the player position to its normal position
    }
}