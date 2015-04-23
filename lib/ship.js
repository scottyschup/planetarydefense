(function() {
  if (window.Asteroids === undefined) {
    window.Asteroids = {};
  }

  var Ship = Asteroids.Ship = function(args) {
    Asteroids.MovingObject.call(this, args);
    this.pos = [Asteroids.Game.DIM_X / 2, Asteroids.Game.DIM_Y / 2];
    this.vel = [0, 0];
    this.col = Ship.COLOR;
    this.rad = Ship.SIZE;
    this.direction = Math.PI/2;
  }

  Asteroids.Util.inherits(Ship, Asteroids.MovingObject);

  Ship.SIZE = 10;
  Ship.COLOR = "white";

  Ship.prototype.relocate = function() {
    this.pos = this.game.randomPosition();
    this.vel = [0, 0];
  };

  Ship.prototype.power = function (impulse) {
    this.vel[0] += impulse[0];
    this.vel[1] += impulse[1];
  };

  Ship.prototype.draw = function (ctx) {
    Asteroids.MovingObject.prototype.draw.call(this, ctx);

    ctx.strokeStyle = "blue";
    ctx.beginPath();
    ctx.arc(this.pos[0],
            this.pos[1],
            this.rad,
            this.direction - 0.5,
            this.direction + 0.5,
            false);
    ctx.lineWidth = 3;
    ctx.stroke();
  };

  Ship.prototype.rotate = function (num) {
    this.direction += 0.1 * num;
  };
})();
