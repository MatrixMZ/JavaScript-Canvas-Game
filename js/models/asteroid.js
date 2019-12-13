class Asteroid {
    constructor (x, y, radius, color, img, settings) {
        this.position = new Vector(x, y);
        this.radius = radius;
        this.color = color;
        this.timer = +new Date();
        this.bullets = [];
        this.maxBullets = 5;
        this.bulletsInterval = (Math.random() * 1000) + 500;
        this.destroyed = false;
        this.img = img;
        this.settings = settings;
    }

    update() {
        if(+new Date() - this.timer > this.bulletsInterval && !this.destroyed) {
            if(this.bullets.length < this.maxBullets) { 
                this.bullets.push(new Bullet({...this.position}, 5, 'white', this, +this.settings.bulletspeed));
            } 
            this.timer = +new Date();
        }

        this.bullets.forEach((bullet) => {
            bullet.update();
        });

        if (this.destroyed && this.bullets.length == 0) {
            this.destroy();
        }
    }

    render() {
        this.bullets.forEach((bullet) => {
            bullet.render();
        });

        if (!this.destroyed) {
            canvas.drawImage(this.img, this.position.x - (this.radius * 2.5 /2), this.position.y - (this.radius * 2.5 /2), this.radius * 2.5, this.radius * 2.5);
        }
    }

    destroy() {
        asteroids.forEach((asteroid, key) => {
            if (asteroid == this) {
                asteroids.splice(key, 1);
            }
            return;
        });
    }

}