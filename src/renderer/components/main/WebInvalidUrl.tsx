import React from 'react';
import { useEffect } from 'react';
import styled from 'styled-components';
import webpageSvg from '../../assets/web-page.svg';

const WebInvalidUrlRoot = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  flex-direction: column;

  img {
    width: 120px;
  }
`;

export const WebInvalidUrl: React.FC = React.memo(() => {
  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('hide-all-webview');
  }, []);

  return (
    <WebInvalidUrlRoot>
      <div>
        <img src={webpageSvg} />
      </div>
      <div>Please input valid url to load Url</div>
    </WebInvalidUrlRoot>
  );
});
WebInvalidUrl.displayName = 'WebInvalidUrl';
