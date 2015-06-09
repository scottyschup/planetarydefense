(function() {
  if (window.SPD === undefined) {
    window.SPD = {};
  }

  var Ship = SPD.Ship = function(args) {
    SPD.MovingObject.call(this, args);
    this.pos = [SPD.Game.DIM_X / 2, SPD.Game.DIM_Y - 100];
    this.vel = [0, 0];
    this.rad = Ship.SIZE;
    this.direction = -Math.PI/2;
    this.img = new Image();
    this.img.src = Ship.IMG;
    this.collides = false;
    this.shielded = true;
    this.powerLevel = 100;
    this.droneSupply = 25;
    setTimeout(function () {
      this.collides = true;
      this.shielded = false;
    }.bind(this), 3000);
  };

  SPD.Util.inherits(Ship, SPD.MovingObject);

  Ship.IMG = "imgs/puddlejumper/base.png";
  Ship.IMG_ACCEL = "imgs/puddlejumper/accel.png";
  Ship.IMG_DECEL = "imgs/puddlejumper/decel.png";
  Ship.IMG_LEFT = "imgs/puddlejumper/left.png";
  Ship.IMG_RIGHT = "imgs/puddlejumper/right.png";
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
    if (this.droneSupply > 0) {
      var drone = new SPD.Drone({
        game: this.game,
        pos: [this.pos[0], this.pos[1]],
        vel: [
          (Math.cos(this.direction) * 8) + this.vel[0],
          (Math.sin(this.direction) * 8) + this.vel[1]
        ],
        direction: this.direction
      });

      this.droneSupply -= 1;
      this.game.drones.push(drone);
      this.game.updateDrones();
    }
  };

  Ship.prototype.left = function () {
    this.img.src = Ship.IMG_LEFT;
    this.rotate(-1);
  };

  Ship.prototype.propel = function (impulse) {
    this.vel[0] += Math.cos(this.direction) * impulse * 0.5;
    this.vel[1] += Math.sin(this.direction) * impulse * 0.5;
  };

  Ship.prototype.relocate = function() {
    this.pos = this.game.randomPosition();
    this.vel = [0, 0];
  };

  Ship.prototype.remove = function () {
    this.active = false;
  };

  Ship.prototype.resetImg = function () {
    this.img.src = Ship.IMG;
  };

  Ship.prototype.right = function () {
    this.img.src = Ship.IMG_RIGHT;
    this.rotate(1);
  };

  Ship.prototype.shield = function () {
    if (this.powerLevel > 0) {
      this.shielded = true;
      this.collides = false;
      this.powerLevel -= 0.25;
      this.game.updateShield();
      if (this.powerLevel < 10) {
        $("#shield").css("color", "red");
      } else if (this.powerLevel < 30) {
        $("#shield").css("color", "yellow");
      } else {
        $("#shield").css("color", "seagreen");
      }
    } else {
      $("#shield").css("color", "red");
      this.shielded = false;
      this.collides = true;
    }
  };

  Ship.prototype.up = function () {
    this.img.src = Ship.IMG_ACCEL;
    this.propel(1);
  };
})();
