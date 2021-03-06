import React from 'react';
import { Container } from 'next/app';
import Head from 'next/head';
import { createGlobalStyle } from 'styled-components'


const Layout = ({ Component }) => {
  return (
    <Container>
      <Head>
        <title>chat app</title>
      </Head>
      <Component />
      <GlobalStyle />
    </Container>);
}

export default Layout;

const GlobalStyle = createGlobalStyle`
  body {
        margin: 0px;
        font-size: 16px;
    }
  `
