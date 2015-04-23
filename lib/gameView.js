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

    window.key('a', function(){
      game.ship.rotate(-5);
    });

    window.key('s', function(){
      game.ship.power(5);
    });

    window.key('d', function(){
      game.ship.rotate(5);
    });

  };

})();
