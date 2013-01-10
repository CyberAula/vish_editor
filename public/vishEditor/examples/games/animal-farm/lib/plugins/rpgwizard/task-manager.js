ig.module(
	'plugins.rpgwizard.task-manager'
)
.requires(
	'impact.impact'
)
.defines(function(){
	
ig.taskManager = ig.Class.extend({
    //array of tasks to be shown to the pupil
    tasksArray: new Array(),
    
    addTask: function(task){
        this.tasksArray.push(task);
    },
    
    //method to know if the user has finished his tasks
    finishedTasks: function(){
	for(var i = 0; i < this.tasksArray.length; i++) {
            if(!this.tasksArray[i].finished){
		return false;
	    }	    
        }
	return true;
    }
    
});





});