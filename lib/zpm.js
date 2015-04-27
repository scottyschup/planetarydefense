(function() {
  if (window.Asteroids === undefined) {
    window.Asteroids = {};
  }

  var ZPM = Asteroids.ZPM = function(args) {
    Asteroids.PowerUp.call(this, args);
    this.rad = 10;
    this.direction = -Math.PI/2;
    this.img = new Image();
    this.img.src = ZPM.IMG;

  };

  Asteroids.Util.inherits(ZPM, Asteroids.PowerUp);

  ZPM.IMG = "imgs/powerups/zpm.png";

  ZPM.prototype.captured = function (ship) {
    ship.powerLevel = 100;
    this.game.updateShield();
  };

  ZPM.prototype.draw = function (ctx) {
    ctx.save();
    ctx.translate(this.pos[0], this.pos[1]);
    ctx.rotate(this.direction);
    ctx.drawImage(
      this.img,
      -(this.rad),
      -(this.rad) * 2,
      this.rad * 2,
      this.rad * 4
    );
    ctx.restore();
    this.rotate(0.5);
  };

})();
