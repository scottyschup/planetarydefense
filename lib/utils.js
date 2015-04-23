(function() {
  if (window.Asteroids === undefined) {
    window.Asteroids = {};
  }

  var Asteroids = window.Asteroids;

  if (Asteroids.Util === undefined) {
    Asteroids.Util = {};
  }

  Asteroids.Util.inherits = function(child, parent) {
    function Surrogate () {}
    Surrogate.prototype = parent.prototype;
    child.prototype = new Surrogate();
  };
})();
