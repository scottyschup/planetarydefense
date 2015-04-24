(function() {
  if (window.Asteroids === undefined) {
    window.Asteroids = {};
  }

  var Ship = Asteroids.Ship = function(args) {
    Asteroids.MovingObject.call(this, args);
    this.pos = [Asteroids.Game.DIM_X / 2, Asteroids.Game.DIM_Y - 100];
    this.vel = [0, 0];
    this.col = Ship.COLOR;
    this.rad = Ship.SIZE;
    this.direction = -Math.PI/2;
    this.img = new Image();
    this.img.src = "imgs/puddlejumper_small.png";
  }

  Asteroids.Util.inherits(Ship, Asteroids.MovingObject);

  Ship.SIZE = 20;
  Ship.COLOR = "white";
  Ship.TO_RADIANS = Math.PI/180;

  Ship.prototype.draw = function (ctx) {
    ctx.save();
    ctx.translate(this.pos[0], this.pos[1]);
    ctx.rotate(this.direction);
    ctx.drawImage(
      this.img,
      -(this.rad) * 1.25,
      -(this.rad) * 1.25,
      this.rad * 2.5,
      this.rad * 2.5
    );
    ctx.restore();
  };

  Ship.prototype.fireDrone = function () {
    var drone = new Asteroids.Drone({
      game: this.game,
      pos: [this.pos[0], this.pos[1]],
      vel: [
        Math.cos(this.direction) * 4,
        Math.sin(this.direction) * 4
      ],
      direction: this.direction
    });

    this.game.drones.push(drone);
  };

  Ship.prototype.propel = function (impulse) {
    this.vel[0] += Math.cos(this.direction) * impulse;
    this.vel[1] += Math.sin(this.direction) * impulse;
  };

  Ship.prototype.relocate = function() {
    this.pos = this.game.randomPosition();
    this.vel = [0, 0];
  };

  Ship.prototype.rotate = function (num) {
    var step = Math.PI / 12 * num;
    this.direction = (this.direction + step + Math.PI * 2) % (Math.PI * 2);
  };
})();
