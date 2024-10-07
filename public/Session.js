import { Packet } from '/Packet.js';
import { CLIENT_VERSION } from './Constants.js';
import { assetManager } from './AssetManager.js';
import { itemDrawer } from './ItemDrawer.js';

/*---------------------------------------------
    [Session 생성자]
    domain: http://localhost
    port:3000

    [주의사항] 
        :(colon) 빼고 http://localhost까지만 쓰기
---------------------------------------------*/
class Session {
  constructor(domain, port) {
    this.socket = io(`${domain}:${port}`, {
      query: {
        clientVersion: CLIENT_VERSION,
      },
    });
    
    this.userId = null;
    this.tmpCurrentStageIndex = 0; //추후에 redis사용하기
    this.Init();
  }

/*---------------------------------------------
    [소켓 이벤트 설정]
    1. response: 
        helper::handleEvent()에서 이벤트 처리 결과(status)를 보내는 이벤트
    2. connection:
        클라이언트가 서버와 성공적으로 연결된 이벤트
    3. init:
        클라가 서버와 연결될 때, GameAssets을 보내주는 이벤트
---------------------------------------------*/
  Init() {
    // 이벤트 결과
    this.socket.on('response', (data) => {
      console.log('Server response:', data);
    });

    // 클라이언트가 서버와 연결될 때
    this.socket.on('connection', (data) => {
      console.log('connection: ', data);
      this.userId = data.uuid; // 서버에서 받은 UUID 저장
    });

    // GameAssets받기
    this.socket.on('init', async (gameAssets) => {
      assetManager.setGameAssetsAndInit(gameAssets);

      //itemDrawer에 아이템 정보 할당하기
      await itemDrawer.init();
    });
  }

/*-------------------------------------------------------------
    [패킷 전송]
    Packet(패킷ID, 유저ID, 클라이언트 버전, 내용)
-------------------------------------------------------------*/
  sendEvent(packetId, payload) {
    this.socket.emit('event', new Packet(packetId, this.userId, CLIENT_VERSION, payload));
  }
}

export const session = new Session("http://13.209.99.73:3000/", 3000);
