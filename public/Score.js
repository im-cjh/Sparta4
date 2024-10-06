import { ePacketId } from '/Packet.js';
import { session } from './Session.js';
import { assetManager } from './AssetManager.js';

class Score {
  score = 0;
  HIGH_SCORE_KEY = 'highScore';
  stageChange = true;
  
  currentStageIndex = 0;
  scorePerSecond = 0;
  targetStageScore = 0;
  isMaxStage = false;

  constructor(ctx, scaleRatio) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.scaleRatio = scaleRatio;
  }

/*-------------------------------------------------------------
    [Update문]

    1. 현재 점수에 단위 시간에 따라 점수(scorePerSecond)추가
    2. 목표 점수(targetStageScore)를 넘었다면 
      2-1. 마지막 스테이지가 아니라면
      2-2. 서버에 패킷 전송
    3. 스테이지 이동 후 처리(onStageMove())호출 
-------------------------------------------------------------*/
  update(deltaTime) {
    this.score += deltaTime * this.scorePerSecond * 0.01;
    if (this.isMaxStage == false && Math.floor(this.score) === this.targetStageScore && this.stageChange) {
      this.stageChange = false;

      
      //null이 아니면(스테이지 MAX가 아니라면 이벤트 발생)
      if(this.targetStageScore != null){
        session.sendEvent(ePacketId.MoveStage, { currentStage: assetManager.getCurrentStageOrNull(this.currentStageIndex), targetStage: assetManager.getTargetStageOrNull(this.currentStageIndex) });
      }
      this.onStageMove();
    }
  }

/*-------------------------------------------------------------
    [스테이지 이동 후 처리]

    1. 스테이지 연속 변경 방지(stageChange)
    2. 현재 스테이지 번호(currentStageIndex) 증가
    3. 시간 당 점수(scorePerSecond) 조정
    4. 다음 스테이지 이동에 필요한 점수(targetStageScore) 조정

    item생성에 필요한 StageIndex를 Session에서 관리(추후 redis에 저장하여 사용하기)

    [TODO]
      get한 값이 null이라면..?
-------------------------------------------------------------*/
  onStageMove(){
    this.stageChange = true;
    this.currentStageIndex += 1;
    this.scorePerSecond = assetManager.getScorePerSecondOrNull(this.currentStageIndex);
    this.targetStageScore = assetManager.getTargetStageScoreOrNUll(this.currentStageIndex);

    session.tmpCurrentStageIndex+=1;; //임시적으로 사용
    console.log("session.tmpCurrentStageIndex: ", session.tmpCurrentStageIndex)
  }

/*-------------------------------------------------------------
    [아이템 획득]

    1. itemId를 통해 점수 가져오기
    2. null체크
      2-1. null이 아닐 때: server에 패킷 전송
      2-2. null일 때: 아이템 획득 무시 후 console.log
-------------------------------------------------------------*/
  getItem(itemId) {
      let score = assetManager.getItemScoreOrNull(itemId);
      if(score != null){
        this.score += score;

        session.sendEvent(ePacketId.EarnItem, {itemId, score, currentStageIndex: this.currentStageIndex});
      }
      else {
        console.log("Invalid ItemId");
      }

    console.log(score);
  }
/*-------------------------------------------------------------
    [게임 시작, 재시작 시 초기화]

    현재 점수 0으로 초기화
    시간 당 점수(scorePerSecond) 조정
    다음 스테이지 이동에 필요한 점수(targetStageScore) 조정

    item생성에 필요한 StageIndex를 Session에서 관리(추후 redis에 저장하여 사용하기)
-------------------------------------------------------------*/
  reset() {
    this.score = 0;
    this.isMaxStage = false;

    session.tmpCurrentStageIndex = 0; //임시적으로 사용
    try {
      this.currentStageIndex = 0;
      this.scorePerSecond = assetManager.getScorePerSecondOrNull(this.currentStageIndex);
      this.targetStageScore = assetManager.getTargetStageScoreOrNUll(this.currentStageIndex);
    } catch (error) {
      this.isMaxStage = true;
    }
  }

/*-------------------------------------------------------------
    [기본으로 제공되는 코드]
-------------------------------------------------------------*/
  setHighScore() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    if (this.score > highScore) {
      localStorage.setItem(this.HIGH_SCORE_KEY, Math.floor(this.score));
    }
  }
  getScore() {
    return this.score;
  }

  draw() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    const y = 20 * this.scaleRatio;

    const fontSize = 20 * this.scaleRatio;
    this.ctx.font = `${fontSize}px serif`;
    this.ctx.fillStyle = '#525250';

    const scoreX = this.canvas.width - 75 * this.scaleRatio;
    const highScoreX = scoreX - 125 * this.scaleRatio;

    const scorePadded = Math.floor(this.score).toString().padStart(6, 0);
    const highScorePadded = highScore.toString().padStart(6, 0);

    this.ctx.fillText(scorePadded, scoreX, y);
    this.ctx.fillText(`HI ${highScorePadded}`, highScoreX, y);
  }
}

export default Score;
