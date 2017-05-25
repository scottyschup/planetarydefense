(function () {
  if (window.SPD === undefined) {
    window.SPD = {};
  }

  var Asteroid = SPD.Asteroid;
  var Game = SPD.Game = function(args) {
    args = args || {};
    this.asteroids = [];
    this.asteroidCount = 0;
    this.ship = new SPD.Ship({game: this});
    this.drones = [];
    this.deathtoll = 0;
    this.difficulty = parseFloat(args.difficulty) || 5;
    this.intervalMsecs = 5000 / this.difficulty;
    this.gameLength = parseFloat(args.stamina) || 30;
    this.initializeScoreBoard();
  };

  Game.DIM_X = 700;
  Game.DIM_Y = 500;

  Game.prototype.asteroidCheck = function () {
    if (this.asteroids.length < this.difficulty &&
        this.asteroidCount < this.gameLength) {
      this.addAsteroid();
    }
  };

  Game.prototype.asteroidsLeft = function () {
    return this.gameLength - this.asteroidsCount + this.asteroids.length;
  };

  Game.prototype.addAsteroid = function () {
    this.asteroids.push(new SPD.Asteroid({
        game: this,
        pos: Game.prototype.randomTopPosition(),
        vel: Asteroid.prototype.randomDownwardVec(this.difficulty / 5 + 1)
      })
    );
    this.asteroidCount += 1;
    this.updateAsteroids();
  };

  Game.prototype.addPowerUp = function () {
    if (!this.powerUp) {
      if (this.ship.droneSupply / 25 < this.ship.powerLevel / 100) {
        this.powerUp = new SPD.Stargate({
          game: this,
          pos: Game.prototype.randomSidePosition()
        });
      } else {
        this.powerUp = new SPD.ZPM({
          game: this,
          pos: Game.prototype.randomSidePosition()
        });
      }
    }
  };

  Game.prototype.allObjects = function() {
    var allObjs = [];
    allObjs = allObjs.concat(this.asteroids);
    allObjs = allObjs.concat(this.drones);
    if (this.ship) {
      allObjs.push(this.ship);
    }
    if (this.powerUp) {
      allObjs.push(this.powerUp);
    }
    return allObjs;
  };

  Game.prototype.checkCollisions = function() {
    var shipAndDrones = [],
        asteroids = [];
    shipAndDrones = shipAndDrones.concat(this.drones);
    if (this.ship.active) {
      shipAndDrones.push(this.ship);
    }
    asteroids = this.asteroids.slice(0);

    for (var i = 0; i < asteroids.length; i++) {
      if (asteroids[i].pos[1] > Game.DIM_Y * 0.6) {
        this.asteroids[i].enterAtmosphere();
      } else if (this.asteroids[i].dangerZone) {
        this.asteroids[i].exitAtmosphere();
      }

      for (var j = i + 1; j < asteroids.length; j ++) {
        if (asteroids[i].isCollidedWith(asteroids[j])) {
          asteroids[i].bumpsInto(asteroids[j]);
        }
      }

      for (j = 0; j < shipAndDrones.length; j ++) {
        if (asteroids[i].isCollidedWith(shipAndDrones[j])) {
          if (shipAndDrones[j].isShip()) {
            if (shipAndDrones[j].shielded) {
              shipAndDrones[j].bumpsInto(asteroids[i]);
            } else {
              shipAndDrones[j].active = false;
              shipAndDrones[j].explode();
            }
          } else {
            shipAndDrones[j].remove();
            this.asteroids[i].explode();
          }
        }
      }
    }

    if (this.powerUp && this.powerUp.isCapturedBy(this.ship)) {
      this.powerUp.captured(this.ship);
      this.powerUp = null;
    }
  };

  Game.prototype.draw = function(ctx) {
    ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
    var objs = this.allObjects();
    for (var i = 0; i < objs.length; i++) {
      objs[i].draw(ctx);
    }
  };

  Game.prototype.initializeScoreBoard = function () {
    this.updateAsteroids();
    this.updateDeathtoll();
    this.updateDrones();
    this.updateShield();
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

  Game.prototype.isOver = function () {
    return !this.ship.active ||
      this.asteroidCount === this.gameLength && this.asteroids.length === 0;
  };

  Game.prototype.moveObjects = function() {
    var objs = this.allObjects();
    for (var i = 0; i < objs.length; i++) {
      objs[i].move();
    }
  };

  Game.prototype.randomPosition = function () {
    return [Math.random() * Game.DIM_X, Math.random() * Game.DIM_Y];
  };

  Game.prototype.randomSidePosition = function () {
    var x = 0;
    if (Math.random() > 0.5) {
      x = Game.DIM_X;
    }
    return [x, Math.random() * Game.DIM_Y * 0.6];
  };

  Game.prototype.randomTopPosition = function () {
    return [Math.random() * Game.DIM_X, 0];
  };

  Game.prototype.startAsteroidsInterval = function () {
    this.asteroidInterval = setInterval(function () {
      this.asteroidCheck();
    }.bind(this), this.intervalMsecs);
  };

  Game.prototype.startIntervals = function () {
    this.startAsteroidsInterval();

    this.powerUpInterval = setInterval(function () {
      this.addPowerUp();
    }.bind(this), this.intervalMsecs * 15);
  };

  Game.prototype.step = function(ctx) {
    this.moveObjects();
    this.draw(ctx);
    this.checkCollisions();
  };

  Game.prototype.updateAsteroids = function () {
    var asteroidsComing = this.gameLength - this.asteroidCount;
    $("#asteroid").html(asteroidsComing);
  };

  Game.prototype.updateDeathtoll = function () {
    $("#deathtoll").html(this.deathtoll.toLocaleString());
  };

  Game.prototype.updateDrones = function () {
    var droneImg = "<img src=" + SPD.Drone.IMG + ">";
    $("#drone").html("");
    for (var i = 0; i < this.ship.droneSupply; i ++) {
      $("#drone").append(droneImg);
    }
  };

  Game.prototype.updateShield = function () {
    $("#shield").html(String(this.ship.powerLevel).split(".")[0] + "%");
  };

  Game.prototype.wrapCheck = function (object) {
    if (this.isOffscreen(object.pos)) {
      if (object instanceof SPD.Drone) {
        object.remove();
      } else {
        if (object instanceof SPD.Asteroid && object.pos[1] > Game.DIM_Y) {
          object.pos = [object.pos[0], Game.DIM_Y - 1];
          object.vel = [0, 0];
          object.strikeEarth();
        }
        this.wrap(object);
      }
    }
  };

  Game.prototype.wrap = function (object) {
    var yBounce = 1;
    if (object instanceof SPD.Ship) {
      yBounce = 0.1;
    }

    object.pos[0] = (object.pos[0] + Game.DIM_X) % Game.DIM_X;

    if (object.pos[1] > Game.DIM_Y) {
      object.pos[1] = Game.DIM_Y;
      yBounce *= -1;
    } else if (object.pos[1] < 0) {
      object.pos[1] = 0;
      yBounce *= -1;
    }

    object.vel[1] *= yBounce;
  };
})();
