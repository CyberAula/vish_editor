ig.module(
	'plugins.rpgwizard.status-manager'
)
.requires(
	'impact.impact'
)
.defines(function(){
	
ig.statusManager = ig.Class.extend({
    //two dimensional array, first param is the level and the second one a task-manager object
    tasksArrayPerLevel: new Array(),
    textStyle: 'italic 22px sans-serif',
    points: 0,   //number of points got with the tasks
    
    addTask: function(level, task){
        //if level does not exist in the array, we create it
        if(!this.tasksArrayPerLevel[level]){
            this.tasksArrayPerLevel[level] = new ig.taskManager();            
        }
        this.tasksArrayPerLevel[level].addTask(task);
    },
    
    draw: function(){
	//we draw the boxes to write missions and points
	var img = new Image();
	img.src = "media/decorations/points.png";
	ig.system.context.drawImage(img, 0, 0);
	
        ig.system.context.fillStyle = "rgb(66,33,33)";
        
	ig.system.context.font = this.textStyle;
	ig.system.context.textBaseline = 'alphabetic';
	
	ig.system.context.fillStyle = 'black';
	ig.system.context.fillText(this.points, 720, 50);        
    },
    
    //method to get the taskManager in the missionsManager and draw the missions
    getCurrentTaskManager: function(){
	return this.tasksArrayPerLevel[ig.game.myDirector.currentLevel];
    },
    
    //method to know if the user has finished his tasks
    finishedThisLevelTasks: function(){
	var taskManager = this.tasksArrayPerLevel[ig.game.myDirector.currentLevel];
	if(taskManager){
	    return taskManager.finishedTasks();
	}
	else{
	    return true;
	}
    },
    
    /**
    * Divide an entire phrase in an array of phrases, all with the max pixel length given.
    * The words are initially separated by the space char.
    * @param phrase
    * @param length
    * @return
    */
   getLines: function (ctx,phrase,maxPxLength,textStyle) {
       var wa=phrase.split(" "),
           phraseArray=[],
           lastPhrase="",
           l=maxPxLength,
           measure=0;
       ctx.font = textStyle;
       for (var i=0;i<wa.length;i++) {
           var w=wa[i];
           measure=ctx.measureText(lastPhrase+w).width;
           if (measure<l) {
               lastPhrase+=(" "+w);
           }else {
               phraseArray.push(lastPhrase);
               lastPhrase=w;
           }
           if (i===wa.length-1) {
               phraseArray.push(lastPhrase);
               break;
           }
       }
       return phraseArray;
   }
    
    
    
    
});





});