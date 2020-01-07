import React from 'react';
import styled from 'styled-components';
import io from 'socket.io-client'
import Axios from 'axios';

const backUrl = 'localhost:4000/'
var user = { name: 'first user', _id: '1111' };

const Index = () => {

  const [socket, setSocket] = React.useState(null);

  const tempSetSocket = async (backUrl) => {
    const tempSocket = await io(backUrl);
    setSocket(tempSocket);
  };
  const connectSocket = async (backUrl) => {
    const data = await tempSetSocket(backUrl);
    console.log(data);
    socket.emit('login', user);
  };

  React.useEffect(() => {
    connectSocket(backUrl);
  }, []);

  return (
    <>
      <div>ihihi</div>
      {console.log('hi', socket)}
      <div></div>
    </>
  );
};

const Background = styled.div`
  position: relative;
  left: 50%; transform: translate(-50%, 0%);
  width: 100%; max-width: 24rem;
  height: 48rem;
  background-color: #000000;
  display: flex;
  flex-direction: column;
`
export default Index;