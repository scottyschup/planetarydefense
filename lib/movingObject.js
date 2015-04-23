(function() {
  if (window.Asteroids === undefined) {
    window.Asteroids = {};
  }

  var MovingObject = Asteroids.MovingObject = function(args) {
    this.pos = args['pos'];
    this.vel = args['vel'];
    this.rad = args['rad'];
    this.col = args['col'];
    this.game = args['game'];
  };

  MovingObject.prototype.draw = function (ctx) {
    ctx.drawImage(
      this.img,
      this.pos[0] - (this.rad) * 1.25,
      this.pos[1] - (this.rad) * 1.25,
      this.rad * 2.5,
      this.rad * 2.5
    );

    // ctx.beginPath();
    // ctx.fillStyle = this.col;
    // ctx.arc(
    //   this.pos[0],
    //   this.pos[1],
    //   this.rad,
    //   0,
    //   2 * Math.PI,
    //   true
    // );
    // ctx.fill();
  };

  MovingObject.prototype.isShip = function () {
    return this instanceof Asteroids.Ship;
  },

  MovingObject.prototype.move = function () {
    this.pos[0] += this.vel[0];
    this.pos[1] += this.vel[1];
    this.game.wrap(this.pos);
  };
})();
