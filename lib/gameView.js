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
      game.deathtoll + " lives were lost.<br>The rest will be enslaved by the Goa'uld."
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

  GameView.prototype.gameOver = function (gameLoop) {
    if (game.ship.active) {
      this.victory();
    } else {
      this.resetIntervals(gameLoop);
      this.finishInBackground();
    }
  };

  GameView.prototype.newGameOpts = function () {
    $(".new-game-options").css("opacity", "1");
  };

  GameView.prototype.resetIntervals = function (gameLoop) {
    window.clearInterval(gameLoop);
    window.clearInterval(game.asteroidInterval);
    window.clearInterval(game.powerUpInterval);
    game.startIntervals();
  };

  GameView.prototype.run = function () {
    var game = this.game;
    var ctx = this.ctx;
    var keyHandler = new Asteroids.KeyMonkey(game);
    game.startIntervals();

    var loop = setInterval(function() {
      if (game.isOver()) {
        this.gameOver(loop);
      } else {
        game.step(ctx);
      }
    }.bind(this), 1000 / 25);
  };

  GameView.prototype.start = function () {
    var that = this;
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

    $(".start").click(function () {
      $('.intro').css("opacity", "0");
      setTimeout(function () {
        $('.intro').css("display", "none");
        $('.game-board').css("top", "10px");
        setTimeout(function () {
          that.run();
        }, 1000);
      }, 1000);
    });
  };

  GameView.prototype.victory = function () {
    this.dimCanvas();
    $(".end-message-title").html("You survived the onslaught");
    var message;
    if (game.deathtoll === 0) {
      message = "And you stopped every asteroid. Well done!"
    } else {
      message = game.deathtoll + " lives were lost in the attack, \
      but billions were saved.<br>Well done."
    }
    $(".end-message").html(message)

    this.newGameOpts();
  };
})();
