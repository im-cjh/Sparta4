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

  update(deltaTime) {
    //targetStage에 대한 검증 <- 게임에셋에 존재하는가?
    this.score += deltaTime * this.scorePerSecond * 0.01;
    if (this.isMaxStage == false && Math.floor(this.score) === this.targetStageScore && this.stageChange) {
      this.stageChange = false;

      
      //null이 아니면(스테이지 MAX가 아니라면 이벤트 발생)
      if(this.targetStageScore != null){
        session.sendEvent(ePacketId.MoveStage, { currentStage: assetManager.getCurrentStage(this.currentStageIndex), targetStage: assetManager.getTargetStage(this.currentStageIndex) });
      }
      this.onStageMove();
    }
  }

  onStageMove(){
    this.stageChange = true;
    this.currentStageIndex += 1;
    this.scorePerSecond = assetManager.getScorePerSecond(this.currentStageIndex);
    this.targetStageScore = assetManager.getTargetStageScore(this.currentStageIndex);

    session.tmpCurrentStageIndex = this.currentStageIndex; //임시적으로 사용
  }
  getItem(itemId) {
    this.score += 0;
  }

  reset() {
    this.score = 0;
    this.isMaxStage = false;

    session.tmpCurrentStageIndex = 0; //임시적으로 사용
    try {
      this.currentStageIndex = 0;
      this.scorePerSecond = assetManager.getScorePerSecond(this.currentStageIndex);
      this.targetStageScore = assetManager.getTargetStageScore(this.currentStageIndex);
    } catch (error) {
      this.isMaxStage = true;
    }
  }

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
