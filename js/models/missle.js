class Missle {
    /**
     * Initializes the missle that will be going 
     * in the straight line defined by the angle vector.
     */
    constructor (position, angle, speed) {
        this.speed = speed;
        this.position = new Vector(position.x, position.y);
        this.velocity = new Vector(angle.x, angle.y).normalize().mult(this.speed, this.speed);
        this.radius = 8;
        this.color = 'gray';
    }

    /**
     * Updates the missle position and checks the collision with 
     * asteroids and their bullets as well.
     * 
     * If the missle hits the object then the object is destroyed.
     * 
     * If the missle's position is outsied the screen then the missle is destroyed 
     * to avoid the memory consumption by the game. 
     */
    update() {
        this.position.add(this.velocity);
        
        if (this.position.x > canvasWidth || this.position.x < 0 || this.position.y > canvasHeight || this.position.y < 0) {
            this.destroy();
        }

        
        asteroids.forEach(asteroid => {
            // Collision with bullets
            asteroid.bullets.forEach(bullet => {
                let distance = new Vector(bullet.position.x, bullet.position.y).sub(this.position).mag();
                if (distance < this.radius + bullet.radius) {
                    bullet.destroy();
                    game.addToScore(1);
                    this.destroy();
                }
            });
            
            // Collision with asteroids
            if (!asteroid.destroyed) { 
                let distance = new Vector(asteroid.position.x, asteroid.position.y).sub(this.position).mag();
                if (distance < this.radius + asteroid.radius) {
                    asteroid.destroyed = true;
                    game.addToScore(10);
                    this.destroy();
                }
            }
        });
    }


    /**
     * Removes the missle form the player's list of missles.
     */
    destroy() {
        player.missles.forEach((missle, key) => {
            if(missle == this) {
                player.missles.splice(key, 1);
            }
        });
    }

    /**
     * Draws the missle on the screen.
     * .arc() is used to draw circle
     */
    render() {
        canvas.beginPath();
        canvas.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false);
        canvas.fillStyle = this.color;
        canvas.fill();
    }

}