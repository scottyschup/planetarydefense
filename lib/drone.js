(function() {
  if (window.Asteroids === undefined) {
    window.Asteroids = {};
  }

  var Drone = Asteroids.Drone = function(args) {
    Asteroids.MovingObject.call(this, args);
    this.rad = Drone.SIZE;
    // this.col = Drone.COLOR;
    this.lockedOn = false;
    this.img = new Image();
    this.img.src = 'imgs/drone.png';
    this.direction = args.direction;
  }

  Asteroids.Util.inherits(Drone, Asteroids.MovingObject);

  Drone.SIZE = 1;
  // Drone.COLOR = "#aaa";

  Drone.prototype.draw = function (ctx) {
    ctx.save();
    ctx.translate(this.pos[0], this.pos[1]);
    ctx.rotate(this.direction);
    ctx.drawImage(
      this.img,
      -(this.rad) * 12.5,
      -(this.rad) * 1,
      this.rad * 25,
      this.rad * 12.5
    );
    ctx.restore();
  };

  Drone.prototype.isNearAsteroid = function (asteroid) {
    var distance = Math.sqrt(
      Math.pow(this.pos[0] - asteroid.pos[0], 2) +
      Math.pow(this.pos[1] - asteroid.pos[1], 2)
    );
    if (distance < (this.rad + asteroid.rad) * 3) {
      return true;
    }
    return false;
  };

  Drone.prototype.move = function () {
    Asteroids.MovingObject.prototype.move.call(this);
    var asteroids = this.game.asteroids;
    for (var i = 0; i < asteroids.length; i ++) {
      if (this.isNearAsteroid(asteroids[i]) && !this.lockedOn) {
        // this.lockedOn = true;
        this.redirect(asteroids[i].pos);
      }
    }
  };

  Drone.prototype.redirect = function (pos) {
    var diff = [pos[0] - this.pos[0], pos[1] - this.pos[1]];
    this.direction = Math.atan2(diff[1], diff[0]);
    this.vel[0] += Math.cos(this.direction);
    this.vel[1] += Math.sin(this.direction);
  };


})();
