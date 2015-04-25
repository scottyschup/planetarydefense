(function() {
  if (window.Asteroids === undefined) {
    window.Asteroids = {};
  }

  var Asteroid = Asteroids.Asteroid;

  var Game = Asteroids.Game = function() {
    this.asteroids = [];
    setInterval(function () {
      this.asteroidCheck();
    }.bind(this), 1000);
    this.ship = new Asteroids.Ship({game: this});
    this.drones = [];
  };

  Game.DIM_X = 800;
  Game.DIM_Y = 600;
  Game.NUM_ASTEROIDS = 5;

  Game.prototype.asteroidCheck = function () {
    if (this.asteroids.length < 5) {
      this.addAsteroid();
    }
  };

  Game.prototype.addAsteroid = function () {
    this.asteroids.push(new Asteroid({
        game: this,
        pos: Game.prototype.randomTopPosition(),
        vel: Asteroid.prototype.randomDownwardVec(1)
      })
    );
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
    var shipAndDrones = [], asteroids = [];
    shipAndDrones = shipAndDrones.concat(this.drones);
    shipAndDrones.push(this.ship);
    asteroids = this.asteroids.slice(0);

    for (var i = 0; i < asteroids.length; i++) {
      for (var j = 0; j < shipAndDrones.length; j++) {
        if (asteroids[i].isCollidedWith(shipAndDrones[j])) {
          if (shipAndDrones[j].isShip()) {
            this.remove(shipAndDrones[j]);
          } else {
            this.remove(shipAndDrones[j]);
            this.remove(this.asteroids[i]);
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

  Game.prototype.isOffscreen = function (pos) {
    if (
      pos[0] > Game.DIM_X ||
      pos[0] < 0 ||
      pos[1] > Game.DIM_Y ||
      pos[1] < 0
    ) {
      return true;
    }
    return false;
  };

  Game.prototype.randomPosition = function() {
    return [Math.random() * Game.DIM_X, Math.random() * Game.DIM_Y];
  };

  Game.prototype.randomTopPosition = function() {
    return [Math.random() * Game.DIM_X, 0];
  };

  Game.prototype.remove = function(object) {
    var idx;
    if (object instanceof Asteroids.Asteroid) {
      idx = this.asteroids.indexOf(object);
      this.asteroids.splice(idx, 1);
    } else if (object instanceof Asteroids.Drone) {
      idx = this.drones.indexOf(object);
      this.drones.splice(idx, 1);
    } else if (object === this.ship) {
      this.ship = new Asteroids.Ship({ game: this });
    }
  };

  Game.prototype.step = function(ctx) {
    this.moveObjects();
    this.draw(ctx);
    this.checkCollisions();
  };

  Game.prototype.wrapCheck = function (object) {
    if (this.isOffscreen(object.pos)) {
      if (object instanceof Asteroids.Drone) {
        this.remove(object);
      } else {
        this.wrap(object.pos);
      }
    }
  };

  Game.prototype.wrap = function (pos) {
    // debugger
    pos[0] = (pos[0] + Game.DIM_X) % Game.DIM_X;
    pos[1] = (pos[1] + Game.DIM_Y) % Game.DIM_Y;
  };
})();
