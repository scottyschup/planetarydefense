(function () {
  if (window.SPD === undefined) {
    window.SPD = {};
  }

  var Asteroid = SPD.Asteroid = function(args) {
    SPD.MovingObject.call(this, args);
    this.img_num = Math.ceil(Math.random() * 3);
    this.rad = Asteroid.SIZE;
    this.mass = 1;
    this.img = new Image();
    this.img.src = "imgs/asteroids/norm/" + this.img_num + ".png";
    this.dangerZone = false;
  };

  SPD.Util.inherits(Asteroid, SPD.MovingObject);

  Asteroid.SIZE = 30;

  Asteroid.prototype.draw = function (ctx) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.drawImage(
      this.img,
      this.pos[0] - this.rad * 1.25,
      this.pos[1] - this.rad * 1.25,
      this.rad * 2.5,
      this.rad * 2.5
    );
    ctx.restore();
  };

  Asteroid.prototype.enterAtmosphere = function () {
    if (!this.dangerZone && this.collides) {
      this.img.src = "imgs/asteroids/fire/" + this.img_num + ".png";
    }
    this.dangerZone = true;
  };

  Asteroid.prototype.exitAtmosphere = function () {
    this.img.src = "imgs/asteroids/norm/" + this.img_num + ".png";
    this.dangerZone = false;
  };

  Asteroid.prototype.strikeEarth = function () {
    this.game.deathtoll += Math.floor(Math.random() * 5000) + 20000;
    this.game.updateDeathtoll();
    this.rad *= 3;
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
