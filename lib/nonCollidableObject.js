(function() {
  if (window.Asteroids === undefined) {
    window.Asteroids = {};
  }

  var NCO = Asteroids.nonCollidableObject = function (args) {
    Asteroids.MovingObject.call(this, args);

  };
})();
