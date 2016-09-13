var audio = require('../engine/audio.js');

module.exports = {

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

    init: function () {


        this.background = ox.spawn('rect', {
            x: 0,
            y: 0,
            width: ox.canvas.width,
            height: ox.canvas.height,
            fill: 'black',
        });

        var dietxt = "Blip Blupper";
        var buttontext = "Start";
        ox.context.font="40px Courier";
        ox.context.fillStyle="white";

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
        this.button = ox.spawn('rect', {
            x: ox.canvas.width * (1/2) - ox.context.measureText(buttontext).width * (1/2),
            y: ox.canvas.height * (2/3),
            width: ox.context.measureText(buttontext).width,
            height: 20,
            fill: 'transparent'
        });

        this.text1 = ox.spawn('text', {
            x: this.button.x,
            y: this.button.y + this.button.height,
            width: this.button.width,
            height: 20,
            text: buttontext,
            px: 20
        });

        var musictext = "m = Toggle Music";
        ox.context.font="10px Courier";
        ox.context.fillStyle="white";
        this.text1 = ox.spawn('text', {
            x: 10,
            y: ox.canvas.height - 20,
            width: ox.context.measureText(musictext).width,
            height: 20,
            text: musictext,
            px: 10
        });

        this.asts = [];
        this.nextAst = 0;
        this.musicplaying = false;

        this.song = audio.play('start');
    },

    draw: function () {


    },

    update: function () {
        // Ast
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

        var outcount = 0;
        var color = this.getRandomColor();
        for(a = 0; a < this.asts.length; a++){
            if (this.asts[a].x > ox.canvas.width + 200 || this.asts[a].x < -200 || this.asts[a].y > ox.canvas.height + 200 || this.asts[a].y < -200) {
                this.asts.splice(a, 1);
            }
            else {
                if (this.asts[a].out == true) {
                    outcount += 1;
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
                    //this.asts[a].p1 = [this.randInt(-20, 20), this.randInt(0, 50)];
                    //this.asts[a].p2 = [this.randInt(-50, 0), this.randInt(-50, 50)];
                    //this.asts[a].p3 = [this.randInt(0, 50), this.randInt(-50, 50)];
                }
                this.asts[a].direction += this.randInt(0,.07);
                this.move(this.asts[a], this.asts[a].move_direction, this.asts[a].speed);
            }
        }
    },

    move: function(ent, direction, distance){
        ent.x += distance * Math.cos(direction);
        ent.y += distance * Math.sin(direction);
    },

    mouseDown: function (button) {
        if (ox.mouse.x >= this.button.x && ox.mouse.x <= this.button.x + this.button.width &&
            ox.mouse.y >= this.button.y && ox.mouse.y <= this.button.y + this.button.height) {
            audio.pause('start');
            ox.scenes.set('main');
        }
    },

    keyUp: function (key) {
        this.isPressed[key] = false;
        if(key == 'm'){
            if(this.musicplaying == true){
                audio.pause();
                this.musicplaying = false;
            }
            else{
                this.song = audio.play('start');
                this.musicplaying = true;
            }
        }
        //console.log("keyUp: " + key);
    }

};
