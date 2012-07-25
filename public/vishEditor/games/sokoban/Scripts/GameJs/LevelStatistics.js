function LevelStatistics(map) {
    var _map = map;
    var _pushes = 0;
    var _moves = 0;

    this.Update = function () {
        var player = _map.GetPlayer();
        _pushes = player.Pushes;
        _moves = player.Moves;
    }

    this.Draw = function (context) {
        var x = _map.OnScreenWidht + 10;
        var y = 20;


        context.fillStyle = "rgb(127,0,0)";
        context.strokeStyle = "rgb(0,0,0)";
        x += 20;
        context.strokeRect(x, y, 100, 85);
        x += 5;
        y += 20;
        context.font = "bold 12px sans-serif";
        context.fillText('Level ' + _map.Number + ' / 40', x, y);
        y += 25;
        context.fillText('Pushes : ' + _pushes, x, y);
        y += 25;
        context.fillText('Moves : ' + _moves, x, y);
    }
}