/**
 * Created by caseyisom on 8/30/16.
 */
module.exports = {
    draw: function () {

        ox.context.save();
        ox.context.translate(this.x, this.y);
        ox.context.rotate(this.direction);

        // Draw Ship 1
        ox.context.beginPath();
        ox.context.arc(0, 0, this.r, 0, .5 * Math.PI);
        ox.context.lineTo(this.p1[0], this.p1[1]);
        ox.context.lineTo(this.p2[0], this.p2[1]);
        ox.context.arc(0, 0, this.r, 1 * Math.PI, -.5 * Math.PI);
        ox.context.lineTo(this.p3[0], this.p3[1]);
        ox.context.arc(0, 0, this.r, 0, .5 * Math.PI);
        ox.context.closePath();
        ox.context.strokeStyle = "white";
        ox.context.lineWidth = 1;
        ox.context.stroke();

        ox.context.fillStyle = this.fill;
        ox.context.fill();


        ox.context.restore();

    }
};
