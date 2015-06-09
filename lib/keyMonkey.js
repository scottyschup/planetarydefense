(function() {
  if (window.SPD === undefined) {
    window.SPD = {};
  }

  var KeyMonkey = SPD.KeyMonkey = function(newGame) {
    var game = newGame;
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
    this.intervals = {};

    $(document.body).keydown(function (ev) {
      var keyCode = ev.which;
      if (actions[keyCode]) {
        this.preventArrowScroll(ev);
      }

      if (game.ship.active && !keysdown[keyCode] && actions[keyCode]) {
        keysdown[keyCode] = true;
        actions[keyCode].fn.call(game.ship);
        this.intervals[keyCode] = setInterval(function () {
          if (game.ship.active) {
            actions[keyCode].fn.call(game.ship);
          }
        }, actions[keyCode].msecs);
      }
    }.bind(this));

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
      window.clearInterval(this.intervals[keyCode]);
    }.bind(this));
  };

  KeyMonkey.prototype.turnOff = function () {
    $.each(this.intervals, function (key, val) {
      window.clearInterval(this.intervals[key]);
    }.bind(this));
  };

  KeyMonkey.prototype.preventArrowScroll = function (ev) {
    ev = ev || window.event;
    if (ev.preventDefault) {
      ev.preventDefault();
    }
    ev.returnValue = false;
  };
})();
