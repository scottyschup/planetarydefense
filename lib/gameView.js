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
    }, 1000 / 60);

    var keysdown = {
      37: false,
      38: false,
      39: false,
      40: false,
      32: false,
      16: false
    };

    var actions = {
      37: { fn: game.ship.left, msecs: 50 },
      39: { fn: game.ship.right, msecs: 50 },
      38: { fn: game.ship.up, msecs: 100 },
      40: { fn: game.ship.down, msecs: 100 },
      32: { fn: game.ship.fireDrone, msecs: 200 },
      16: { fn: game.ship.shield, msecs: 200 }
    };

    var intervals = {};

    $(document.body).keydown(function (ev) {
      var keyCode = ev.which;

      if (!keysdown[keyCode]) {
        keysdown[keyCode] = true;
        actions[keyCode].fn.call(game.ship);
        intervals[keyCode] = setInterval(function () {
          actions[keyCode].fn.call(game.ship);
        }, actions[keyCode].msecs);
      }
    });

    $(document.body).keyup(function (ev) {
      var keyCode = ev.which;
      keysdown[keyCode] = false;
      game.ship.resetImg();
      window.clearInterval(intervals[keyCode]);
    });

    // window.key('left', function(){
    //   game.ship.rotate(-1);
    // });
    //
    // window.key('up', function(){
    //   game.ship.propel(1);
    // });
    //
    // window.key('down', function(){
    //   game.ship.propel(-1);
    // });
    //
    // window.key('right', function(){
    //   game.ship.rotate(1);
    // });
    //
    // window.key('space', function(){
    //   game.ship.fireDrone();
    //   console.log(game.allObjects());
    // });

  };

})();
