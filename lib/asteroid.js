(function() {
  if (window.Asteroids === undefined) {
    window.Asteroids = {};
  }

  var Asteroid = Asteroids.Asteroid = function(args) {
    this.img_num = Math.ceil(Math.random() * 3);
    Asteroids.MovingObject.call(this, args);
    this.rad = Asteroid.SIZE;
    this.img = new Image();
    this.img.src = 'imgs/asteroids/norm/' + this.img_num + '.png';
    this.dangerZone = false;
  };

  Asteroids.Util.inherits(Asteroid, Asteroids.MovingObject);

  Asteroid.SIZE = 30;

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

  Asteroid.prototype.enterAtmosphere = function () {
    if (!this.dangerZone) {
      this.img.src = 'imgs/asteroids/fire/' + this.img_num + '.png';
    }
    this.dangerZone = true;
  };

  Asteroid.prototype.strikeEarth = function () {
    this.game.deathtoll += Math.floor(Math.random() * 10000);
    this.explode();
  };

  Asteroid.prototype.randomDownwardVec = function(speed) {
    var x = (Math.random() - 0.5) * speed;
    var y = Math.sqrt(Math.pow(speed, 2) - Math.pow(x, 2));
    return [x, y];
  };

  Asteroid.prototype.remove = function () {
    var idx = this.game.asteroids.indexOf(this);
    this.game.asteroids.splice(idx, 1);
  };

})();
