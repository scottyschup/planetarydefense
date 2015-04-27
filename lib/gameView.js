(function() {
  if (window.Asteroids === undefined) {
    window.Asteroids = {};
  }

  var GameView = Asteroids.GameView = function(game, ctx) {
    this.game = game;
    this.ctx = ctx;
  };

  GameView.prototype.defeat = function () {
    $(".end-message").html(
      "You gave it your all, but your all was not enough."<br>
      game.deathtoll + " lives were lost. The rest will be enslaved by the Goa'uld."
    );
  };

  GameView.prototype.gameOver = function () {
    $(".game-board").css("opacity", "0.3");
    if (this.ship.active) {
      this.victory();
    } else {
      game.calculateFinalDeathtoll();
      setTimeout(function () {
        this.defeat();
      }.bind(this), 1);
    }
    this.leaderBoard();
  };

  GameView.prototype.leaderBoard = function () {

  };

  GameView.prototype.run = function () {
    var game = this.game;
    var ctx = this.ctx;
    var keyHandler = new Asteroids.KeyMonkey(game);
    game.startIntervals();

    var loop = setInterval(function() {
      if (game.isOver()) {
        window.clearInterval(loop);
        this.gameOver();
        while (true) {
          for (var i = 0; i < 10; i ++) {
            game.step(ctx);
          }
        }
      } else {
        game.step(ctx);
      }
    }.bind(this), 1000 / 25);
  };

  GameView.prototype.start = function () {
    $('header').css("top", "0")
    var that = this;
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
    $(".end-message").html(
      "Congratulations! You survived the onslaught!"<br>
      game.deathtoll + " lives were lost in the attack, but billions were saved." <br>
      "Well done."
    );
  };
})();
