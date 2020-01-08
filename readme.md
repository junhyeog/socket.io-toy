# Socket.io Toy chat app

## run
### server
```
npm run start
```
### client
```
npm run dev
```

### Usage
- from에 자신의 nick 입력 / to에 수신자의 nick 입력
- 메시지 전송
  - db에 수신자의 정보가 있다(수신자가 접속한 상태).
    - 수신자와 자신 모두에게 메시지 전송
  - 수신자의 정보가 없다.
    - 자신에게만 메시지 전송
