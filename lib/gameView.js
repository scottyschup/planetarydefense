(function() {
  if (window.Asteroids === undefined) {
    window.Asteroids = {};
  }

  var GameView = Asteroids.GameView = function(ctx) {
    this.game = new Asteroids.Game();
    this.ctx = ctx;
  };

  GameView.prototype.clearEndGame = function () {
    var that = this;
    $('.end-game').css("top", "-200%");
    setTimeout(function () {
      $('.game-board').css("opacity", "1");
      setTimeout(function () {
        this.run();
      }.bind(this), 1000);
    }.bind(this), 1000);
  };

  GameView.prototype.clearIntro = function () {
    var that = this;
    $('.intro').css("opacity", "0");
    setTimeout(function () {
      $('.intro').css("display", "none");
      $('.game-board').css("top", "10px");
      setTimeout(function () {
        that.run();
      }, 1000);
    }, 1000);
  }

  GameView.prototype.defeat = function () {
    this.dimCanvas();
    $(".end-message-title").html("Mission Failure.");
    $(".end-message").html(
      "You gave it your all, but your all was not enough.<br>" +
      this.game.deathtoll.toLocaleString() +
      " lives were lost.<br>The rest will be enslaved by the Goa'uld."
    );
  };

  GameView.prototype.dimCanvas = function () {
      $(".game-board").css("opacity", "0.3");
      $("canvas").css("opacity", "0");
      $("input[value=" + this.game.asteroidLimit + "]").prop("checked", true);
      $("input[value=" + this.game.gameLength + "]").prop("checked", true);
      $(".end-game").css("top", "100px");
  };

  GameView.prototype.endFastForward = function () {
    window.clearInterval(this.fastForward);
  };

  GameView.prototype.finishInBackground = function () {
    this.fastForward = setInterval(function () {
      for (var i = 0; i < 15; i ++) {
        this.game.moveObjects();
        this.game.checkCollisions();
      }
      this.game.step(this.ctx);
      if (this.game.asteroidCount === this.game.gameLength &&
        this.game.asteroids.length === 0) {
        setTimeout(function () {
          this.endFastForward();
          this.defeat();
        }.bind(this), 500);
      }
    }.bind(this), 1000 / 25);
  };

  GameView.prototype.gameOver = function () {
    window.clearInterval(this.endGameCheck);
    this.keyHandler.turnOff();
    if (this.game.ship.active) {
      this.victory();
    } else {
      setTimeout(function () {
        delete this.keyHandler;
        this.resetIntervals();
        this.finishInBackground();
      }.bind (this), 2000);
    }
  };

  GameView.prototype.intro = function () {
    $('header').css("top", "0");
    setTimeout(function () {
      $.each($(".intro > p"), function (idx, el) {
        setTimeout(function () {
          $(el).css("opacity", "1");
        }, 3000 * idx);
      });
    }, 3000);

    setTimeout(function () {
      $(".intro > button").css("opacity", "1");
    }, 10000);

    $(".start").one("click", function () {
      this.clearIntro();
    }.bind(this));
  };

  GameView.prototype.newGameOpts = function () {
    var stamina, difficulty;

    $.each($("input:checked"), function (idx, el) {
      if ($(el).attr("value") > 20) {
        stamina = $(el).attr("value");
      } else {
        difficulty = $(el).attr("value");
      }
    });

    this.game = new Asteroids.Game({
      difficulty: difficulty,
      stamina: stamina
    });

    this.clearEndGame();
  };

  GameView.prototype.resetIntervals = function () {
    window.clearInterval(this.gameLoop);
    window.clearInterval(this.game.asteroidInterval);
    window.clearInterval(this.game.powerUpInterval);
    this.game.startAsteroidsInterval();
  };

  GameView.prototype.run = function () {
    this.keyHandler = new Asteroids.KeyMonkey(this.game);
    this.game.startIntervals();

    this.startGameLoops();
  };

  GameView.prototype.startGameLoops = function () {
    this.gameLoop = setInterval(function () {
      this.game.step(this.ctx);
    }.bind(this), 1000 / 25);

    this.endGameCheck = setInterval(function () {
      if (this.game.isOver()) {
        this.gameOver();
      }
    }.bind(this), 1000 / 25);
  };

  GameView.prototype.victory = function () {
    this.dimCanvas();
    $(".end-message-title").html("You survived the onslaught!");
    var message;
    if (this.game.deathtoll === 0) {
      message = "And you stopped every asteroid! Well done!";
    } else {
      message = this.game.deathtoll.toLocaleString() +
        " lives were lost in the attack, but billions were saved.<br>Well done.";
    }
    $(".end-message").html(message)

    this.newGameOpts();
  };
})();
