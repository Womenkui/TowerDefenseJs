class Enemy extends Sprite {
    constructor({ position = {x:0, y:0} }) {
        super({
            position,
            imageSrc: '/img/orc.png',
            frames : {
                max: 7
            },
            offset: {
                x: 0,
                y: 0
            }
        })
        this.width = 100;
        this.height = 50;
        this.waypointIndex = 0;
        this.center = {
            x: this.position.x + this.width / 2,
            y: this.position.y + this.height / 2
        }
        this.radius = this.width / 2
        this.health = 100;
        this.velocity = {
            x: 0,
            y: 0
        }
        this.speed = 1;
    }

    draw() {
        super.draw()

        c.fillStyle = "red"
        c.fillRect(this.position.x, this.position.y - 10, this.width , 10)
        c.fillStyle = "green"
        c.fillRect(this.position.x, this.position.y - 10, this.width * (this.health / 100) , 10)
    }

    update() {
        this.draw();
        super.update();

        const waypoint = waypoints[this.waypointIndex];
        const distY = waypoint.y - this.center.y;
        const distX = waypoint.x - this.center.x;
        const angle = Math.atan2(distY, distX);

        this.velocity.x = Math.cos(angle) * this.speed
        this.velocity.y = Math.sin(angle) * this.speed
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        this.center = {
            x: this.position.x + this.width / 2,
            y: this.position.y + this.height / 2
        }

        if (Math.abs(Math.round(this.center.x) - Math.round(waypoint.x)) < Math.abs(this.velocity.x) &&
            Math.abs(Math.round(this.center.y) - Math.round(waypoint.y)) < Math.abs(this.velocity.y) &&
            this.waypointIndex < waypoints.length - 1)
        {
            this.waypointIndex++;
        }
    }
}