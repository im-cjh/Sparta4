import fs from 'fs';
import path, { resolve } from 'path';
import { fileURLToPath } from 'url';

let gameAssets = {};

const __filename = fileURLToPath(import.meta.url); //현재 모듈의 절대 경로
const __dirname = path.dirname(__filename);
//최상위 경로 + assets 폴더
const basePath= path.join(__dirname, "../../Assets");
console.log(basePath);

//비동기 병렬로 파일을 읽기
const readFileAsync = (filename) =>{
    return new Promise((resolve, reject)=>{
        fs.readFile(path.join(basePath, filename), "utf8", (err, data)=>{
            if(err){
                reject(err);
                return;
            }
            resolve(JSON.parse(data));
        });
    })
};

export const loadGameAssets = async()=>{
    try {
        const [stages, items, itemSpawn] = await Promise.all([
            readFileAsync("stage.json"),
            readFileAsync("item.json"),
            readFileAsync("item_spawn.json"),
        ]);
        
        gameAssets = {stages, items, itemSpawn};
        return gameAssets;  
    } catch (error) {
        throw new Error("Faild to load game assets: " + error.message)
    }
}


export const getGameAssets = ()=>{
    return gameAssets;
}