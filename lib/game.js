(function() {
  if (window.Asteroids === undefined) {
    window.Asteroids = {};
  }

  var Asteroid = Asteroids.Asteroid;

  var Game = Asteroids.Game = function() {
    this.asteroids = [];
    this.addAsteroids();
    this.ship = new Asteroids.Ship({game: this});
    this.drones = [];
  };

  Game.DIM_X = 800;
  Game.DIM_Y = 600;
  Game.NUM_ASTEROIDS = 5;

  Game.prototype.addAsteroids = function () {
    for (var i = 0; i < Game.NUM_ASTEROIDS; i++) {
      this.asteroids.push(new Asteroid({
          game: this,
          pos: Game.prototype.randomTopPosition(),
          vel: Asteroid.prototype.randomDownwardVec(1)
        })
      );
    }

    return this.asteroids;
  };

  Game.prototype.allObjects = function() {
    var allObjs = [];
    allObjs = allObjs.concat(this.asteroids);
    allObjs = allObjs.concat(this.drones);
    if (this.ship !== null) {
      allObjs.push(this.ship);
    }
    return allObjs;
  };

  Game.prototype.checkCollisions = function() {
    var shipAndDrones = [];
    shipAndDrones = shipAndDrones.concat(this.drones);
    shipAndDrones.push(this.ship);

    for (var i = 0; i < this.asteroids.length; i++) {
      for (var j = 0; j < shipAndDrones.length; j++) {
        if (this.asteroids[i].isCollidedWith(shipAndDrones[j])) {
          if (shipAndDrones[j].isShip()) {
            shipAndDrones[j].relocate();
          }
        }
      }
    }
  };

  Game.prototype.draw = function(ctx) {
    ctx.clearRect (0, 0, Game.DIM_X, Game.DIM_Y);
    var objs = this.allObjects();
    for (var i = 0; i < objs.length; i++) {
      objs[i].draw(ctx);
    }
  };

  Game.prototype.moveObjects = function() {
    var objs = this.allObjects();
    for (var i = 0; i < objs.length; i++) {
      objs[i].move();
    }
  };

  Game.prototype.randomPosition = function() {
    return [Math.random() * Game.DIM_X, Math.random() * Game.DIM_Y];
  };

  Game.prototype.randomTopPosition = function() {
    return [Math.random() * Game.DIM_X, 0];
  };

  Game.prototype.remove = function(object) {
    var idx = this.asteroids.indexOf(object);
    if (idx > -1) {
      this.asteroids.splice(idx, 1);
    } else if (object === this.ship) {
      this.ship = null;
    }
  };

  Game.prototype.step = function(ctx) {
    this.moveObjects();
    this.draw(ctx);
    this.checkCollisions();
  };

  Game.prototype.wrap = function (pos) {
    if (pos[0] > Game.DIM_X) {
      pos[0] -= Game.DIM_X;
    } else if (pos[0] < 0) {
      pos[0] += Game.DIM_X;
    }

    if (pos[1] > Game.DIM_Y) {
      pos[1] -= Game.DIM_Y;
    } else if (pos[1] < 0) {
      pos[1] += Game.DIM_Y;
    }
  };
})();
