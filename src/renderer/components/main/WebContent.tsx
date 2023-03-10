import { Input } from '@arco-design/web-react';
import React from 'react';
import styled from 'styled-components';
import { useTreeStore } from '../../store/tree';
import { isValidUrl } from '../../utils';
import { useEditValue } from '../../utils/hooks/useEditValue';
import { WebInvalidUrl } from './WebInvalidUrl';
import { WebPlaceholder } from './WebPlaceholder';
import { WebviewRender } from './WebviewRender';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

  > .title {
    display: flex;
    flex-direction: row;
  }

  > .main {
    flex: 1;
  }
`;

export const WebContent: React.FC = React.memo(() => {
  const selectedNode = useTreeStore((state) => state.selectedNode);
  const [title, setTitle, onTitleBlur] = useEditValue<string>(
    selectedNode?.title ?? '',
    (val) => useTreeStore.getState().patchSelectedNode('title', val ?? '')
  );
  const [url, setUrl, onUrlBlur] = useEditValue(
    selectedNode?.url ?? '',
    (val) => useTreeStore.getState().patchSelectedNode('url', val ?? '')
  );

  if (!selectedNode) {
    return <WebPlaceholder />;
  }

  return (
    <Root>
      <div className="title">
        <Input
          placeholder="Title"
          value={title}
          onChange={setTitle}
          onBlur={onTitleBlur}
          onPressEnter={onTitleBlur}
        />
        <Input
          placeholder="Url"
          value={url}
          onChange={setUrl}
          onBlur={onUrlBlur}
          onPressEnter={onUrlBlur}
        />
      </div>
      <div className="main">
        {isValidUrl(selectedNode.url) ? (
          <WebviewRender node={selectedNode} />
        ) : (
          <WebInvalidUrl />
        )}
      </div>
    </Root>
  );
});
WebContent.displayName = 'WebContent';
