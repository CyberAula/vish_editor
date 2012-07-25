function Map(imgRepository) {

    this._map = null;
    this._goals = 0;
    this._goalsAchived = 0;
    this._width = 0;
    this._height = 0;
    this._playerX = 0;
    this._playerY = 0;
    this._devilX = 1;
    this._devilY = 1;
    this.Number = 0;
    this.Finished = false;
    this.Catched = false;
    this.OnScreenWidht = 0;
    this.OnScreenHeight = 0;
    this.ImageRepository = imgRepository;
    var _levelStatistics = new LevelStatistics(this);
    this.Loaded = false;

    this.GetPlayer = function () { 
        return this._map[this._playerX][this._playerY];
    }

    this.LoadMap = function (levelNumber) {
        this._map = null;
        this._goals = 0;
        this._goalsAchived = 0;
        this._width = 0;
        this._height = 0;
        this._playerX = 0;
        this._playerY = 0;
        this._devilX = 1;
        this._devilY = 1;
        this.Finished = false;
        this.Catched = false;
        this.Loaded = false;
        var xml = '<Level No="1" Width="19" Height="11"><Row>    #####</Row><Row>    #   #</Row><Row>    #$  #</Row><Row>  ###  $##</Row><Row>  #  $ $ #</Row><Row>### # ## #===######</Row><Row>#   # ## #####  ..#</Row><Row># $  $          ..#</Row><Row>##### ###P#@##  ..#</Row><Row>    #     #########</Row><Row>    #######</Row></Level>',
        xmlDoc = $.parseXML( xml ),
        $xml = $( xmlDoc );
        this.ParseXmlMap($xml);        
    }

    this.Update = function () {
        //check for end game conditions
        if (this._goals > 0 && this._goalsAchived == this._goals) {
            this.Finished = true;
        }
        //check is devil is in the same place
        if((this._playerX == this._devilX) && (this._playerY == this._devilY) ){
        	this.Catched = true;
        }
        	
        _levelStatistics.Update();
    }

    this.Draw = function (canvasContext) {

        var xCanvasPos = 20;
        var yCanvasPos = 20;
        var tileSize = 30;
        for (var y = 0; y < this._height; y++) {
            xCanvasPos = 20;
            for (var x = 0; x < this._width; x++) {

                var img = this._map[x][y].GetImage();
                if (img != null) {
                    // draw image
                    canvasContext.drawImage(img, xCanvasPos, yCanvasPos);

                } else {
                    // draw rectangle
                    canvasContext.fillStyle = this._map[x][y].GetFillStyle();
                    canvasContext.fillRect(xCanvasPos, yCanvasPos, tileSize, tileSize);
                }

                xCanvasPos += tileSize;
            }
            yCanvasPos += tileSize;
        }
        // this is used to properly position level statistics according to the level
        this.OnScreenWidht = xCanvasPos;
        this.OnScreenHeight = yCanvasPos;
        _levelStatistics.Draw(canvasContext);
    }

    this.ParseXmlMap = function (xml) {

        this._width = parseFloat($(xml).find('Level').attr('Width'));
        this._height = parseFloat($(xml).find('Level').attr('Height'));
        this.Number = parseFloat($(xml).find('Level').attr('No'));

        this._map = new Array(this._width);

        for (var x = 0; x < this._map.length; x++) {
            this._map[x] = new Array(this._height);
        }


        var y = 0;
        //find every Tutorial and print the author
        var mapRef = this._map;
        var mapObjectRef = this;
        var mapWidth = this._width;


        $(xml).find("Row").each(function () {
            var wall = false;
            var row = $(this).text();
            for (var x = 0; x < mapWidth; x++) {

                // some rows are shorter than map width - fill rest with Empty elements
                if (x >= row.length) {
                    mapRef[x][y] = new Empty();

                } else {

                    switch (row[x]) {
                        case " ":
                            // if we had wall already that means we need to insert Floor element,
                            // for Empty elements that are between walls on some maps we are using '=' character
                            if (wall) {
                                mapRef[x][y] = new Floor();
                            }
                            else {
                                mapRef[x][y] = new Empty();
                            }
                            break;
                        case "#":
                            mapRef[x][y] = new Wall();
                            wall = true;
                            break;
                        case "$":
                            mapRef[x][y] = new Box();
                            break;
                        case ".":
                            mapRef[x][y] = new Goal();
                            mapObjectRef._goals++;
                            break;
                        case "@":
                            mapRef[x][y] = new Player(mapObjectRef);
                            mapObjectRef._playerX = x;
                            mapObjectRef._playerY = y;
                            break;
                        case "*":
                            mapRef[x][y] = new BoxOnGoal();
                            mapObjectRef._goalsAchived++;
                            mapObjectRef._goals++;
                            break;
                        case "P":
                            mapRef[x][y] = new Devil();
                            mapObjectRef._devilX = x;
                            mapObjectRef._devilY = y;
                            break;
                        case "+":
                            var player = new Player(mapObjectRef);
                            mapRef[x][y] = player;
                            player.IsOnGoal = true;
                            mapObjectRef._playerX = x;
                            mapObjectRef._playerY = y;
                            break;
                        case "=":
                            mapRef[x][y] = new Empty();
                            break;
                    }
                   

                }
                mapRef[x][y].ImageRepository = mapObjectRef.ImageRepository;
            }
            y++;
        });
        this.Loaded = true;
    }
}