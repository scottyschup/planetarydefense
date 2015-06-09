(function() {
  if (window.SPD === undefined) {
    window.SPD = {};
  }

  var ZPM = SPD.ZPM = function(args) {
    SPD.PowerUp.call(this, args);
    this.rad = 10;
    this.direction = -Math.PI/2;
    this.img = new Image();
    this.img.src = ZPM.IMG;

  };

  SPD.Util.inherits(ZPM, SPD.PowerUp);

  ZPM.IMG = "imgs/powerups/zpm.png";

  ZPM.prototype.captured = function (ship) {
    ship.powerLevel = 100;
    $("#shield").css("color", "seagreen");
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
