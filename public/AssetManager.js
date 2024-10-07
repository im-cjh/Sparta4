class AssetManager{
    constructor(){
        this.gameAssets = null

        this.itemMap = new Map();
    }

    setGameAssetsAndInit(gameAssets){
        this.gameAssets = gameAssets;

        this.itemMap = gameAssets.itemMap;
        console.log(123);
        console.log(this.itemMap);
    }

    getScorePerSecondOrNull(stageIndex){
        try {
            let ret = this.gameAssets.stages.data[stageIndex].scorePerSecond;
            return ret;
        } catch (error) {
            return null;
        }
    }

    getTargetStageScoreOrNUll(stageIndex){
        try {
            let ret = this.gameAssets.stages.data[stageIndex+1].score;
            return ret;
        } catch (error) {
            return null;
        }
    }

    getCurrentStageOrNull(stageIndex){
        try {
            let ret = this.gameAssets.stages.data[stageIndex].id;
            return ret;
        } catch (error) {
            return null;
        }
    }

    getTargetStageOrNull(stageIndex){
        try {
            let ret = this.gameAssets.stages.data[stageIndex+1].id;
            return ret;
        } catch (error) {
            return null;
        }
    }

    getItemSpawnsOrNull(){
        try {
            let ret = this.gameAssets.itemSpawn.data;
            return ret;
        } catch (error) {
            return null;
        }
    }

    getItemScoreOrNull(itemId){
        try {
            let ret = this.itemMap[itemId];
            return ret;
        } catch (error) {
            return null;
        }
    }
}

export const assetManager = new AssetManager();