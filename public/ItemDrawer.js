import { assetManager } from "./AssetManager.js";

class ItemDrawer {
    constructor() {
        this.itemPools = new Array();
    }

    // 스테이지 데이터 초기화
    async init() {
        this.itemPools = await assetManager.getItemSpawnsOrNull();
    }

    getItemPoolLength(currentStageIndex){
        return this.itemPools[currentStageIndex].length;
    }

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
            // 가중치 총합 구하기
            let totalWeight = 0;
            for (let i = 0; i < itemPool.length; i += 1) {
                totalWeight += itemPool[i].rarity;
            }
    
            // [0, 가중치 총합) 범위의 난수 생성
            const randomNum = Math.random() * totalWeight;
    
            // 가중치 누적합을 통해 아이템 선택
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
}

export const itemDrawer = new ItemDrawer();