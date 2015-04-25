(function() {
  if (window.Asteroids === undefined) {
    window.Asteroids = {};
  }

  var Asteroid = Asteroids.Asteroid = function(args) {
    Asteroids.MovingObject.call(this, args);
    this.rad = Asteroid.SIZE;
    this.img = new Image();
    this.img.src = 'imgs/asteroid.gif';
  };

  Asteroids.Util.inherits(Asteroid, Asteroids.MovingObject);

  Asteroid.SIZE = 30;
  Asteroid.COLOR = "#aaa";

  Asteroid.prototype.draw = function (ctx) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.drawImage(
      this.img,
      this.pos[0] - (this.rad) * 1.25,
      this.pos[1] - (this.rad) * 1.25,
      this.rad * 2.5,
      this.rad * 2.5
    );
    ctx.restore();
  };

  Asteroid.prototype.randomDownwardVec = function(length) {
    var x = (Math.random() - 0.5) * length;
    var y = Math.sqrt(Math.pow(length, 2) - Math.pow(x, 2));
    return [x, y];
  };

  Asteroid.prototype.remove = function () {
    var idx = this.game.asteroids.indexOf(this);
    this.game.asteroids.splice(idx, 1);
  };

})();
