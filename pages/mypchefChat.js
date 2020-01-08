/* eslint-disable react/no-array-index-key */
/* eslint-disable no-console */
import React from 'react';
import styled from 'styled-components';
// eslint-disable-next-line import/extensions
import io from 'socket.io-client';
import Router from 'next/router';

// mypchef 코드
// import loginCheck from '../../components/loginCheck';

// url 형식 및 메시지 데이터 형식
// /chat/receiver/:nick/
// msg={sender:nick, receiver: nick, data:~}

const chatUrl = 'localhost:4000/';

const Index = () => {
  const userInfo = React.useState({});
  const nick = React.useState('');
  const [nickInfo, setNickInfo] = React.useState({});
  const [socket, setSocket] = React.useState(null); // socket 설정
  const [text, setText] = React.useState(''); // 현재 사용자가 작성 중인 text 메시지
  const [msgs, setMsgs] = React.useState([]); // 이전 대화 정보

  //// mypchef 코드
  // 사용자 로그인 체크, 수신자의 nick 설정 이후, 이전 대화 불러오기
  // React.useEffect(() => {
  //   const setNickPromise = () => new Promise((resolve, reject) => {
  //     resolve(loginCheck(userInfo[1], nick), Router.query.nick);
  //     loginCheck(userInfo[1], nick);
  //     reject();
  //   });
  //   setNickPromise().then((any, tempReceiverNick) => {
  //     setNickInfo({ sender: nick[0], receiver: tempReceiverNick });
  //     // 이전 대화 정보 불러오기
  //     const preMsgs = []; // 백앤드로 쿼리
  //     if (preMsgs === []) {
  //       preMsgs.push({ sender: nick[0], receiver: tempReceiverNick, data: '어서오세요. 궁금한 내용이 있으시면 메시지를 남겨주세요.' });
  //     }
  //     setMsgs(preMsgs);
  //   }).catch(console.log('fail'));
  // }, []);

  // 테스트용 코드
  React.useEffect(() => {
    const setNickPromise = () => new Promise((resolve, reject) => {
      resolve({ sender: Router.query.senderNick, receiver: Router.query.nick });
      reject();
    });
    setNickPromise().then((nickInfo) => {
      console.log(`setNickInfo: ${nickInfo.sender} ${nickInfo.receiver}`);
      setNickInfo(nickInfo);
      // 이전 대화 정보 불러오기
    })
  }, []);

  // socket 형성
  React.useEffect(() => {
    const setSocketPromise = () => new Promise((resolve) => {
      resolve(io(chatUrl));
    });
    setSocketPromise().then((tempSocket) => {
      console.log(tempSocket);
      setSocket(tempSocket);
      tempSocket.emit('login', Router.query.senderNick);
      console.log(`login: ${Router.query.senderNick} `);
    });
  }, []);

  React.useEffect(() => {
    console.log(socket);
  }, [socket]);

  // 메시지 받기
  React.useEffect(() => {
    if (socket !== null) {
      socket.on('chat', (msg) => {
        const tempMsgs = [...msgs];
        tempMsgs.push(msg);
        setMsgs(tempMsgs);
      });
    }
  });

  //메시지 보내기
  const sendTextChat = () => {
    socket.emit('chat', { ...nickInfo, data: text });
    const emptyString = '';
    setText(emptyString);
    console.log({ ...nickInfo, data: text });
  };

  const SendTextButton = (props) => {
    const { text, onClick } = props;
    return (
      <div
        className="sendButton"
        style={{ opacity: text === '' ? '0.5' : '1', pointerEvents: text === '' ? 'none' : 'auto' }}
        onClick={onClick}
      >
        send
      </div>
    );
  };

  const MsgBox = (props) => {
    // eslint-disable-next-line react/prop-types
    if (typeof (props.msg.data) === 'string') {
      if (props.msg.sender === nickInfo.sender) {
        return (
          <MyMsgContainer>
            <div className="text">{props.msg.data}</div>
            <div className="name">{props.msg.sender}</div>
          </MyMsgContainer>
        );
      }
      return (
        <MsgContainer>
          <div className="text">{props.msg.data}</div>
          <div className="name">{props.msg.sender}</div>
        </MsgContainer>
      );
    }
    return '';
  };

  return (
    <Background>
      <SignBox>
        <div className="box" onClick={() => { window.location.href = '/'; }}>Logout</div>
      </SignBox>
      {
        msgs.map((msg, idx) => (
          <MsgBox key={idx} msg={msg} />
        ))
      }
      <input type="text" onChange={(e) => setText(e.target.value)} value={text} />
      <SendTextButton text={text} onClick={() => { sendTextChat(); }} />
    </Background>
  );
};

const Background = styled.div`
  position: relative;
  left: 50%; transform: translate(-50%, 0%);
  width: 100%; max-width: 24rem;
  height: 48rem;
  background-color: #000;
  display: flex;
  flex-direction: column;
  border: 2px solid #fff;
  input {
    position: fixed;
    bottom: 0.5rem;
    left: 0.5rem;
    background-color: transparent;
    border: 2px solid #fff;
    border-radius: 1rem;
    outline: none;
    padding: 0.5rem 0rem;
    text-align: left;
    width: calc(100% - 5rem);
    color: #ffffff;
    font-size: 1rem;
    height: 1rem;
    text-indent: 0.5rem;
  }
  .sendButton {
    position: fixed;
    bottom: 0.5rem;
    right: 0.5rem;
    background-color: transparent;
    border: 2px solid #fff;
    border-radius: 0.5rem;
    outline: none;
    text-align: center;
    width: 3rem;
    color: #ffffff;
    font-size: 1rem;
    height: 1rem;
    padding-top: 0.4rem;
    padding-bottom: 0.6rem;
    cursor: pointer;
  }
`;

const MsgContainer = styled.div`
  position: relative;
  width:100%;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  height:2rem;
  display: flex;
  flex-direction: row;
  .name {
    position: relative;
    left: 1.5rem;
    width: auto;
    height: 1rem;
    background-color: transparent;
    text-align: right;
    font-style: italic;
    color: #ffffff;
    font-size: 0.8rem;
    margin: 1rem 0rem;
  }
  .text {
    position: fixed;
    right: 0.5rem;
    background-color: transparent;
    border: 2px solid #fff;
    border-radius: 1rem;
    outline: none;
    padding-top: 0.4rem;
    padding-bottom: 0.6rem;
    text-align: left;
    width: calc(100% - 7rem);
    color: #ffffff;
    font-size: 1rem;
    height: 1rem;
    text-indent: 0.5rem;
    overflow: auto;
  }
`;

const MyMsgContainer = styled.div`
  position: relative;
  width:100%;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  height:2rem;
  display: flex;
  flex-direction: row;
  .name {
    position:fixed;
    right: 1.5rem;
    width: auto;
    height: 1rem;
    background-color: transparent;
    text-align: right;
    font-style: italic;
    color: #ffffff;
    font-size: 0.8rem;
    margin: 1rem 0rem;
  }
  .text {
    position: relative;
    left: 0.5rem;
    background-color: transparent;
    border: 2px solid #fff;
    border-radius: 1rem;
    outline: none;
    padding-top: 0.4rem;
    padding-bottom: 0.6rem;
    text-align: left;
    width: calc(100% - 7rem);
    color: #ffffff;
    font-size: 1rem;
    height: 1rem;
    text-indent: 0.5rem;
    overflow: auto;
  }
`;

const SignBox = styled.div`
  position: relative;
  width:100%;
  height: 2.5rem;
  display: flex;
  flex-direction: row;
  margin: 0.5rem 0rem;
  .box {
    position: relative;
    background-color: transparent;
    border: 2px solid #fff;
    border-radius: 1rem;
    outline: none;
    padding-top: 0.4rem;
    padding-bottom: 0.6rem;
    text-align: center;
    width: calc(50% - 2rem);
    color: #ffffff;
    font-size: 1rem;
    height: 1.5rem;
    margin: 0rem 2rem;
    padding-top:0.5rem;
    cursor: pointer;
  }
`;

export default Index;
