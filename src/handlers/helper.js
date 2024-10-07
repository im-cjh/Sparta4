import { CLIENT_VERSION  } from "../constants.js";
import { stageManager } from "../models/stage.model.js";
import { userManager } from "../models/user.model.js"
import handlerMappings from "./handlerMapping.js";

export const handleConnection = (socket, uuid) =>{
    console.log(`User Connected: ${uuid} with SocketID ${socket.id}`);
    console.log("Current User:", userManager.getUser());

    stageManager.createStage(uuid);

    socket.emit(`connection`, {uuid});
}

export const handleDisconnect = (socketID, uuid)=> {
    
    userManager.removeUser(socketID);
    console.log(`User disconnected: ${socketID}`);
    console.log("Current User: ", userManager.getUser());
}

//스테이지에 따라서 더 높은 점수 획득

export const handlerEvent = (io, socket, data) =>{
    if(!CLIENT_VERSION .includes(data.clinetVersion)){
        socket.emit('responese', {status: 'fail', message: "Client version mismatch"});
    }

    console.log(data);
    const handler = handlerMappings[data.packetId];
    if(!handler) {
        console.log("data.packetId: ", data.packetId);
        socket.emit('response', {status: 'fail', message:"Handler not found"});
        return;
    }

    const response = handler(data.userId, data.payload);
    socket.emit('response', response)
}
