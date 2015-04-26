(function() {
  if (window.Asteroids === undefined) {
    window.Asteroids = {};
  }

  var Ship = Asteroids.Ship = function(args) {
    Asteroids.MovingObject.call(this, args);
    this.pos = [Asteroids.Game.DIM_X / 2, Asteroids.Game.DIM_Y - 100];
    this.vel = [0, 0];
    this.rad = Ship.SIZE;
    this.direction = -Math.PI/2;
    this.img = new Image();
    this.img.src = Ship.IMG;
    this.collides = false;
    this.shielded = true;
    setTimeout(function () {
      this.collides = true;
      this.shielded = false;
    }.bind(this), 3000);
  };

  Asteroids.Util.inherits(Ship, Asteroids.MovingObject);

  Ship.IMG = "imgs/puddlejumper_small.png";
  Ship.IMG_ACCEL = "imgs/puddlejumper_small_accel.png";
  Ship.IMG_DECEL = "imgs/puddlejumper_small_decel.png";
  Ship.IMG_LEFT = "imgs/puddlejumper_small_left.png";
  Ship.IMG_RIGHT = "imgs/puddlejumper_small_right.png";
  // Ship.IMG_SHIELD = "imgs/puddlejumper_small_shield.png"
  Ship.SIZE = 20;
  Ship.TO_RADIANS = Math.PI/180;

  Ship.prototype.draw = function (ctx) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.translate(this.pos[0], this.pos[1]);
    ctx.rotate(this.direction);
    ctx.drawImage(
      this.img,
      -(this.rad) * 1.25,
      -(this.rad) * 1.25,
      this.rad * 2.5,
      this.rad * 2.5
    );
    ctx.restore();
    if (this.shielded) {
      var halo = ctx.createRadialGradient(this.pos[0], this.pos[1], 30,
                                          this.pos[0], this.pos[1], 50);
      halo.addColorStop(0, 'rgba(135, 215, 215, .5)');
      halo.addColorStop(0.5, 'rgba(135, 215, 215, 0.2)');
      halo.addColorStop(1, 'rgba(135, 0, 0, 0)');
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, this.pos[0] + 50, this.pos[1] + 50);
      //this.game.DIM_X, this.game.DIM_Y
    }
  };

  Ship.prototype.down = function () {
    this.img.src = Ship.IMG_DECEL;
    this.propel(-1);
  };

  Ship.prototype.fireDrone = function () {
    if (this.game.droneSupply > 0) {
      var drone = new Asteroids.Drone({
        game: this.game,
        pos: [this.pos[0], this.pos[1]],
        vel: [
          (Math.cos(this.direction) * 10) + this.vel[0],
          (Math.sin(this.direction) * 10) + this.vel[1]
        ],
        direction: this.direction
      });

      this.game.drones.push(drone);
      this.game.droneSupply -= 1;
    }
  };

  Ship.prototype.left = function () {
    this.img.src = Ship.IMG_LEFT;
    this.rotate(-1);
  };

  Ship.prototype.propel = function (impulse) {
    this.vel[0] += Math.cos(this.direction) * impulse;
    this.vel[1] += Math.sin(this.direction) * impulse;
  };

  Ship.prototype.relocate = function() {
    this.pos = this.game.randomPosition();
    this.vel = [0, 0];
  };

  Ship.prototype.remove = function () {
    this.game.removeShip();
  };

  Ship.prototype.resetImg = function () {
    this.img.src = Ship.IMG;
  };

  Ship.prototype.right = function () {
    this.img.src = Ship.IMG_RIGHT;
    this.rotate(1);
  };

  Ship.prototype.rotate = function (num) {
    var step = Math.PI / 12 * num;
    this.direction = (this.direction + step + Math.PI * 2) % (Math.PI * 2);
  };

  Ship.prototype.shield = function () {
    this.shielded = true;
    this.collides = false;
    this.game.powerLevel -= 0.25;
  };

  Ship.prototype.up = function () {
    this.img.src = Ship.IMG_ACCEL;
    this.propel(1);
  };
})();