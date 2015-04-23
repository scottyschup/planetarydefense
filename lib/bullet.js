(function() {
  if (window.Asteroids === undefined) {
    window.Asteroids = {};
  }

  var Bullet = Asteroids.Bullet = function() {}

  Asteroids.Util.inherits(Bullet, Asteroids.MovingObject);
})();
