//IntelliSense in VS Code for HTML Canvas
/** @type {HTMLCanvasElement} */

//links the html canvas to a variable called canvas
const canvas = document.getElementById("canvas1");

//sets drawing context of canvas to 2d
const ctx = canvas.getContext('2d')

canvas.width = 500;
canvas.height = 700;

//holds all active explosion objects
const explosions = [];

let canvasPosition = canvas.getBoundingClientRect();

class Explosion {
    constructor(x, y) {

        //width of png is 1000 divided by 5 frames = 200 width
        this.spriteWidth = 200;
        this.spriteHeight = 179;

        //sets width and height of object to half of original size
        this.width = this.spriteWidth * 0.7;
        this.height = this.spriteHeight * 0.7;

        
        this.x = x ;
        this.y = y ;

        //image class constructor, will make new HTML image element
        this.image = new Image();

        //points to image source
        this.image.src = './media/images/boom.png';

        //frame counter
        this.frame = 0

        //staggers animation
        this.timer = 0;
        this.staggerValue = 7;

        //sets random angle for explosion
        this.angle = Math.random() * 6.2;

        //sound class constructor
        this.deathAudio = new Audio();

        //points to audio source

        this.deathAudio.src = './media/sfx/mutantdie.wav';
    }

    //this method will animate our sprite
    update() {
        //plays the adio once on frame 0
        if (this.frame === 0) this.deathAudio.play();
        
        this.timer++;

        if (this.timer % this.staggerValue === 0) {
            this.frame++
        }
    }

    //this method will draw our sprite
    draw() {  
        //saves the sprite object
        ctx.save();
        //translates rotation center point
        ctx.translate(this.x, this.y)
        //then rotates the sprite
        ctx.rotate(this.angle)
        //draws it
        ctx.drawImage(this.image, this.spriteWidth * this.frame, 0,
                                             
                            // Should be divided by 2 instead of 3, but 3 works better?! EDIT now 2 works better again?`tf
            this.spriteWidth, this.spriteHeight, 0 - this.width / 2, 0 - this.height / 2, this.width, this.height)
        //restores the saved object
        ctx.restore()
    }
}

//executes when user "clicks"
window.addEventListener('click', function (e) {
    createAnimation(e)
});



function createAnimation(e) {
    let positionX = e.x - canvasPosition.left - 25;
    let positionY = e.y - canvasPosition.top - 25;

    //creates a new Explosion object, passing positionX and positionY into the constructor
    explosions.push(new Explosion(positionX, positionY));
}


function animate() {

    //clears already drawn frames
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    //animates each frame
    for (let i = 0; i < explosions.length; i++) {
        explosions[i].update();
        explosions[i].draw();

        //checks if animation is done, removes that object from array
        if (explosions[i].frame > 5) {
            explosions.splice(i, 1);
            i--;
        }
    }

    requestAnimationFrame(animate);
}

animate()