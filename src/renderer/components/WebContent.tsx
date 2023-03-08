import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useTreeStore, WebsiteTreeNode } from '../store/tree';
import webpageSvg from '../assets/web-page.svg';
import { AddWebsiteBtn } from './AddWebsiteBtn';

const WebviewRender: React.FC<{ node: WebsiteTreeNode }> = React.memo(
  (props) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const node = props.node;

    useEffect(() => {
      if (!containerRef.current) {
        return;
      }

      const rect = containerRef.current.getBoundingClientRect();

      window.electron.ipcRenderer.sendMessage('mount-webview', {
        key: node.key,
        url: node.url,
        rect: {
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: rect.height,
        },
      });
    }, [node.key]);

    useEffect(() => {
      if (!containerRef.current) {
        return;
      }

      const resizeObserver = new ResizeObserver((entries) => {
        entries.forEach((entry) => {
          const { target } = entry;
          if (!target.parentElement) {
            return;
          }

          const rect = target.getBoundingClientRect();

          window.electron.ipcRenderer.sendMessage('update-webview-rect', {
            rect: {
              x: rect.x,
              y: rect.y,
              width: rect.width,
              height: rect.height,
            },
          });
        });
      });

      resizeObserver.observe(containerRef.current);

      return () => {
        if (containerRef.current) {
          resizeObserver.unobserve(containerRef.current);
        }
      };
    }, [node.key]);

    return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
  }
);
WebviewRender.displayName = 'WebviewRender';

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

const WebPlaceholder: React.FC = React.memo(() => {
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

export const WebContent: React.FC = React.memo(() => {
  const selectedNode = useTreeStore((state) => state.selectedNode);

  if (!selectedNode) {
    return <WebPlaceholder />;
  }

  return <WebviewRender node={selectedNode} />;
});
WebContent.displayName = 'WebContent';
