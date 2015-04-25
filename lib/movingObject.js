(function() {
  if (window.Asteroids === undefined) {
    window.Asteroids = {};
  }

  var MovingObject = Asteroids.MovingObject = function(args) {
    this.pos = args['pos'];
    this.vel = args['vel'];
    this.rad = args['rad'];
    this.alpha = 1;
    this.game = args['game'];
    this.collides = true;
  };

  MovingObject.EXPLODE_IMG = "imgs/explosion.png";

  MovingObject.prototype.explode = function () {
    this.img.src = MovingObject.EXPLODE_IMG;
    this.collides = false;
    var slowFade = setInterval(function () {
      this.vel[0] *= 0.9;
      this.vel[1] *= 0.9;
      this.alpha *= 0.9;
    }.bind(this), 60);
    setTimeout(function () {
      this.remove();
    }.bind(this), 1000);
  };

  MovingObject.prototype.isCollidedWith = function (other) {
    if (this.collides && other.collides) {
      var distance = Math.sqrt(
        Math.pow(this.pos[0] - other.pos[0], 2) +
        Math.pow(this.pos[1] - other.pos[1], 2)
      );
      if (distance < this.rad + other.rad) {
        return true;
      }
      return false;
    }
  };

  MovingObject.prototype.isShip = function () {
    return this instanceof Asteroids.Ship;
  };

  MovingObject.prototype.move = function () {
    this.pos[0] += this.vel[0];
    this.pos[1] += this.vel[1];
    this.game.wrapCheck(this);
  };
})();
