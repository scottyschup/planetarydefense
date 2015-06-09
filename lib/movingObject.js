(function() {
  if (window.SPD === undefined) {
    window.SPD = {};
  }

  var MovingObject = SPD.MovingObject = function(args) {
    this.pos = args['pos'];
    this.vel = args['vel'];
    this.game = args['game'];
    this.alpha = 1;
    this.collides = true;
    this.active = true;
  };

  MovingObject.EXPLODE_IMG = "imgs/explosion.png";

  MovingObject.prototype.explode = function () {
    this.img.src = MovingObject.EXPLODE_IMG;
    this.rad *= 2.5;
    this.collides = false;
    this.active = false;
    var slowFade = setInterval(function () {
      this.vel[0] *= 0.9;
      this.vel[1] *= 0.9;
      this.alpha *= 0.95;
    }.bind(this), 25);
    var msecs = this.game.isOver() ? 300 : 3000;
    setTimeout(function () {
      this.remove();
    }.bind(this), msecs);
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
    return this instanceof SPD.Ship;
  };

  MovingObject.prototype.move = function () {
    this.pos[0] += this.vel[0];
    this.pos[1] += this.vel[1];
    this.game.wrapCheck(this);
  };

  MovingObject.prototype.rotate = function (num) {
    var step = Math.PI / 12 * num;
    this.direction = (this.direction + step + Math.PI * 2) % (Math.PI * 2);
  };
})();
