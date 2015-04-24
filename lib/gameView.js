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
    }, 20);

    window.key('left', function(){
      game.ship.rotate(-1);
    });

    window.key('up', function(){
      game.ship.propel(1);
    });

    window.key('down', function(){
      game.ship.propel(-1);
    });

    window.key('right', function(){
      game.ship.rotate(1);
    });

    window.key('space', function(){
      game.ship.fireDrone();
      console.log(game.allObjects());
    });

  };

})();
