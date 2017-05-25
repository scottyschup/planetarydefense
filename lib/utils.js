(function () {
  if (window.SPD === undefined) {
    window.SPD = {};
  }

  var Asteroids = window.SPD;

  if (SPD.Util === undefined) {
    SPD.Util = {};
  }

  SPD.Util.inherits = function(child, parent) {
    function Surrogate () {}
    Surrogate.prototype = parent.prototype;
    child.prototype = new Surrogate();
  };
})();
