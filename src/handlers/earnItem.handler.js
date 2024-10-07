import { serverAssetManager } from "../init/assets.js";
import { itemManager } from "../models/item.model.js";

export const earnItemHandler = (uuid, payload)=>{
    //1. 아이템 종류별 획득 점수 검증 
    const serverItemScore = serverAssetManager.getItemScore(payload.itemId);
    if(serverItemScore != payload.score){
        return {status: 'fail', message: "Not match Server's socre"};
    }

    //2. 아이템 종류별 획득 스테이지 검증 
    let isItemIncluded = false;
    const serverItemSpawn = serverAssetManager.getItemSpawnOrNull(payload.currentStageIndex);
    for (const item of serverItemSpawn) {
        if (item.item_id == payload.itemId) {
            isItemIncluded = true;
            break;
        }
    }
    
    console.log(serverItemSpawn, "serverItemSpawn")
    if(isItemIncluded == false){
        return {status: 'fail', message: "Not match Server's data"};
    }
    //3. itemManager에 로그 기록
    itemManager.addItemLog(uuid, payload.itemId, payload.score)
    return {status: 'success'};
}