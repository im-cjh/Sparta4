## **주요 디렉토리 구조**

```cpp
┌─ assets                     // [게임 데이터]
│   ├── item.json
│   ├── item_unlock.json
│   └── stage.json
├── Protocol
│		├── Packet.js              // 패킷 구조체
├── public                     // [클라이언트 코드]
│   ├── session.js             // Socket래핑 클래스
└── src                        // [서버 코드]
    ├── app.js
    ├── constants.js
    ├── Utils.js               // 비동기 파일 읽기
    ├── handlers               // [비즈니스 로직]
    │   ├── game.handler.js
    │   ├── handlerMapping.js
    │   ├── helper.js
    │   ├── regiser.handler.js
    │   └── stage.handler.js
    ├── init                   // [서버 실행 시 불러올 필수 데이터와 호출할 기능]
    │   ├── assets.js
    │   └── socket.js
    └── models                 // 세션 모델 관리
        ├── stage.model.js
        ├── user.model.js
        └── item.model.js      // 아이템 로그 기록 및 검증
```

# [필수기능]

## **1. 스테이지 구분**

-   **점수**에 따른 스테이지 구분

## **2. 시간 당 점수 획득**

1. Score::`Update()`호출

    ```
    /*-------------------------------------------------------------
        [Update문]

        1. 현재 점수에 단위 시간에 따라 점수(scorePerSecond)추가
        2. 목표 점수(targetStageScore)를 넘었다면
          2-1. 마지막 스테이지가 아니라면
          2-2. 서버에 패킷 전송
        3. 스테이지 이동 후 처리(onStageMove())호출
    -------------------------------------------------------------*/
    ```

2. Stage::`onStageMove()`호출
     
    ```jsx
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
    ```

  <details>
    <summary>Stage::`onStageMove()`</summary>
    
  ```jsx
      class Score {
          update(deltaTime) {
              this.score += deltaTime * this.scorePerSecond * 0.01;
              if (Math.floor(this.score) === this.targetStageScore && this.stageChange) {
                  this.stageChange = false;
  
                  this.onStageMove();
                  //null이 아니면(스테이지 MAX가 아니라면 이벤트 발생)
                  if (this.targetStageScore) {
                      session.sendEvent(ePacketId.MoveStage, {
                          currentStage: 1000,
                          targetStage: 1001,
                      });
                  }
              }
          }
  
          onStageMove() {
              this.currentStageIndex += 1;
              this.scorePerSecond = session
                  .getAssetManager()
                  .getScorePerSecond(this.currentStageIndex);
              this.targetStageScore = session
                  .getAssetManager()
                  .getTargetStageScore(this.currentStageIndex);
          }
  
          reset() {
              this.score = 0;
  
              this.currentStageIndex = 0;
              this.scorePerSecond = session
                  .getAssetManager()
                  .getScorePerSecond(this.currentStageIndex);
              this.targetStageScore = session
                  .getAssetManager()
                  .getTargetStageScore(this.currentStageIndex + 1);
          }
      }
      ```
      ```jsx
      /public/Session.js
  
      Init() {
      	...
          // GameAssets받기
          this.socket.on('init', (gameAssets) => {
              //서버와 connect되면 서버가 gameAssets을 전송
            this.assetManager.setGameAssets(gameAssets);
          });
        }
      ```
      ```jsx
      /public/AssetManager.js
  
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
  ```
  </details>

## **3. 아이템 생성**

1. 일정 시간이 지나면 ItemConstroller::`createItem()`호출
2. ItemDrawer::`drawItemId()`호출

    ```
    /*-------------------------------------------------------------
        [랜덤 가중치 뽑기]
    
        1. 현재 스테이지에 맞는 아이템 풀 가져오기
        2. null체크
          2-1. null이 아닐 때: 무작위 itemId 반환
          2-2. null일 때: null반환
    -------------------------------------------------------------*/
    ```
<details>
  <summary>📝 등장 아이템 테이블</summary>

  ```cpp
  Assets/item_spawn.json
  {
      "name": "item_spawn",
      "version": "1.0.0",
      "data": [
          {
              "stage_id": 1001,
              "items": [{ "item_id": 1, "rarity": 10 }]
          },
          {
              "stage_id": 1002,
              "items": [
                  { "item_id": 1, "rarity": 20 },
                  { "item_id": 2, "rarity": 10 }
              ]
          },
          {
              "stage_id": 1003,
              "items": [
                  { "item_id": 1, "rarity": 30 },
                  { "item_id": 2, "rarity": 20 },
                  { "item_id": 3, "rarity": 10 }
              ]
          },
          {
              "stage_id": 1004,
              "items": [
                  { "item_id": 1, "rarity": 40 },
                  { "item_id": 2, "rarity": 30 },
                  { "item_id": 3, "rarity": 20 },
                  { "item_id": 4, "rarity": 10 }
              ]
          },
          {
              "stage_id": 1005,
              "items": [
                  { "item_id": 2, "rarity": 40 },
                  { "item_id": 3, "rarity": 30 },
                  { "item_id": 4, "rarity": 20 },
                  { "item_id": 5, "rarity": 10 }
              ]
          },
          {
              "stage_id": 1006,
              "items": [
                  { "item_id": 3, "rarity": 40 },
                  { "item_id": 4, "rarity": 30 },
                  { "item_id": 5, "rarity": 20 },
                  { "item_id": 6, "rarity": 10 }
              ]
          }
      ]
  }
```
</details> 

<details>
  <summary>📝 ItemDrawer::drawItemId() 코드</summary>

  ```jsx
  /*-------------------------------------------------------------
      [랜덤 가중치 뽑기]

      1. 현재 스테이지에 맞는 아이템 풀 가져오기
      2. null체크
        2-1. null일 때: null반환
      3. 가중치 총합 구하기
      4. 가중치 누적합을 통해 아이템 선택
  -------------------------------------------------------------*/
      drawItemId(currentStageIndex) {
          try {
              // 1. 현재 스테이지에 맞는 아이템 풀 가져오기
              const itemPool = this.itemPools[currentStageIndex].items;

              console.log(itemPool);
              // 3. 가중치 총합 구하기
              let totalWeight = 0;
              for (let i = 0; i < itemPool.length; i += 1) {
                  totalWeight += itemPool[i].rarity;
              }

              // 4. [0, 가중치 총합) 범위의 난수 생성
              const randomNum = Math.random() * totalWeight;

              // 5. 가중치 누적합을 통해 아이템 선택
              let weightSum = 0;
              for (const item of itemPool) {
                  weightSum += item.rarity;
                  if (randomNum < weightSum) {
                      return item.item_id;
                  }
              }
          } catch (error) {
              //2-1. null일 때: null반환
              return null;
          }
      }
```
</details> 

## **4. 아이템 획득 시 점수 획득**

1. 아이템 충돌
2. Score:: `getItem()`호출

    ```
    /*-------------------------------------------------------------
    [아이템 획득]

        1. AssetManager에게 itemId를 넘겨 점수 가져오기
        2. null체크
          2-1. null이 아닐 때: server에 패킷 전송
          2-2. null일 때: **아이템 획득 무시 후 console.log**
    -------------------------------------------------------------*/
    ```

-   Score:: `getItem()` 코드
    ```jsx
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

            session.sendEvent(ePacketId.EarnItem, score);
          }
          else {
            console.log("Invalid ItemId");
          }

        console.log(score);
      }
    ```
    <details>
      <summary>📝 AssetManager::getItemScoreOrNull() 코드</summary>

      ```jsx
      getItemScoreOrNull(itemId) {
          try {
              let ret = this.itemMap[itemId];
              return ret;
          } catch (error) {
              return null;
          }
      }
    ```
    </details> 

## **5. 아이템 별 획득 점수 구분**
1. 아이템 획득 패킷 수신, earnItemHandler()호출
2. 아이템 종류 별 점수 검증 
    1. 클라가 보내준 itemId와 score를 서버가 가지고 있는 item표와 비교 
3. 아이템 종류별 획득 스테이지 검증 
    1. 클라가 보내준 스테이지 번호(id가 아닌 index)로 해당 스테이지에 itemId가 존재하는지 확인 
4. itemManager에 로그 기록 
    1. stage변경 시, 아이템 획득으로 얻은 점수+시간 당 점수를 계산해 검증
