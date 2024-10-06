import { serverAssetManager } from "../init/assets.js";

/*-------------------------------------------------------------
    [아이템 로그 기록 매니저]
    
    1. addItemLog: 아이템 로그 추가
    2. 
-------------------------------------------------------------*/
class ItemManager{
	constructor(){
		this.itemLogs = new Map();
	}
	
	createItemLog(uuid){
		this.itemLogs[uuid] = [];
    }

/*-------------------------------------------------------------
    [아이템 로그 추가]

    **createItemLog를 먼저 수행할 것**
    1. 아이템 종류별 획득 점수 검증 
    2. 아이템 종류별 획득 스테이지 검증
    3. 아이템 추가
-------------------------------------------------------------*/
    addItemLog(uuid, itemId, score){
        if (!this.itemLogs.has(uuid)) {
            this.createItemLog(uuid);
        }
    
        this.itemLogs[uuid].push({
            itemId,
            score
        });
    }

    clearItemLog(uuid){
        this.itemLogs.delete(uuid);
    }

    getTotalScore(uuid) {
        try {
            let totalScore = 0;
            for (const item of this.userItems[uuid]) {
                totalScore += item.score;
            }
            return totalScore;
        } catch (error) {
            return 0;
        }
    }
}

export const itemManager = new ItemManager();