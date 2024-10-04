import { ePacketId } from '/Packet.js';
import { session } from './Session.js';

class Score {
  score = 0;
  HIGH_SCORE_KEY = 'highScore';
  stageChange = true;
  
  currentStageIndex = 0;
  scorePerSecond = 0;
  targetStageScore = 0;

  constructor(ctx, scaleRatio) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.scaleRatio = scaleRatio;
  }

  update(deltaTime) {
    //targetStage에 대한 검증 <- 게임에셋에 존재하는가?
    this.score += deltaTime * this.scorePerSecond * 0.01;
    if (Math.floor(this.score) === this.targetStageScore && this.stageChange) {
      this.stageChange = false;

      this.onStageMove();
      //null이 아니면(스테이지 MAX가 아니라면 이벤트 발생)
      if(this.targetStageScore){
        session.sendEvent(ePacketId.MoveStage, { currentStage: 1000, targetStage: 1001 });
      }
    }
  }

  onStageMove(){
    this.currentStageIndex += 1;
    this.scorePerSecond = session.getAssetManager().getScorePerSecond(this.currentStageIndex);
    this.targetStageScore = session.getAssetManager().getTargetStageScore(this.currentStageIndex);

  }
  getItem(itemId) {
    this.score += 0;
  }

  reset() {
    this.score = 0;

    this.currentStageIndex = 0;
    this.scorePerSecond = session.getAssetManager().getScorePerSecond(this.currentStageIndex);
    this.targetStageScore = session.getAssetManager().getTargetStageScore(this.currentStageIndex+1);
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
