import React, { useState } from 'react';
import styled from 'styled-components';

import { Segment, Menu, Popup, Icon } from 'semantic-ui-react';

const Wrapper = styled.div`
  margin-bottom: 16px;
`;
const IconMenuItem = styled(Menu.Item)`
  font-size: 1.2em;
  padding: 0.4em 0.6em !important;
`;
const TitleMenuItem = styled(Menu.Item)`
  font-size: 1.2em;
  padding: 0.7em 0.9em !important;
  &::before {
    background: none !important;
  }
`;

const StyledSegment = styled(Segment)`
  margin-top: 0 !important;
  word-break: break-all;
  overflow: auto;
  max-height: 600px;
`;
const JSONWrapper = styled.div`
  font-size: 0.8rem !important;
  pre {
    margin: 0 !important;
  }
`;

interface Props {
  title: string;
  content: string;
}

const DetailSegment: React.FC<Props> = (props) => {
  const { title, content } = props;

  const [expand, setExpand] = useState(false);

  const copyToClipboard = (): void => {
    const textField = document.createElement('textarea');
    textField.innerText = content;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand('copy');
    textField.remove();
  };

  return (
    <Wrapper>
      <Menu icon size="small" attached="top">
        <IconMenuItem active={expand}>
          <Icon
            name={expand ? 'angle down' : 'angle right'}
            onClick={() => setExpand(!expand)}
          />
        </IconMenuItem>
        <TitleMenuItem>
          <strong>{title}</strong>
        </TitleMenuItem>
        <Menu.Item position="right">
          <Popup
            pinned
            inverted
            size="tiny"
            content="Copy dữ liệu"
            position="bottom center"
            trigger={<Icon name="copy" onClick={() => copyToClipboard()} />}
          />
        </Menu.Item>
      </Menu>
      {expand && (
        <StyledSegment small="true" attached="bottom">
          <JSONWrapper>
            <pre>{JSON.stringify(content, null, 2)}</pre>
          </JSONWrapper>
        </StyledSegment>
      )}
    </Wrapper>
  );
};

export default DetailSegment;
