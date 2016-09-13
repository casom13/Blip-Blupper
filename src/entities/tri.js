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
        ox.context.moveTo(this.width * (3 / 4), 0);
        ox.context.lineTo(-this.width * (1 / 4), this.height / 2);
        ox.context.lineTo(-this.width * (1 / 4), -this.height / 2);
        ox.context.closePath();
        ox.context.strokeStyle = this.stroke;
        ox.context.lineWidth = 2;
        ox.context.stroke();
        ox.context.fillStyle = this.fill;
        ox.context.fill();

        ox.context.strokeStyle = "black";
        ox.context.globalCompositeOperation = 'destination-out';
        ox.context.lineWidth = 1;
        ox.context.stroke();


        ox.context.restore();
    }
};
