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
    this.deathtoll = 0;
    this.powerLevel = 100;
    this.droneSupply = 25;
  };

  Game.DIM_X = 700;
  Game.DIM_Y = 500;
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
      if (asteroids[i].pos[1] > 300) {
        this.asteroids[i].enterAtmosphere();
      }
      for (var j = 0; j < shipAndDrones.length; j++) {
        if (asteroids[i].isCollidedWith(shipAndDrones[j])) {
          if (shipAndDrones[j].isShip()) {
            shipAndDrones[j].explode();
          } else {
            shipAndDrones[j].remove();
            this.asteroids[i].explode();
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

  Game.prototype.randomPosition = function () {
    return [Math.random() * Game.DIM_X, Math.random() * Game.DIM_Y];
  };

  Game.prototype.randomTopPosition = function () {
    return [Math.random() * Game.DIM_X, 0];
  };

  Game.prototype.removeShip = function () {
    this.ship = new Asteroids.Ship({ game: this });
  };

  Game.prototype.step = function(ctx) {
    this.moveObjects();
    this.draw(ctx);
    this.checkCollisions();
    this.updateScores();
  };

  Game.prototype.updateScores = function () {
    $('#deathtoll').html(this.deathtoll);
    $('#drones').html(this.droneSupply);
    $('#shield').html(this.powerLevel);
  };

  Game.prototype.wrapCheck = function (object) {
    if (this.isOffscreen(object.pos)) {
      if (object instanceof Asteroids.Drone) {
        object.remove();
      } else {
        if (object instanceof Asteroids.Asteroid && object.pos[1] > Game.DIM_Y) {
          object.pos = [object.pos[0], Game.DIM_Y - 1];
          object.vel = [0, 0];
          object.strikeEarth();
        }
        this.wrap(object.pos);
      }
    }
  };

  Game.prototype.wrap = function (pos) {
    pos[0] = (pos[0] + Game.DIM_X) % Game.DIM_X;
    pos[1] = (pos[1] + Game.DIM_Y) % Game.DIM_Y;
  };
})();
