import { serverAssetManager } from "../init/assets.js";
import { itemManager } from "../models/item.model.js";
import { stageManager } from "../models/stage.model.js";

export const gameStart = (uuid, payload)=>{
    const { stages } = serverAssetManager.getGameAssets();

    stageManager.clearStage(uuid);
    itemManager.clearItemLog(uuid);
    //stages 배열에서 0번째 = 첫 번째 스테이지
    stageManager.setStage(uuid, stages.data[0].id, payload.timestamp); //편의를 위한 클라가 보낸 timestamp를 사용
    console.log(`Stage: `, stageManager.getStage(uuid));

    return {status: 'success'};
}

export const gameEnd = (uuid, payload) => {

    //클라이언트는 게임 종료 시 타임스탬프와 총 점수
    const { timestamp:gameEndTime, score} = payload;
    const stages = stageManager.getStage(uuid);

    if(!stages.length){
        return {status: "fail", message: "no stages found for user"};
    }

    //각 스테이지의 지속 시간을 계산하여 총 점수 계산 
    stages.forEach((stage, index) => {
        let stageEndtime;
        if(index === stages.length-1){
            stageEndtime = gameEndTime;
        } else {
            stageEndtime = stages[index+1].timestamp;
        }
        const stageDuration = (stageEndTime - stage.timestamp)/1000;
        totalScore += stageDuration; //1초당 1점
    });

    //점수와 타임스탬프 검증
    //5는 오차범위
    if(Math.abs(score-totalScore)>5){
        return {status: "fail", message: "Score verification failed"}
    }

    //서버와 클라가 계산한 것중 클라가 보낸 걸로 저장
    return {status: 'success', message: "Game ended", score};
}