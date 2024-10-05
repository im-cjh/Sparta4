class AssetManager{
    constructor(){
        this.gameAssets = null

        this.itemScoreMap = new Map();
    }

    setGameAssetsAndInit(gameAssets){
        this.gameAssets = gameAssets;

        gameAssets.items.data.forEach(item => {
            this.itemScoreMap[item.id] = item.score;
          });
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

    getItemScore(itemId){
        let ret = this.itemScoreMap[itemId];
        if(!ret){
            return null;
        }

        return ret;
    }
}

export const assetManager = new AssetManager();