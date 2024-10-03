class PacketHeader{
    constructor(){
        constructor(handlerID, userId, clientVersion, payload) {
            this.handlerID = handlerID; //요청을 처리할 서버 핸들러의 ID
            this.userId = userId; //요청을 보내는 유저의 ID
            this.clientVersion = clientVersion; //현재 클라이언트 버전 (”1.0.0”) (고정)
            this.payload = payload; // JSON 데이터, 요청 내용
        }
    }
}