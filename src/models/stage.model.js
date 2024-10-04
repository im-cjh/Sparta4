//ket: uuid, value: array-> stage정보는 배열

class StageManager{
	constructor(){
		this.stages = {};
	}
	
	createStage(uuid){
		this.stages[uuid] = [];
    }

    getStage(uuid){
        return this.stages[uuid];
    }
    
    setStage(uuid, id, timestamp){
        return this.stages[uuid].push({id, timestamp})
    }
    
    clearStage(uuid){
        this.stages[uuid] = [];
    }
}

export const stageManager = new StageManager();