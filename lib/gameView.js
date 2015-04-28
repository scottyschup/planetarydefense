(function() {
  if (window.Asteroids === undefined) {
    window.Asteroids = {};
  }

  var GameView = Asteroids.GameView = function(ctx) {
    this.game = new Asteroids.Game();
    this.ctx = ctx;
  };

  GameView.prototype.clearGameBoard = function () {
    $('.end-game').css("top", "-200%");
    $('.new-game').css("bottom", "-100%");
    setTimeout(function () {
      $('.game-board').css("opacity", "1");
    }.bind(this), 1000);
  };

  GameView.prototype.clearIntro = function (callback) {
    $('.intro').css("opacity", "0");
    $(".body").css("opacity", "0");
    setTimeout(function () {
      $('.intro').css("display", "none");
      $('.game-board').css("top", "100px");
      setTimeout(function () {
        callback();
      }.bind(this), 1500);
    }.bind(this), 1000);
  };

  GameView.prototype.defeat = function () {
    this.transitionToEndGame();
    $(".end-message-title").html("Mission Failure.");
    $(".end-message").html(
      "You gave it your all, but your all was not enough.<br>" +
      this.game.deathtoll.toLocaleString() +
      " lives were lost.<br>The rest will be enslaved by the Goa'uld."
    );
  };

  GameView.prototype.endFastForward = function () {
    window.clearInterval(this.fastForward);
  };

  GameView.prototype.finishInBackground = function () {
    this.fastForward = setInterval(function () {
      for (var i = 0; i < 20; i ++) {
        this.game.moveObjects();
        this.game.checkCollisions();
      }
      this.game.step(this.ctx);

      if (this.game.asteroidCount === this.game.gameLength &&
        this.game.asteroids.length === 0) {
        this.endFastForward();
        setTimeout(function () {
          this.defeat();
        }.bind(this), 500);
      }
    }.bind(this), 1000 / 25);
  };

  GameView.prototype.gameOver = function () {
    window.clearInterval(this.endGameCheck);
    this.keyHandler.turnOff();
    setTimeout(function () {
      delete this.keyHandler;
    }.bind(this), 1000);

    this.game.powerUp = null;

    if (this.game.ship.active) {
      this.resetIntervals();
      this.victory();
    } else {
      this.game.intervalMsecs /= 10;
      setTimeout(function () {
        this.resetIntervals();
        this.finishInBackground();
      }.bind (this), 2000);
    }
  };

  GameView.prototype.intro = function () {
    $('body').css("top", "-1200px");
    setTimeout(function () {
      $.each($(".intro > p"), function (idx, el) {
        setTimeout(function () {
          $(el).css("opacity", "1");
        }, 3000 * idx);
      });
    }, 2500);

    setTimeout(function () {
      $(".start-options").css("opacity", "1");
    }, 10000);

    $(".start").one("click", function () {
      this.clearIntro(this.run.bind(this));
    }.bind(this));

    $(".game-options").one("click", function () {
      this.clearIntro(this.openNewGameOptions.bind(this));
    }.bind(this));
  };

  GameView.prototype.newGame = function () {
    var stamina, difficulty;

    $.each($("button.selected"), function (idx, el) {
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
    this.clearGameBoard();
    setTimeout(function () {
      this.run();
    }.bind(this), 2000);
  };

  GameView.prototype.newGameOptions = function () {
    $(".game-board").css("opacity", "0.2");
    $(".options > button").removeClass("selected");
    $("button[value=" + this.game.difficulty + "]").addClass("selected");
    $("button[value=" + this.game.gameLength + "]").addClass("selected");
    $(".options > button").on("click", function (ev) {
      var $button = $(ev.currentTarget);
      $button.siblings().removeClass("selected");
      $button.addClass("selected");
    });

    $(".start-new-game").one("click", function () {
      this.newGame();
    }.bind(this));
  };

  GameView.prototype.openNewGameOptions = function () {
      $(".new-game").css("bottom", "0");
      this.newGameOptions();
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

  GameView.prototype.transitionToEndGame = function () {
      $(".end-game").css("top", "125px");
      this.openNewGameOptions();
  };

  GameView.prototype.victory = function () {
    this.transitionToEndGame();
    $(".end-message-title").html("You survived the onslaught!");
    var message;
    if (this.game.deathtoll === 0) {
      message = "And you stopped every asteroid!<br>You're the best! Well done!";
    } else {
      message = this.game.deathtoll.toLocaleString() +
        " lives were lost in the attack, but billions were saved.<br>Well done.";
    }
    $(".end-message").html(message);
  };
})();
