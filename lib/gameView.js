(function() {
  if (window.Asteroids === undefined) {
    window.Asteroids = {};
  }

  var GameView = Asteroids.GameView = function(ctx) {
    this.game = new Asteroids.Game();
    this.ctx = ctx;
    this.firstGame = true;
  };

  GameView.prototype.clearGameBoard = function () {
    this.closeNewGameOptions();
    if (this.firstGame) {
      this.closeInstructions();
    } else {
      this.closeEndGame();
    }
  };

  GameView.prototype.closeIntro = function (callback) {
    $('.intro, footer, .body').css("opacity", "0");
    setTimeout(function () {
      $('.intro, footer').css("display", "none");
      $('.game-board').css({
        "transform": "translate(0, 800px)",
        "-webkit-transform": "translate(0, 800px)"
      });
      setTimeout(function () {
        callback();
      }.bind(this), 1500);
    }.bind(this), 1000);
  };

  GameView.prototype.closeEndGame = function () {
    $('.end-game').css({
      "transform": "translate(0, -520px)",
      "-webkit-transform": "translate(0, -520px)"
    });
  };

  GameView.prototype.closeInstructions = function () {
    $(".instructions").css({
      "transform": "translate(0, -170px)",
      "-webkit-transform": "translate(0, -170px)"
    });
    $(".instructions > div:not(.img-tabs)").css("display", "none");
  };

  GameView.prototype.closeNewGameOptions = function () {
    $('.new-game').css({
      "transform": "translate(0, 260px)",
      "-webkit-transform": "translate(0, 260px)"
    });
    setTimeout(function () {
      $('.game-board').css("opacity", "1");
    }, 1000);
  };

  GameView.prototype.defeat = function () {
    this.openEndGame();
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
    this.firstGame = false;

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

  GameView.prototype.highlightAndRevealOn = function (ev) {
    var klass = $(ev.currentTarget).attr("class").slice(0, -4);
    $("." + klass).css("opacity", "1");
    $(".scores > div:has(#" + klass + ")").css({
      "background-color": "rgba(155, 90, 90, 0.75)",
      "box-shadow": "0 0 20px rgba(175, 105, 105, 1)"
    });
  };

  GameView.prototype.highlightAndRevealOff = function (ev) {
    var klass = $(ev.currentTarget).attr("class").slice(0, -4);
    $("." + klass).css("opacity", "0");
    $("div:has(#" + klass + ")").css({
      "background-color": "inherit",
      "box-shadow": "none"
    });
  };

  GameView.prototype.intro = function () {
    $('.body').css({
      "transform": "translate(0, 500px)",
      "-webkit-transform": "translate(0, 500px)"
    });
    setTimeout(function () {
      $('header').css({
        "transform": "translate(0, -1000px)",
        "-webkit-transform": "translate(0, -1000px)"
      });
      setTimeout(function () {
        $("footer").css("opacity", "1");
        $.each($(".intro > p"), function (idx, el) {
          setTimeout(function () {
            $(el).css("opacity", "1");
          }, 3000 * idx);
        });
      }, 3000);
    }, 1000);

    setTimeout(function () {
      $(".start-options").css("opacity", "1");
    }, 13000);

    $(".start").one("click", function () {
      this.closeIntro(this.openNewGameOptions.bind(this));
    }.bind(this));

    $(".skip-intro").one("click", function () {
      this.closeIntro(this.openNewGameOptions.bind(this));
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
    setTimeout(function () {
      this.run();
    }.bind(this), 500);
  };

  GameView.prototype.newGameOptions = function () {
    // $(".game-board").css("opacity", "0.2");
    $(".options > button").removeClass("selected");
    $("button[value=" + this.game.difficulty + "]").addClass("selected");
    $("button[value=" + this.game.gameLength + "]").addClass("selected");
    $(".options > button").on("click", function (ev) {
      var $button = $(ev.currentTarget);
      $button.siblings().removeClass("selected");
      $button.addClass("selected");
    });

    $(".start-new-game").one("click", function () {
      this.clearGameBoard();
      this.newGame();
    }.bind(this));
  };

  GameView.prototype.openEndGame = function () {
    $(".end-game").css({
      "transform": "translate(0, 300px)",
      "-webkit-transform": "translate(0, 300px)"
    });
    this.toggleCursor();
    this.openNewGameOptions();
  };

  GameView.prototype.openInstructions = function () {
    $(".instructions").css({
      "transform": "translate(0, 170px)",
      "-webkit-transform": "translate(0, 170px)"
    });
    $(".instructions > div:not(.img-tabs)").css("display", "block");
    $(".img-tabs > img").on("mouseover", function (ev) {
      this.highlightAndRevealOn(ev);
    }.bind(this));

    $(".img-tabs > img").on("mouseout", function (ev) {
      this.highlightAndRevealOff(ev);
    }.bind(this));
  };

  GameView.prototype.openNewGameOptions = function () {
    $(".new-game").css({
      "transform": "translate(0, -260px)",
      "-webkit-transform": "translate(0, -260px)"
    });
    if (this.firstGame) {
      this.openInstructions();
    }
    this.newGameOptions();
  };

  GameView.prototype.resetIntervals = function () {
    window.clearInterval(this.gameLoop);
    window.clearInterval(this.game.asteroidInterval);
    window.clearInterval(this.game.powerUpInterval);
    this.game.startAsteroidsInterval();
  };

  GameView.prototype.run = function () {
    this.toggleCursor();
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

  GameView.prototype.toggleCursor = function () {
    if ($("body").css("cursor") === "none") {
      $("body").css("cursor", "auto");
    } else {
      $("body").css("cursor", "none");
    }
  };

  GameView.prototype.victory = function () {
    this.openEndGame();
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
