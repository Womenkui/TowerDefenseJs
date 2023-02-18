class Building extends Sprite{
    constructor({position= {x: 0, y:0}}) {
        super({
            position,
            imageSrc: '/img/tower.png',
            frames: {
                max: 19,
                hold: 3,
                currentFrame: 0
            },
            offset: {
                x: 0,
                y: -80
            }
        })
        this.size = 64;
        this.width = 64 * 2;
        this.height = 64;
        this.range = 64 * 5
        this.center = {
            x: this.position.x + this.width / 2,
            y: this.position.y + this.height / 2
        }
        this.projectiles = []
        this.target = undefined;
    }

    draw() {
        super.draw();

        c.beginPath();
        c.arc(this.center.x, this.center.y, this.range, 0, Math.PI * 2)
        c.fillStyle = "rgba(0, 0, 255, 0.08)"
        c.fill();
    }

    update() {
        this.draw();
        if (this.target || (!this.target && this.frames.currentFrame !== 0)) {
            super.update()
        }
        if (this.target && this.frames.currentFrame === 6 && this.frames.elapsed % this.frames.hold === 0) this.shoot();
    }

    shoot() {
        this.projectiles.push(new Projectile({
            position : {
                x: this.center.x - 20,
                y: this.center.y - 110
            }
            , enemy : this.target
        }))
    }
}