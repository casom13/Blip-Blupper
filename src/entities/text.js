module.exports = {
    draw: function () {
        ox.context.font=this.px+"px Courier";
        ox.context.fillStyle="white";
        var text = this.text;
        ox.context.fillText(this.text, this.x, this.y);
    }
};