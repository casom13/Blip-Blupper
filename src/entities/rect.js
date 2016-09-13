/**
 * Created by caseyisom on 8/30/16.
 */
module.exports = {
    draw: function () {
        ox.context.beginPath();
        ox.context.rect(this.x, this.y, this.width, this.height);
        ox.context.fillStyle = this.fill;
        ox.context.fill();
    }
};
