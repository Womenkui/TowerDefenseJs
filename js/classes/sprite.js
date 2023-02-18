class Sprite {
    constructor({position = {x: 0, y: 0}, imageSrc, frames = {max: 1}, offset = {x: 0, y: 0}}) {
        this.image = new Image();
        this.image.src = imageSrc;
        this.position = position;
        this.frames = {
            max: frames.max,
            currentFrame: 0,
            elapsed: 0,
            hold: 10
        }
        this.offset = offset
    }

    draw() {
        const cropWidth = this.image.width / this.frames.max;
        const crop = {
            position : {
                x: cropWidth * this.frames.currentFrame,
                y: 0
            },
            width: cropWidth,
            height: this.image.height
        }
        c.drawImage(
            this.image,
            crop.position.x,
            crop.position.y,
            crop.width,
            crop.height,
            this.position.x,
            this.position.y + this.offset.y,
            crop.width,
            crop.height
            )

        this.frames.elapsed++
    }

    update() {
        if (this.frames.elapsed % this.frames.hold === 0) {
            this.frames.currentFrame++;
            if (this.frames.currentFrame >= this.frames.max) {
                this.frames.currentFrame = 0;
            }
        }
    }
}