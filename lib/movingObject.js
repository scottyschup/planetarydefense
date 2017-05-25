(function() {
  if (window.SPD === undefined) {
    window.SPD = {};
  }

  var MovingObject = SPD.MovingObject = function (args) {
    this.pos = args.pos;
    this.vel = args.vel;
    this.game = args.game;
    this.alpha = 1;
    this.collides = true;
    this.active = true;
  };

  MovingObject.EXPLODE_IMG = "imgs/explosion.png";

  MovingObject.prototype.bumpsInto = function (other) {
    // Adapted from "2-Dimensional Elastic Collisions without Trigonometry" (Berchek 2009)
    // http://www.vobarian.com/collisions/2dcollisions2.pdf
    var
      mass1 = this.mass,
      mass2 = other.mass,
      pos1 = this.pos,
      pos2 = other.pos,
      vel1 = this.vel,
      vel2 = other.vel,
      normalVec = this.diffVectors(pos1, pos2),
      magnitudeNormalVec = this.vectorMagnitude(normalVec),
      unitNormalVec = this.scaleVector(normalVec, 1 / magnitudeNormalVec),
      unitTargetVec = this.tangentVector(unitNormalVec),
      unVel1 = this.dotProduct(unitNormalVec, vel1),
      unVel2 = this.dotProduct(unitNormalVec, vel2),
      utVel1 = this.dotProduct(unitTargetVec, vel1),
      utVel2 = this.dotProduct(unitTargetVec, vel2),
      newUNVels = this.newUNVels(unVel1, unVel2, mass1, mass2),
      newUNVecs = this.newUNVecs(newUNVels, [utVel1, utVel2], unitNormalVec, unitTargetVec);

    this.vel = this.addVectors(newUNVecs[0], newUNVecs[1]);
    other.vel = this.addVectors(newUNVecs[2], newUNVecs[3]);
  };

  MovingObject.prototype.addVectors = function (v1, v2) {
    return [v1[0] + v2[0], v1[1] + v2[1]];
  };

  MovingObject.prototype.diffVectors = function (v1, v2) {
    return [v2[0] - v1[0], v2[1] - v1[1]];
  };

  MovingObject.prototype.dotProduct = function (v1, v2) {
    return v1[0] * v2[0] + v1[1] * v2[1];
  };

  MovingObject.prototype.explode = function () {
    this.img.src = MovingObject.EXPLODE_IMG;
    this.rad *= 2.5;
    this.collides = false;
    this.active = false;
    var slowFade = setInterval(function () {
      this.vel[0] *= 0.9;
      this.vel[1] *= 0.9;
      this.alpha *= 0.95;
    }.bind(this), 25);
    var msecs = this.game.isOver() ? 300 : 3000;
    setTimeout(function () {
      this.remove();
    }.bind(this), msecs);
  };

  MovingObject.prototype.isCollidedWith = function (other) {
    if (this.collides && other.collides) {
      var diff = this.diffVectors(this.pos, other.pos);
      var magnitude = this.vectorMagnitude(diff);

      if (magnitude < this.rad + other.rad) {
        return true;
      }
      return false;
    }
  };

  MovingObject.prototype.isShip = function () {
    return this instanceof SPD.Ship;
  };

  MovingObject.prototype.move = function () {
    this.pos[0] += this.vel[0];
    this.pos[1] += this.vel[1];
    this.game.wrapCheck(this);
  };

  MovingObject.prototype.newUNVels = function (unv1, unv2, m1, m2) {
    var new1 = (unv1 * (m1 - m2) + 2 * m2 * unv2) / (m1 + m2);
    var new2 = (unv2 * (m2 - m1) + 2 * m1 * unv1) / (m1 + m2);
    return [new1, new2];
  };

  MovingObject.prototype.newUNVecs = function (unVels, utVels, unitNormalVec, unitTargetVec) {
    var newUNVec1 = this.scaleVector(unitNormalVec, unVels[0]);
    var newUNVec2 = this.scaleVector(unitNormalVec, unVels[1]);
    var newUTVec1 = this.scaleVector(unitTargetVec, utVels[0]);
    var newUTVec2 = this.scaleVector(unitTargetVec, utVels[1]);
    return [newUNVec1, newUTVec1, newUNVec2, newUTVec2];
  };

  MovingObject.prototype.rotate = function (num) {
    var step = Math.PI / 12 * num;
    this.direction = (this.direction + step) % (Math.PI * 2);
  };

  MovingObject.prototype.scaleVector = function (vector, scalar) {
    return [vector[0] * scalar, vector[1] * scalar];
  };

  MovingObject.prototype.tangentVector = function (vector) {
    return [-vector[1], vector[0]];
  };

  MovingObject.prototype.vectorMagnitude = function (vector) {
    return Math.sqrt(Math.pow(vector[0], 2) + Math.pow(vector[1], 2));
  };
})();
