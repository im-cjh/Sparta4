class AssetManager{
    constructor(){
        this.gameAssets = null
    }

    setGameAssets(gameAssets){
        this.gameAssets = gameAssets;
    }

    getScorePerSecond(stageIndex){
        let ret = this.gameAssets.stages.data[stageIndex].scorePerSecond;
        if(!ret){
            return null;
        }

        return ret;
    }

    getTargetStageScore(stageIndex){
        let ret = this.gameAssets.stages.data[stageIndex+1].score;
        if(!ret){
            return null;
        }

        return ret;
    }

    getCurrentStage(stageIndex){
        let ret = this.gameAssets.stages.data[stageIndex].id;
        if(!ret){
            return null;
        }

        return ret;
    }

    getTargetStage(stageIndex){
        let ret = this.gameAssets.stages.data[stageIndex+1].id;
        if(!ret){
            return null;
        }

        return ret;
    }

    getItemSpawns(){
        let ret = this.gameAssets.itemSpawn.data;
        if(!ret){
            return null;
        }

        return ret;
    }
}

export const assetManager = new AssetManager();