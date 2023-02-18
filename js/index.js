const canvas = document.querySelector("canvas");
const c = canvas.getContext('2d');
const image= new Image();
const placement2d = [];
const enemies = [];
const explosions = [];
const buildings = [];
const mouse = {
    x: undefined,
    y: undefined
}

let activeTile = undefined;
let enemyCount = 3
let hearts = 10;
let coins = 100;

canvas.addEventListener('click', (event) => {
    if (activeTile && !activeTile.isOccupied && coins - 50 >= 0) {
        coins -= 50;
        document.querySelector("#coinNum").innerHTML = coins;
        buildings.push(new Building({
            position : {
                x: activeTile.position.x,
                y: activeTile.position.y
            }}
        ))
        activeTile.isOccupied = true;
        buildings.sort((a, b) => {
            return a.position.y - b.position.y
        })
    }
})

window.addEventListener("mousemove", (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;

    activeTile = null;
    for (let i = 0; i < placementTiles.length; i++) {
        const tile = placementTiles[i];

        if (mouse.x > tile.position.x && mouse.x < tile.position.x + tile.size &&
            mouse.y > tile.position.y && mouse.y < tile.position.y + tile.size)
        {
            activeTile = tile;
            break;
        }
    }
})

function spawnEnemies(spawnCount) {
    for (let i = 1; i < spawnCount + 1; i++) {
        const xOffset = i * 150
        enemies.push(
            new Enemy({
                position: {x: waypoints[0].x - xOffset, y: waypoints[0].y}
            })
        )
    }
}
spawnEnemies(3)

for (let i = 0; i < placement.length; i += 20) {
    placement2d.push((placement.slice(i, i + 20)));
}

const placementTiles = [];
placement2d.forEach((row, y) => {
    row.forEach((symbol, x) => {
        if (symbol === 14) {
            placementTiles.push(
                new PlacementTile({
                    position: {
                        x: x * 64,
                        y: y * 64
                    }
                })
            )
        }})
})

function animate() {
    const animationFrame = requestAnimationFrame(animate);
    c.drawImage(image, 0, 0);

    for(let i = enemies.length - 1; i >= 0; i--) {
            enemies[i].update();

            if (enemies[i].position.y - enemies[i].radius > canvas.height) {
                enemies.splice(i, 1);
                hearts -= 1;
                document.querySelector("#heartNum").innerHTML = hearts
            }
    }

    for(let i = explosions.length - 1; i >= 0; i--) {
        const explosion = explosions[i];
        explosion.draw();
        explosion.update();

        if (explosion.frames.currentFrame >= explosion.frames.max - 1) {
            explosions.splice(i, 1);
        }
    }

    if (enemies.length == 0) {
        enemyCount += 2;
        spawnEnemies(enemyCount)
    }

    if (hearts === 0) {
      cancelAnimationFrame(animationFrame);
      document.querySelector('#gameOver').style.display = "flex";
    }

    placementTiles.forEach(tile => {
        tile.update(mouse);
    })

    buildings.forEach(building => {
        building.update();
        building.target = null;
        const validEnemies = enemies.filter(enemy => {
            if (Math.hypot(enemy.center.x - building.position.x, enemy.center.y - building.position.y) <= building.range + enemy.radius) {
                return true;
            } else return false;
        })
        building.target = validEnemies[0];

        for(let i = building.projectiles.length - 1; i >= 0; i--) {
            const projectile = building.projectiles[i]
            if (Math.hypot(projectile.enemy.center.x - projectile.position.x, projectile.enemy.center.y - projectile.position.y) <= projectile.enemy.radius + projectile.radius) {
                explosions.push(new Sprite({
                    position: {
                        x: projectile.position.x,
                        y: projectile.position.y},
                    imageSrc: '/img/explosion.png',
                    frames: { max: 4 },
                    offset: {
                        x: 0,
                        y: 0}
                }))
                building.projectiles.splice(i, 1)
                projectile.enemy.health -= 20;

                if (projectile.enemy.health <= 0) {
                    const enemyIndex = enemies.findIndex((enemy) => {
                        return projectile.enemy === enemy;
                    })
                    if (enemyIndex > -1) {
                        enemies.splice(enemyIndex, 1);
                        coins += 25;
                        document.querySelector("#coinNum").innerHTML = coins;
                    }
                }
                continue;
            }
            projectile.update();
        }
    })
}

canvas.width = 1280;
canvas.height = 768;

c.fillStyle = "white";
c.fillRect(0, 0, canvas.width, canvas.height);

image.onload = () => {
    animate();
}
image.src = "/img/map.png";
animate();