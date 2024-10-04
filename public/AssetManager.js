export class AssetManager{
    constructor(){
        this.gameAssets = null
    }

    setGameAssets(gameAssets){
        this.gameAssets = gameAssets;
    }

    getScorePerSecond(stageIndex){
        console.log(this.gameAssets);
        return this.gameAssets.stages.data[stageIndex].scorePerSecond;
    }

    getTargetStageScore(stageIndex){
        let ret = this.gameAssets.stages.data[stageIndex].score;
        if(!ret){
            return null;
        }

        return ret;
    }
}