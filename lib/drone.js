(function() {
  if (window.Asteroids === undefined) {
    window.Asteroids = {};
  }

  var Drone = Asteroids.Drone = function(args) {
    Asteroids.MovingObject.call(this, args);
    this.rad = Drone.SIZE;
    this.img = new Image();
    this.img.src = Drone.IMG;
    this.direction = args.direction;
  }

  Asteroids.Util.inherits(Drone, Asteroids.MovingObject);

  Drone.SIZE = 1;
  Drone.IMG = 'imgs/drone.png'
  // Drone.COLOR = "#aaa";

  Drone.prototype.draw = function (ctx) {
    ctx.save();
    ctx.translate(this.pos[0], this.pos[1]);
    ctx.rotate(this.direction);
    ctx.drawImage(
      this.img,
      -(this.rad) * 20,
      -(this.rad) * 10,
      this.rad * 40,
      this.rad * 20
    );
    ctx.restore();
  };

  Drone.prototype.isNearTarget = function (target) {
    if (target.collides) {
      var distance = Math.sqrt(
        Math.pow(this.pos[0] - target.pos[0], 2) +
        Math.pow(this.pos[1] - target.pos[1], 2)
      );
      if (distance < (this.rad + target.rad) * 3) {
        return true;
      }
      return false;
    }
  };

  Drone.prototype.move = function () {
    Asteroids.MovingObject.prototype.move.call(this);
    var asteroids = this.game.asteroids;
    for (var i = 0; i < asteroids.length; i ++) {
      if (this.isNearTarget(asteroids[i])) {
        this.redirect(asteroids[i].pos);
      }
    }
  };

  Drone.prototype.redirect = function (pos) {
    var diff = [pos[0] - this.pos[0], pos[1] - this.pos[1]];
    this.direction = Math.atan2(diff[1], diff[0]);
    this.vel[0] += Math.cos(this.direction) * 0.5;
    this.vel[1] += Math.sin(this.direction) * 0.5;
  };

  Drone.prototype.remove = function () {
    var idx = this.game.drones.indexOf(this);
    this.game.drones.splice(idx, 1);
  };
})();
