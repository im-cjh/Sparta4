import { v4 as uuidv4 } from "uuid";
import { handleConnection, handleDisconnect, handlerEvent } from "./helper.js";
import { serverAssetManager } from "../init/assets.js";
import { userManager } from "../models/user.model.js";


const registerHandler = (io) =>{
    io.on('connection', (socket)=>{
        //이벤트 처리

        const userUUID = uuidv4();
        userManager.addUser({uuid: userUUID, socketID: socket.id});

        handleConnection(socket, userUUID);
        
        //초기화(Game Assets정보 보내주기)
        const gameAssets = serverAssetManager.getGameAssets();
        socket.emit('init', gameAssets);

        //이벤트
        socket.on('event', (data)=>handlerEvent(io, socket, data));

        //접속해제 시 이벤트
        socket.on('disconnect', ()=>handleDisconnect(socket.id, userUUID));

    })
}

export default registerHandler;