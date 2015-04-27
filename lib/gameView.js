(function() {
  if (window.Asteroids === undefined) {
    window.Asteroids = {};
  }

  var GameView = Asteroids.GameView = function(game, ctx) {
    this.game = game;
    this.ctx = ctx;
  };

  GameView.prototype.defeat = function () {
    this.dimCanvas();
    $(".end-message-title").html("Mission Failure.");
    $(".end-message").html(
      "You gave it your all, but your all was not enough.<br>" +
      game.deathtoll.toLocaleString() +
      " lives were lost.<br>The rest will be enslaved by the Goa'uld."
    );

    this.newGameOpts();
  };

  GameView.prototype.dimCanvas = function () {
      $(".game-board").css("opacity", "0.3");
      $("canvas").css("opacity", "0");
      $(".end-game").css("display", "block");
  };

  GameView.prototype.endFastForward = function () {
    window.clearInterval(this.fastForward);
  };

  GameView.prototype.finishInBackground = function () {
    var that = this;
    this.fastForward = setInterval(function () {
      for (var i = 0; i < 15; i ++) {
        game.moveObjects();
        game.checkCollisions();
      }
      game.step(ctx);
      if (game.asteroidCount === game.gameLength && game.asteroids.length === 0) {
        setTimeout(function () {
          that.endFastForward();
          that.defeat();
        }, 500);
      }
    }, 1000 / 25);
  };

  GameView.prototype.gameOver = function () {
    window.clearInterval(this.endGameCheck);
    if (game.ship.active) {
      this.victory();
    } else {
      setTimeout(function () {
        this.resetIntervals();
        this.finishInBackground();
      }.bind (this), 2000);
    }
  };

  GameView.prototype.newGameOpts = function () {
    var stamina, difficulty;
    $("input[value=" + game.asteroidLimit + "]").prop("checked", true);
    $("input[value=" + game.gameLength + "]").prop("checked", true);
    $("button").one("click", function () {
      $.each($("input:checked"), function (idx, el) {
        if ($(el).attr("value") > 20) {
          stamina = $(el).attr("value");
        } else {
          difficulty = $(el).attr("value");
        }
      });

      var newGame = new Asteroids.Game({
        difficult: difficulty,
        stamina: stamina
      });

      var newGameView = new Asteroids.GameView(newGame, this.ctx);
      newGameView.runMonkey();
    }.bind(this));
  };

  GameView.prototype.resetIntervals = function () {
    window.clearInterval(this.gameLoop);
    window.clearInterval(game.asteroidInterval);
    window.clearInterval(game.powerUpInterval);
    game.startAsteroidsInterval();
  };

  GameView.prototype.run = function () {
    var game = this.game;
    var ctx = this.ctx;
    var keyHandler = new Asteroids.KeyMonkey(game);
    game.startIntervals();

    this.startGameLoops();
  };

  GameView.prototype.runMonkey = function () {
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

  GameView.prototype.startGameLoops = function () {
    this.gameLoop = setInterval(function () {
      game.step(ctx);
    }, 1000 / 25);

    this.endGameCheck = setInterval(function () {
      if (game.isOver()) {
        this.gameOver();
      }
    }.bind(this), 1000 / 25);
  };

  GameView.prototype.start = function () {
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
      this.runMonkey();
    }.bind(this));
  };

  GameView.prototype.victory = function () {
    this.dimCanvas();
    $(".end-message-title").html("You survived the onslaught!");
    var message;
    if (game.deathtoll === 0) {
      message = "And you stopped every asteroid! Well done!";
    } else {
      message = game.deathtoll.toLocaleString() +
        " lives were lost in the attack, but billions were saved.<br>Well done.";
    }
    $(".end-message").html(message)

    this.newGameOpts();
  };
})();
