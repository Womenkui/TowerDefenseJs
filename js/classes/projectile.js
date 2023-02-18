class Projectile extends Sprite {
    constructor({position = {x: 0, y: 0}, enemy = enemies[0]}) {
        super({position, imageSrc: '/img/projectile.png'})
        this.velocity = {
            x: 0,
            y: 0
        }
        this.angle = undefined;
        this.radius = 10;
        this.enemy = enemy;
        this.power = 2.5;
    }

    update() {
        this.draw();

        this.angle = Math.atan2(this.enemy.center.y - this.position.y, this.enemy.center.x - this.position.x)
        this.velocity.x = Math.cos(this.angle) * this.power;
        this.velocity.y = Math.sin(this.angle) * this.power;

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}