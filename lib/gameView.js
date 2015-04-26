(function() {
  if (window.Asteroids === undefined) {
    window.Asteroids = {};
  }

  var GameView = Asteroids.GameView = function(game, ctx) {
    this.game = game;
    this.ctx = ctx;
  };

  GameView.prototype.start = function () {
    var game = this.game;
    var ctx = this.ctx;

    setInterval(function() {
      game.step(ctx);
    }, 1000 / 25);


  var keysdown = {
    37: false,
    38: false,
    39: false,
    40: false,
    32: false,
    16: false
  };

  var actions = {
    37: { fn: game.ship.left, msecs: 40 },
    39: { fn: game.ship.right, msecs: 40 },
    38: { fn: game.ship.up, msecs: 40 },
    40: { fn: game.ship.down, msecs: 40 },
    32: { fn: game.ship.fireDrone, msecs: 200 },
    16: { fn: game.ship.shield, msecs: 40 }
  };

  var intervals = {};

  $(document.body).keydown(function (ev) {
    if (game.ship.active) {
      var keyCode = ev.which;

      if (!keysdown[keyCode]) {
        keysdown[keyCode] = true;
        actions[keyCode].fn.call(game.ship);
        intervals[keyCode] = setInterval(function () {
          if (game.ship.active) {
            actions[keyCode].fn.call(game.ship);
          }
        }, actions[keyCode].msecs);
      }
    }
  });

  $(document.body).keyup(function (ev) {
    var keyCode = ev.which;
    keysdown[keyCode] = false;

    if (keyCode === 16) {
      game.ship.shielded = false;
      game.ship.collides = true;
    }

    if (game.ship.active) {
      game.ship.resetImg();
    }
    window.clearInterval(intervals[keyCode]);
  });
};
})();
