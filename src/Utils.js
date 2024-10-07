import fs from 'fs';
import path, { resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url); //현재 모듈의 절대 경로
const __dirname = path.dirname(__filename);
//최상위 경로 + assets 폴더
const basePath= path.join(__dirname, "../Assets");

export class Utils{
    static basePath = path.join(path.dirname(fileURLToPath(import.meta.url)), "../Assets");

    //비동기 병렬로 파일을 읽기
    static async readFileAsync(filename){
        return new Promise((resolve, reject)=>{
            fs.readFile(path.join(Utils.basePath, filename), "utf8", (err, data)=>{
                if(err){
                    reject(err);
                    return;
                }
                resolve(JSON.parse(data));
            });
        })
    };
}