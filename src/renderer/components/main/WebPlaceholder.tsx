import React from 'react';
import { useEffect } from 'react';
import styled from 'styled-components';
import webpageSvg from '../../assets/web-page.svg';
import { AddWebsiteBtn } from '../AddWebsiteBtn';

const WebPlaceholderRoot = styled.div`
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

export const WebPlaceholder: React.FC = React.memo(() => {
  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('hide-all-webview');
  }, []);

  return (
    <WebPlaceholderRoot>
      <div>
        <img src={webpageSvg} />
      </div>
      <div>Please Select Any Page on Left</div>
      <div>
        <small>OR</small>
      </div>
      <div>
        <AddWebsiteBtn />
      </div>
    </WebPlaceholderRoot>
  );
});
WebPlaceholder.displayName = 'WebPlaceholder';
