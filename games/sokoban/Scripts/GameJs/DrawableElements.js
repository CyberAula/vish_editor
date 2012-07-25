
function ImageRepository() {
    this.Floor = new Image();
    this.Wall = new Image();
    this.Empty = null; // we don't need image for empty space
    this.Box = new Image();
    this.Goal = new Image();
    this.Player = new Image();
    this.BoxOnGoal = new Image();
    this.Devil = new Image();
    
    var _imgLoaded = 0;
    this.Loaded = function () {
        // we have 8 types of element, but only 7 are being rendered as images
        return _imgLoaded == 7;
    }

    this.LoadContent = function () {
        _imgLoaded = 0;

        //go through all properties and load images
        for (var key in this) {
            if (this[key] != null) {

                //this even will not fire in Chrome if Image is cached !! Workaround needed       
                this[key].onload = function () {
                    _imgLoaded++;
                }
            }
        }

        // this is workaround to load cached image in Chrome, 
        // assigning string.empty and later true value will force onload event to fire
        this.Wall.src = "";
        this.Box.src = "";
        this.Goal.src = "";
        this.Player.src = "";
        this.BoxOnGoal.src = "";
        this.Floor.src = "";
        this.Devil.src = "";

        this.Wall.src = "http://demo2.felinesoft.com/Sokoban/Content/Images/wall.gif";
        this.Box.src = "http://demo2.felinesoft.com/Sokoban/Content/Images/box.gif";
        this.Goal.src = "http://demo2.felinesoft.com/Sokoban/Content/Images/goal.gif";
        this.Player.src = "http://demo2.felinesoft.com/Sokoban/Content/Images/player.gif";
        this.BoxOnGoal.src = "http://demo2.felinesoft.com/Sokoban/Content/Images/boxOnGoal.gif";
        this.Floor.src = "http://demo2.felinesoft.com/Sokoban/Content/Images/floor.gif";
        this.Devil.src = "Content/Images/devil.gif";

    }

}

function DrawableElement() {
    this.GetImage = function () {
        //implement this method in your sub-class if your element is represented by image 
        //this should return Image object
        return null;
    }
    this.GetFillStyle = function () {
        //implement this method in your sub-class if your element is represented by filled rectangle
        //this should return canvas "fillStyle" string.
        return null;
    }
    this.ImageRepository = null;

}

function Floor(){
    this.GetImage = function () {
        return this.ImageRepository.Floor;
    }
    
}

function Empty(){
    this.GetImage = function () {
        return this.ImageRepository.Empty;
    }
    this.GetFillStyle = function(){
        return "rgba(255, 255, 255, 1)"; // white
    }
}
function BoxOnGoal() {
    this.GetImage = function () {
        return this.ImageRepository.BoxOnGoal;
    }
}
function Wall() {
    this.GetImage = function () {
        return this.ImageRepository.Wall;
    }
}
function Box() {
    this.GetImage = function () {
        return this.ImageRepository.Box;
    }
}
function Goal() {
    this.GetImage = function () {
        return this.ImageRepository.Goal;
    }
}
function Devil(){
	this.GetImage = function () {
        return this.ImageRepository.Devil;
    }
}
function Player(map) {
    // DrawableElement implementation
    this.GetImage = function () {
        return this.ImageRepository.Player;
    }

    // possible player movement enumeration
    this.MoveDirection = { "Up": 0, "Down": 1, "Left": 3, "Right": 4 };

    this.Moves = 0;
    this.Pushes = 0;

    // player stand on goal
    this.IsOnGoal = false;

    this._map = map;    
    var _player = this;
    

    this.KeyCheck = function (event) {
        var KeyID = event.keyCode;

        switch (KeyID) {
            case 87: // W
                this.Move(this.MoveDirection.Up);
                break;
            case 65: // A
                this.Move(this.MoveDirection.Left);
                break;
            case 68: // D
                this.Move(this.MoveDirection.Right);
                break;
            case 83: // S
                this.Move(this.MoveDirection.Down);
                break;


        }
    }
    this.ValidateMove = function (targetCell, nextCell) {
        var posToMove = targetCell.constructor;

        if (posToMove == Wall) {
            // wall is next, player cannot move there
            return false;
        }

        var nextObject = nextCell.constructor;
        if ((posToMove == Box || posToMove == BoxOnGoal) && (nextObject == Wall || nextObject == Box || nextObject == BoxOnGoal)) {
            //player attempts to push box, next element after the box is wall or another box – player cannot move
            return false;
        }

        return true;
    }

    this.MoveBox = function(boxCell, moveBoxToCell, moveToX, moveToY){
                //we need to move the box too
                this.Pushes++;   

                var posToMove = boxCell.constructor;
                var nextObject = moveBoxToCell.constructor;

                if (nextObject == Goal) {
                    this._map._map[moveToX][moveToY] = new BoxOnGoal();
                    if (posToMove == Box) {
                        //we just moved Box on goal
                        this._map._goalsAchived++;
                    }
                } else {
                    this._map._map[moveToX][moveToY] = new Box();
                    if (posToMove == BoxOnGoal) {
                        //box was on goal but now it's not
                        this._map._goalsAchived--;
                    }
                }
                this._map._map[moveToX][moveToY].ImageRepository = this.ImageRepository;

    }

    this.Move = function (direction) {

        var oldX = this._map._playerX;
        var oldY = this._map._playerY;

        var newX = this._map._playerX;
        var newY = this._map._playerY;

        var nextOneX = this._map._playerX;
        var nextOneY = this._map._playerY;
        switch (direction) {
            case this.MoveDirection.Down:
                newY++;
                nextOneY += 2;
                break;
            case this.MoveDirection.Up:
                newY--;
                nextOneY -= 2;
                break;
            case this.MoveDirection.Left:
                newX--;
                nextOneX -= 2;
                break;
            case this.MoveDirection.Right:
                newX++;
                nextOneX += 2;
                break;
            default:

        }
        var attemptedCell = this._map._map[newX][newY];
        var nextCell;
        if (nextOneX >= 0 && nextOneY>=0 && nextOneX < this._map._width && nextOneY < this._map._height) {
            nextCell = this._map._map[nextOneX][nextOneY];
        }
        
        var posToMove = attemptedCell.constructor;


        //next cell is Goal = player will be standing on goal 
        var isGoal = (attemptedCell.constructor == Goal);


        if (!this.ValidateMove(attemptedCell, nextCell)) {
            return false;
        }        

        if (nextCell && (posToMove == Box || posToMove == BoxOnGoal)) {
            this.MoveBox(attemptedCell, nextCell, nextOneX, nextOneY);
            if (posToMove == BoxOnGoal) {
                isGoal = true;
            }
        }

        //update player position
        this._map._playerY = newY;
        this._map._playerX = newX;
        this._map._map[this._map._playerX][this._map._playerY] = this._map._map[oldX][oldY];


        this.Moves++;

        if (this.IsOnGoal) {
            this._map._map[oldX][oldY] = new Goal();
        } else {
            this._map._map[oldX][oldY] = new Floor();
        }
        this.IsOnGoal = isGoal;

        this._map._map[oldX][oldY].ImageRepository = this.ImageRepository;
        
        return false;

    }



}


Floor.prototype = new DrawableElement();
Floor.prototype.constructor = Floor;
Empty.prototype = new DrawableElement();
Empty.prototype.constructor = Empty;
Wall.prototype = new DrawableElement();
Wall.prototype.constructor = Wall;
Box.prototype = new DrawableElement();
Box.prototype.constructor = Box;
Goal.prototype = new DrawableElement();
Goal.prototype.constructor = Goal;
Player.prototype = new DrawableElement();
Player.prototype.constructor = Player;
BoxOnGoal.prototype = new DrawableElement();
BoxOnGoal.prototype.constructor = BoxOnGoal;
Devil.prototype = new DrawableElement();
Devil.prototype.constructor = Devil;
                