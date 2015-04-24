(function() {
  if (window.Asteroids === undefined) {
    window.Asteroids = {};
  }

  var Drone = Asteroids.Drone = function(args) {
    Asteroids.MovingObject.call(this, args);
    this.rad = Drone.SIZE;
    this.col = Drone.COLOR;
    this.lockedOn = false;
    this.img = new Image();
    this.img.src = 'imgs/drone.png';
  }

  Asteroids.Util.inherits(Drone, Asteroids.MovingObject);

  Drone.SIZE = 10;
  Drone.COLOR = "#aaa";

  Drone.prototype.isNearAsteroid = function () {

  };

  Drone.prototype.redirect = function () {

  };


})();
