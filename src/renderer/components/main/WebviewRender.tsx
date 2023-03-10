import React, { useEffect, useRef } from 'react';
import { WebsiteTreeNode } from '../../store/tree';

export const WebviewRender: React.FC<{ node: WebsiteTreeNode }> = React.memo(
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
    }, [node.key, node.url]);

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
            key: node.key,
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
