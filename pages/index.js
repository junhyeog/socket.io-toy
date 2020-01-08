import React from 'react';
import io from 'socket.io-client';
import styled from 'styled-components';
import Link from 'next/link';

const Index = () => {
  const [senderNick, setSenderNick] = React.useState('');
  const [nick, setNick] = React.useState('');

  const Button = (props) => {
    return (
      <div className="text" onClick={() => { setNick(''); setSenderNick(''); window.location.href = `/mypchefChat?senderNick=${senderNick}&nick=${nick}` }} style={{ display: props.nick === "" ? 'none' : 'block' }
      }>
        start with <span style={{ color: '#756ee8' }}>{props.nick}</span>?
      </div >
    );
  };

  return (
    <Background>
      <div className='title'>
        From
      </div>
      <input type='text' maxLength="8" onChange={(e) => { setSenderNick(e.target.value); }} value={senderNick}></input>
      <div className='title'>
        to
      </div>
      <input type='text' maxLength="8" onChange={(e) => { setNick(e.target.value); }} value={nick}></input>
      <Button nick={senderNick} ></Button>
    </Background >);
};


const Background = styled.div`
  position: relative;
  left: 50%; transform: translate(-50%, 0%);
  width: 100%; max-width: 24rem;
  height: 48rem;
  background-color: #000000;
  display: flex;
  flex-direction: column;
  .title {
    font-size: 2rem;
    color: #ffffff;
    position: relative;
    margin-top: 30%;
    width: 100%;
    height: auto;
    text-align: center;
    margin-bottom: 20%;
  }
  input {
    position: relative;
    left: 10%;
    background-color: transparent;
    border: none;
    border-bottom: 2px solid #fff;
    outline: none;
    padding-bottom: 15px;
    text-align: center;
    width: 80%;
    color: #ffffff;
    font-size: 1rem;
  }
  .text {
    position: relative;
    left: 20%;
    background-color: transparent;
    border: 2px solid #fff;
    outline: none;
    padding-bottom: 15px;
    text-align: center;
    width: 60%;
    color: #ffffff;
    font-size: 1rem;
    height: 1.5rem;
    padding-top: 0.5rem;
    margin-top: 20%;
    cursor: pointer;
  }
`
export default Index;
