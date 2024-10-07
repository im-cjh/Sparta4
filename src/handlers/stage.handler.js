//유저는 스테이지를 하나씩 올라갈 수 이싿. (1스테이지 -> 2, 2->3)
import { serverAssetManager } from "../init/assets.js";
import { itemManager } from "../models/item.model.js";
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
        console.log(currentStage.id, payload.currentStage, "stage")
        return {status: "fail", message: "Current stgage mismatch"}
    }

    //점수 검증
    const serverTime = Date.now(); // 현재 타임스탬프
    const stageScorePerSecond = serverAssetManager.getScorePerSecond(currentStage.id - 1000); // 추후에 Redis에 stageIndex 저장하기
    const elapsedTime = ((serverTime - currentStage.timestamp) * stageScorePerSecond) / 1000;

    // 아이템 점수 추가 고려
    const userItemScore = itemManager.getTotalScore(userId); // 유저가 획득한 아이템의 점수 합산
    const finalTotalScore = elapsedTime + userItemScore;

    // 1스테이지 -> 2스테이지로 넘어가는 과정
    if (Math.abs(finalTotalScore - 10) > 10) {
        console.log("finalTotalScore: ", finalTotalScore);
        return { status: 'fail', message: "Invalid total score" };
    }


    //targetStage에 대한 검증 <- 게임에셋에 존재하는가?
    const {stages} = serverAssetManager.getGameAssets();
    if(!stages.data.some((stage)=>stage.id === payload.targetStage)){
        return {status: 'fail', message: 'Target stage not found'};
    }


    stageManager.setStage(userId, payload.targetStage, serverTime);
    return {status: "success", stage: payload.targetStage};
}