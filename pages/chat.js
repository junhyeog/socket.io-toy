import React from 'react';
import styled from 'styled-components';
import io from 'socket.io-client'
import Axios from 'axios';
import Router from 'next/router';

const backUrl = 'localhost:4000/'

const Index = () => {

  const [socket, setSocket] = React.useState(null);
  const [user, setUser] = React.useState({ name: 'first user' });
  const [msg, setMsg] = React.useState('');
  const [msgSet, setMsgSet] = React.useState([]);

  React.useEffect(() => {
    // setSocket(io(backUrl));
    setUser({ ...user, name: Router.query.name });
    setSocketPromise().then(function (socket) {
      console.log(socket);
      setSocket(socket);
      sendLogin(socket, { name: Router.query.name });
      console.log(`${Router.query.name}으로 로그인하였습니다.`);
    });
  }, []);

  const setSocketPromise = () => {
    return new Promise(function (resolve, reject) {
      resolve(io(backUrl));
    })
  };

  React.useEffect(() => {
    console.log(socket);
  }, [socket]);

  React.useEffect(() => {
    if (socket === null) {
      return;
    } else {
      socket.on('chat', (data) => {
        const tempSet = [...msgSet];
        tempSet.push(data);
        setMsgSet(tempSet);
      });
    }
  });

  const sendChat = (msg) => {
    const data = { name: user.name, msg: msg };
    socket.emit('chat', data);
    console.log(msg);
    const emptyString = '';
    setMsg(emptyString);
  };




  const sendLogin = (socket, user) => {
    const data = { name: user.name };
    socket.emit('login', user);
  };

  const SendButton = (props) => {
    return (
      <div className='sendButton' style={{ opacity: props.msg === '' ? "0.5" : "1", pointerEvents: props.msg === '' ? "none" : "auto" }} onClick={props.onClick} value={props.value}>
        send
      </div>
    );
  };

  const MsgBox = (props) => {
    return (
      <MsgContainer>
        <div className='text'>{props.msg}</div>
        <div className='name'>{props.name}</div>
      </MsgContainer>
    );
  };

  return (
    <Background>
      <SignBox>
        <div className="box" onClick={(e) => { sendLogin(socket, user); }}>Login</div>
        <div className="box" onClick={() => { window.location.href = '/' }}>Logout</div>
      </SignBox>
      {
        msgSet.map((msg, idx) => {
          return (
            <MsgBox key={idx} name={msg.name} msg={msg.msg}></MsgBox>
          );
        })
      }
      <input type='text' onChange={(e) => setMsg(e.target.value)} value={msg}></input>
      <SendButton msg={msg} onClick={() => { sendChat(msg); }}></SendButton>
    </Background >
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
`

const MsgContainer = styled.div`
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
`

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
`

export default Index;
