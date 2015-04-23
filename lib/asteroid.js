(function() {
  if (window.Asteroids === undefined) {
    window.Asteroids = {};
  }

  var Asteroid = Asteroids.Asteroid = function(args) {
    Asteroids.MovingObject.call(this, args);
    this.rad = Asteroid.SIZE;
    this.col = Asteroid.COLOR;
  };

  Asteroids.Util.inherits(Asteroid, Asteroids.MovingObject);

  Asteroid.SIZE = 10;
  Asteroid.COLOR = "#00FF00";



  Asteroid.prototype.randomDownwardVec = function(length) {
    var x = (Math.random() - 0.5) * 2 * length;
    var yDirection;
    // yDirection = Math.random() - 0.5 > 0 ? 1 : -1;
    yDirection = 1;
    var y = Math.sqrt(Math.pow(length, 2) - Math.pow(x, 2)) * yDirection;
    return [x, y];
  };

  Asteroid.prototype.isCollidedWith = function (other) {
    var distance = Math.sqrt(
      Math.pow(this.pos[0] - other.pos[0], 2) +
      Math.pow(this.pos[1] - other.pos[1], 2)
    );
    if (distance < this.rad + other.rad) {
      return true;
    }
    return false;
  };

})();
