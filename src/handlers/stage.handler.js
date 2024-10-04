//유저는 스테이지를 하나씩 올라갈 수 이싿. (1스테이지 -> 2, 2->3)

import { assetManager } from "../../public/AssetManager.js";
import { getGameAssets } from "../init/assets.js";
import { stageManager } from "../models/stage.model.js";

//유저는 일정 점수가 되면 다음 스테이지로 이동한다.
export const moveStageHandler = (userId, payload) => {
    console.log("im called");

    //유저의 현재 스테이지 정보
    let currentStages = stageManager.getStage(userId);
    if(!currentStages.length){
        return {status: 'fail', message: "No stages found for user"};
    }

    //오름차순 -> 가장 큰 스테이지 ID를 확인 <- 유저의 현재 스테이지
    currentStages.sort((a,b)=>a.id-b.id);
    const currentStage = currentStages[currentStages.length-1];


    //클라이언 vs 서버 비교
    if(currentStage.id !== payload.currentStage){
        return {status: "fail", message: "Current stgage mismatch"}
    }

    //점수 검증
    const serverTime = Date.now(); //현재 타임스탬프
    const scorePerSecond = getGameAssets(currentStage.id-1000); //추후에 redis에 stageIndex저장하기
    const elapsedTime = ((serverTime - currentStage.timestamp)*scorePerSecond) / 1000;

    //1스테이지 -> 2스테이지로 넘어가는 과정
    //5는 임의로 정한 오차범위
    if(elapsedTime < 10 || elapsedTime > 10.5) {
        console.log(elapsedTime);
        return {status: 'fail', message: "Invalid elapsed time"};
    }


    //targetStage에 대한 검증 <- 게임에셋에 존재하는가?
    const {stages} = getGameAssets();
    if(!stages.data.some((stage)=>stage.id === payload.targetStage)){
        return {status: 'fail', message: 'Target stage not found'};
    }


    stageManager.setStage(userId, payload.targetStage, serverTime);
    return {status: "success", stage: payload.targetStage};
}