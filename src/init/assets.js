import { Utils } from "../Utils.js";


class ServerAssetManager{
    constructor(){
        this.gameAssets = {};
        this.itemMap = new Map();
        this.stages = new Array();
        this.itemSpawn = new Array(); //random Access가 빈번히 발생+map으론 다음 스테이지를 유추하기 어려움인해 관련 메소드는 모두 index를 인자로 받음
    }

    async loadGameAssets(){
        try {
            const [stages, itemMap, itemSpawn] = await Promise.all([
                Utils.readFileAsync("stage.json"),
                Utils.readFileAsync("item.json"),
                Utils.readFileAsync("item_spawn.json"),
            ]);
            
            //스테이지 자원 로드
            this.stages = stages;

            //아이템 자원 로드
            this.itemMap["version"] = itemMap.version;
            itemMap.data.forEach(item => {
                this.itemMap[item.id] = item.score;
              });
            
            this.itemSpawn = itemSpawn;
            
            console.log(this.itemSpawn, "testdd");
            return {stages: this.stages, itemMap: this.itemMap, itemSpawn: this.itemSpawn};  
        } catch (error) {
            throw new Error("Faild to load game assets: " + error.message)
        }
    }

    getGameAssets(){
        return {stages: this.stages, itemMap: this.itemMap, itemSpawn: this.itemSpawn};
    }

    getScorePerSecond(stageIndex){
        return this.stages.data[stageIndex].scorePerSecond;
    }

    getItemScore(itemId){
        try {
            return this.itemMap[itemId];
        } catch (error) {
            return null;
        }
    }

    getItemSpawnOrNull(stageIndex){
        try {
            let ret = this.itemSpawn.data[stageIndex].items;
            return ret;
        } catch (error) {
            return null;
        }
    }
}

export const serverAssetManager = new ServerAssetManager();