import { CLIENT_VERSION  } from "../constants.js";
import { getGameAssets } from "../init/assets.js";
import { createStage, getStage, setStage } from "../models/stage.model.js";
import { getUser, removeUser } from "../models/user.model.js"
import handlerMappings from "./handlerMapping.js";

export const handleConnection = (socket, uuid) =>{
    console.log(`User Connected: ${uuid} with SocketID ${socket.id}`);
    console.log("Current User:", getUser());

    createStage(uuid);

    socket.emit(`connection`, {uuid});
}

export const handleDisconnect = (socketID, uuid)=> {
    
    removeUser(socketID);
    console.log(`User disconnected: ${socketID}`);
    console.log("Current User: ", getUser());
}

//스테이지에 따라서 더 높은 점수 획득

export const handlerEvent = (io, socket, data) =>{
    if(!CLIENT_VERSION .includes(data.clinetVersion)){
        socket.emit('responese', {status: 'fail', message: "Client version mismatch"});
    }

    const handler = handlerMappings[data.handlerId];
    if(!handler) {
        console.log("data: ", data);
        socket.emit('response', {status: 'fail', message:"Handler not found"});
        return;
    }

    const response = handler(data.userId, data.payload);

    // if(response.broadcast){
    //     io.emit('response', 'broadcast');
    //     return;
    // }
    socket.emit('response', response)
}
