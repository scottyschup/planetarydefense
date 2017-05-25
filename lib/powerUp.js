(function () {
  if (window.SPD === undefined) {
    window.SPD = {};
  }

  var PowerUp = SPD.PowerUp = function(args) {
    SPD.MovingObject.call(this, args);
    this.collides = true;
    this.vel = this.randomInwardVec(1);
  };

  SPD.Util.inherits(PowerUp, SPD.MovingObject);

  PowerUp.prototype.isCapturedBy = function (ship) {
    var distance = Math.sqrt(
      Math.pow(this.pos[0] - ship.pos[0], 2) +
      Math.pow(this.pos[1] - ship.pos[1], 2)
    );
    if (distance < this.rad + ship.rad) {
      return true;
    }
    return false;
  };

  PowerUp.prototype.randomInwardVec = function (speed) {
    var direction = 1;
    if (this.pos[0] > 0) {
      direction = -1;
    }
    var y = (Math.random() - 0.5) * speed;
    var x = direction * Math.sqrt(Math.pow(speed, 2) - Math.pow(y, 2));

    return [x, y];
  };
})();
