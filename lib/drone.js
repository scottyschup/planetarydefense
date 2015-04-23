(function() {
  if (window.Asteroids === undefined) {
    window.Asteroids = {};
  }

  var Drone = Asteroids.Drone = function() {}

  Asteroids.Util.inherits(Drone, Asteroids.MovingObject);
})();
