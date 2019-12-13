class Bullet {
    /**
     * Initializes bullet with specified data.
     */
    constructor (position, radius, color, parentAsteroid, speed) {
        this.position = new Vector(position.x, position.y);
        this.radius = radius;
        this.color = color;
        this.parentAsteroid = parentAsteroid; // used to destroy itself from the parent asteroid's list of bullets
        this.speed = speed;
    }

    /**
     * Updates the bullet position to follow the players positon.
     * 
     * Checks the collision with player 
     * if the distance between the bullet and player is lower than the sum of the radiuses 
     * then decrements the players lives and destructs itself to reduct the used memory by this game.
     */
    update() {
        let velocity = (new Vector(player.position.x, player.position.y))
        .sub(new Vector(this.position.x, this.position.y));

        if (velocity.mag() > this.radius + player.radius) {
            this.position.add(velocity.normalize().mult(this.speed, this.speed));
        } else {
            game.lifes--;
            this.destroy();
        }
    }

    /**
     * Removes itself from the parent's object list of bullets.
     */
    destroy() {
        this.parentAsteroid.bullets.forEach((bullet, key) => {
            if(bullet == this) {
                this.parentAsteroid.bullets.splice(key, 1);
            }
            return;
        });
    }

    /**
     * Displays the bullet on the screen.
     */
    render() {
        canvas.beginPath();
        canvas.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false);
        canvas.fillStyle = this.color;
        canvas.fill();
    }

}