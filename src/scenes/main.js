var audio = require('../engine/audio.js');

module.exports = {

    // Define a few functions for the scene to use
    randInt: function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    dirTo: function(x1, y1, x2, y2) {
        var a = Math.atan2((y2-y1), (x2-x1));
        if (a < 0)
            a += 2*Math.PI;

        return a;
    },

    RectCircleColliding: function (circle,rect){
        if(circle === undefined){return false;}
        var distX = Math.abs(circle.x - rect.x-rect.width/2);
        var distY = Math.abs(circle.y - rect.y-rect.height/2);

        if (distX > (rect.width/2 + circle.r)) { return false; }
        if (distY > (rect.height/2 + circle.r)) { return false; }

        if (distX <= (rect.width/2)) { return true; }
        if (distY <= (rect.height/2)) { return true; }

        var dx=distX-rect.width/2;
        var dy=distY-rect.height/2;
        return (dx*dx+dy*dy<=(circle.r*circle.r));
    },

    getRandomColor: function() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    },

    // Init Main Scene
    init: function () {

        // Define Constants
        this.ships = [];
        this.bullets = [];
        this.asts = [];
        this.shipRespawn = 0;
        this.colorMode = 0;
        this.lives = 4;
        this.lifeships = [];
        this.dead = false;
        this.musicplaying = true;
        this.outcount = 0;
        this.nextAst = this.randInt(0,100);
        this.isPressed = {};

        // Define Music
        this.song = audio.play('main');

        // Create Background
        this.background = ox.spawn('rect', {
            x: 0,
            y: 0,
            width: ox.canvas.width,
            height: ox.canvas.height,
            fill: 'black',
        });

        // Create Ship
        this.ship = ox.spawn('tri', {
            x: ox.canvas.width / 2,
            y: ox.canvas.height / 2,
            width: 40,
            height: 20,
            direction: 0,
            move_direction: 0,
            speed: 0,
            top_speed: 10,
            min_speed: 3,
            out: false,
            new: 20,
            last_bullet: 10,
            fill: 'black',
            flash: 0,
            stroke: 'white'
        });

        this.ships.push(this.ship);

        // Life Ships Icons
        this.life1 = ox.spawn('tri', {
            x: ox.canvas.width - 20,
            y: 35,
            width: 30,
            height: 15,
            direction: 1.5 * Math.PI,
            out: false,
            fill: 'black'
        });

        this.life2 = ox.spawn('tri', {
            x: ox.canvas.width - 40,
            y: 35,
            width: 30,
            height: 15,
            direction: 1.5 * Math.PI,
            out: false,
            fill: 'black'
        });
        this.life3 = ox.spawn('tri', {
            x: ox.canvas.width - 60,
            y: 35,
            width: 30,
            height: 15,
            direction: 1.5 * Math.PI,
            out: false,
            fill: 'black'
        });

        this.lifeships.push(this.life1);
        this.lifeships.push(this.life2);
        this.lifeships.push(this.life3);

    },

    update: function (dt) {

        // Check if Alive
        if(this.lives == 0){
            if(this.dead == false){
                this.dead = true;
                this.die();
            }
        }
        else{
            // Check if you have died and need to be re-spawned
            if(this.ships.length == 0){
                if(this.shipRespawn == 0) {
                    this.ship = ox.spawn('tri', {
                        x: ox.canvas.width / 2,
                        y: ox.canvas.height / 2,
                        width: 40,
                        height: 20,
                        direction: 0,
                        move_direction: 0,
                        speed: 0,
                        top_speed: 10,
                        min_speed: 3,
                        out: false,
                        new: 150,
                        last_bullet: 10,
                        fill: 'black',
                        flash: 10,
                        stroke: 'white'
                    });

                    this.ships.push(this.ship);
                }
                else{
                    this.shipRespawn -= 1;
                }
            }

            // Ships
            for(i = 0; i < this.ships.length; i++) {
                // Controls
                if (this.isPressed['right']) {
                    this.ships[i].direction += Math.PI / 128;
                }
                if (this.isPressed['left']) {
                    this.ships[i].direction -= Math.PI / 128;
                }
                if (this.isPressed['up']) {
                    if (this.ships[i].speed < this.ship.top_speed) {
                        this.ships[i].move_direction = this.ships[i].direction;
                        this.ships[i].speed += 1;
                    }
                }
                else {
                    if (this.ships[i].speed > this.ships[i].min_speed) {
                        this.ships[i].speed -= 1;
                    }
                }
                if (this.isPressed['spacebar'] && this.ships[i].last_bullet == 0) {
                    this.shoot(this.ships[i]);
                    this.ships[i].last_bullet = 20;
                }
                if (this.ships[i].last_bullet > 0) {
                    this.ships[i].last_bullet -= 1;
                }
                if (this.ships[i].speed > 0) {
                    this.move(this.ships[i], this.ships[i].move_direction, this.ships[i].speed);
                }

                if (this.ships[i].new == 0) {
                    // Check if out of bounds
                    if (this.ships[i].x + (this.ships[i].width / 2) > ox.canvas.width && this.ships[i].out == false) {
                        this.teleport(this.ships[i], 'r');
                    }
                    else if (this.ships[i].x + (this.ships[i].width / 2) < 0 && this.ships[i].out == false) {
                        this.teleport(this.ships[i], 'l');
                    }
                    else if (this.ships[i].y + (this.ships[i].height / 2) < 0 && this.ships[i].out == false) {
                        this.teleport(this.ships[i], 'u');
                    }
                    else if (this.ships[i].y + (this.ships[i].height / 2) > ox.canvas.height && this.ships[i].out == false) {
                        this.teleport(this.ships[i], 'd');
                    }
                    else if (this.ships[i].x > ox.canvas.width + 100 || this.ships[i].x < -50 || this.ships[i].y > ox.canvas.height + 50 || this.ships[i].y < -50) {
                        this.ships[i].disable();
                        this.ships.splice(i, 1);
                    }
                }
                else {
                    this.ships[i].new -= 1;
                }
            }
        }

        // Lives
        if(this.lives == 3){
            this.lifeships[2].disable();
        }
        else if(this.lives == 2){
            this.lifeships[1].disable();
        }
        else if(this.lives == 1){
            this.lifeships[0].disable();
        }

        // Bullets
        for(j = 0; j < this.bullets.length; j++){
            this.move(this.bullets[j], this.bullets[j].direction, this.bullets[j].speed);
            if(this.bullets[j].x > ox.canvas.width + 100 || this.bullets[j].x < -50 || this.bullets[j].y > ox.canvas.height + 50 || this.bullets[j].y < -50) {
                this.bullets[j].disable();
                this.bullets.splice(j, 1);
            }
        }

        // Astroids
        if(this.nextAst == 0){
            var x = this.randInt(0, ox.canvas.width);
            var y = this.randInt(0, ox.canvas.height);
            var rand = this.randInt(1,4);
            if(rand == 1){
                x = -10;
            }
            else if(rand == 2){
                x = ox.canvas.width + 10;
            }
            else if(rand == 3){
                y = ox.canvas.height + 10;
            }
            else{
                y = -10;
            }

            var randpointx = this.randInt(ox.canvas.width * (1/4), ox.canvas.width * (3/4));
            var randpointy = this.randInt(ox.canvas.height * (1/4), ox.canvas.height * (3/4));
            var randpoint = this.dirTo(x,y,randpointx, randpointy);
            //console.log(randpointx+ ',' +randpointy);

            this.ast = ox.spawn('ast', {
                x: x,
                y: y,
                r: this.randInt(20, 60),
                p1: [this.randInt(-20, 20), this.randInt(0, 50)],
                p2: [this.randInt(-50, 0), this.randInt(-50, 50)],
                p3: [this.randInt(0, 50), this.randInt(-50, 50)],
                width: 100,
                height: 100,
                direction: randpoint,
                move_direction: randpoint,
                speed: this.randInt(1, 4),
                out: false,
                fill: 'black'
            });

            this.asts.push(this.ast);

            this.nextAst = this.randInt(0,150);
        }
        else{
            this.nextAst -= 1;
        }

        this.outcount = 0;
        var color = this.getRandomColor();
        for(a = 0; a < this.asts.length; a++){
            if (this.asts[a].x > ox.canvas.width + 200 || this.asts[a].x < -200 || this.asts[a].y > ox.canvas.height + 200 || this.asts[a].y < -200) {
                //console.log('x:' + this.asts[a].x + ' y:' + this.asts[a].y);
                this.asts.splice(a, 1);
            }
            else {
                if (this.asts[a].out == true) {
                    this.outcount += 1;
                    if(this.colorMode == 1){
                        this.asts[a].fill = color;
                    }
                    this.asts[a].speed = 0;
                    if(this.asts[a].r >= 0.1 ){
                        this.asts[a].r -= .1;
                    }
                    if(this.asts[a].p1[0] >= 1) {
                        this.asts[a].p1 = [this.asts[a].p1[0] - 1, this.asts[a].p1[1] - 1];
                    }
                    if(this.asts[a].p2[0] >= 1) {
                        this.asts[a].p2 = [this.asts[a].p2[0] - 1, this.asts[a].p2[1] - 1];
                    }
                    if(this.asts[a].p3[0] >= 1){
                        this.asts[a].p3 = [this.asts[a].p3[0] - 1, this.asts[a].p3[1] - 1];
                    }
                    // Randomize Angles of Dead Ast
                    //this.asts[a].p1 = [this.randInt(-20, 20), this.randInt(0, 50)];
                    //this.asts[a].p2 = [this.randInt(-50, 0), this.randInt(-50, 50)];
                    //this.asts[a].p3 = [this.randInt(0, 50), this.randInt(-50, 50)];
                }
                this.asts[a].direction += this.randInt(0,.07);
                this.move(this.asts[a], this.asts[a].move_direction, this.asts[a].speed);
            }
        }

        // Change color of ast after they die?
        if(this.outcount >= 20){
            //this.colorMode = 1;
        }

        // Collision

        // Ast and Bullets && Ships and Ast
        for(b = 0; b < this.asts.length; b++) {
            if (this.asts[b].out == false){
                for (c = 0; c < this.bullets.length; c++) {
                    if (this.RectCircleColliding(this.asts[b], this.bullets[c])) {
                        this.bullets[c].disable();
                        this.bullets.splice(c, 1);
                        this.asts[b].out = true;
                        this.asts[b].fill = 'white';
                    }
                }
                for (d = 0; d < this.ships.length; d++) {
                    if (this.RectCircleColliding(this.asts[b], this.ships[d]) && this.ships[d].new == 0) {
                        this.ships[d].disable();
                        this.ships.splice(d, 1);
                        if (this.ships.length == 0) {
                            this.shipRespawn = 40;
                            this.lives -= 1;
                        }
                    }
                }
            }
        }
    },

    shoot: function(ent){
        this.bullet = ox.spawn('rect', {
            x: ent.x + (ent.width * (3/4)) * Math.cos(ent.direction),
            y: ent.y + (ent.width * (3/4)) * Math.sin(ent.direction),
            fill: 'white',
            width: 2,
            height: 2,
            direction: ent.direction,
            speed: 10,
            top_speed: 10,
            min_speed: 3,
            out: false
        });

        this.bullets.push(this.bullet);
    },

    changeAst: function(ents){
        for(b = 0; b < this.asts.length; b++) {
            if (this.asts[b].out == true) {
                this.asts[b].fill = 'white';
            }
        }
        for (d = 0; d < this.ships.length; d++) {
            //this.ships[d].fill = 'white';
        }
    },

    teleport: function(ent, ax){
        ent.out = true;
        var x = ent.x;
        var y = ent.y;

        if(ax == 'r') {
            x = 0;
        }
        else if(ax == 'l'){
            x = ox.canvas.width;
        }
        else if(ax == 'u'){
            y = ox.canvas.height;
        }
        else if(ax == 'd'){
            y = 0;
        }


        this.ship2 = ox.spawn('tri', {
            x: x,
            y: y,
            width: 40,
            height: 20,
            direction: ent.direction,
            move_direction: ent.move_direction,
            speed: ent.speed,
            top_speed: 10,
            min_speed: 3,
            out: false,
            new: 10,
            last_bullet: 10,
            fill: 'black',
            flash: 0,
            stroke: 'white'
        });

        this.ships.push(this.ship2);
    },

    die: function(){
        // The End
        //ox.context.font="40px Courier";
        //ox.context.fillStyle="white";
        var dietxt = "You Died";
        var buttontext = "Restart";
        var scoretext = "Score: " + this.outcount;
        ox.context.font="40px Courier";
        ox.context.fillStyle="white";

        //console.log(ox.context.measureText(dietxt).width);

        this.text = ox.spawn('text', {
            x: ox.canvas.width * (1/2) - ox.context.measureText(dietxt).width * (1/2),
            y: ox.canvas.height * (1/3),
            width: ox.context.measureText(dietxt).width,
            height: 20,
            text: dietxt,
            px: 40
        });

        ox.context.font="20px Courier";
        ox.context.fillStyle="white";

        this.scoretext = ox.spawn('text', {
            x: ox.canvas.width * (1/2) - ox.context.measureText(scoretext).width * (1/2),
            y: ox.canvas.height * (1/3) + 100,
            width: ox.context.measureText(scoretext).width,
            height: 20,
            text: scoretext,
            px: 20
        });

        this.button = ox.spawn('rect', {
            x: ox.canvas.width * (1/2) - ox.context.measureText(buttontext).width,
            y: ox.canvas.height * (2/3),
            width: ox.context.measureText(buttontext).width,
            height: 20,
            fill: 'transparent'
        });

        this.text1 = ox.spawn('text', {
            x: this.button.x + ox.context.measureText(buttontext).width * (1/2),
            y: this.button.y + this.button.height,
            width: this.button.width,
            height: 20,
            text: buttontext,
            px: 20
        });

        this.dead = true;

    },

    move: function(ent, direction, distance){
        ent.x += distance * Math.cos(direction);
        ent.y += distance * Math.sin(direction);
    },

    keyDown: function (key) {
        //console.log("keyDown: " + key);
    },

    keyPress: function (key) {
        this.isPressed[key] = true;
        //console.log("keyPress: " + key);
    },

    keyUp: function (key) {
        this.isPressed[key] = false;
        if(key == 'm'){
            if(this.musicplaying == true){
                audio.pause();
                this.musicplaying = false;
            }
            else{
                this.song = audio.play('main');
                this.musicplaying = true;
            }
        }
        //console.log("keyUp: " + key);
    },

    mouseDown: function (button) {
        //ox.audio['ox.mp3'].play();
        if(this.dead == true) {
            if (ox.mouse.x >= this.button.x && ox.mouse.x <= this.button.x + this.button.width &&
                ox.mouse.y >= this.button.y && ox.mouse.y <= this.button.y + this.button.height) {
                audio.pause();
                ox.scenes.set('main');
            }
        }
        //console.log("Clicked: " + ox.mouse.x + ", " + ox.mouse.y + " with " + button + " button.");
    },

    mouseUp: function (button) {
        //console.log("Released: " + ox.mouse.x + ", " + ox.mouse.y + " with " + button + " button.");
    }
};
