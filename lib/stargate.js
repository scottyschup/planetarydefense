(function() {
  if (window.Asteroids === undefined) {
    window.Asteroids = {};
  }

  var Stargate = Asteroids.Stargate = function(args) {
    Asteroids.PowerUp.call(this, args);
    this.rad = 20;
    this.img = new Image();
    this.img.src = Stargate.IMG;
  };

  Asteroids.Util.inherits(Stargate, Asteroids.PowerUp);

  Stargate.IMG = "imgs/powerups/stargate.png";

  Stargate.prototype.captured = function (ship) {
    ship.droneSupply = 25;
    this.game.updateDrones();
  };

  Stargate.prototype.draw = function () {
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

})();
