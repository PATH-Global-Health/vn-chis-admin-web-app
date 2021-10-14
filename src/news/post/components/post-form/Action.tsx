import React from 'react';
import styled from 'styled-components';
import { Popup, Button } from 'semantic-ui-react';

const IconButtonWrapper = styled.span`
  margin-left: 4px !important;
`;

const IconButton = styled(Button)`
  padding: 8px !important;
  line-height: 0 !important;
  margin-right: 0 !important;
`;

interface Props {
  icon: JSX.Element;
  title?: string;
  color?: string;
  onClick?: () => void;
}

const Action: React.FC<Props> = (props) => {
  // eslint-disable-next-line
  const {
    icon,
    title = '',
    color = 'rainbow',
    onClick,
  } = props;

  return (
    <Popup
      pinned
      inverted
      size="tiny"
      content={title}
      position="bottom center"
      trigger={
        <IconButtonWrapper>
          <IconButton
            basic
            icon={icon}
            color={color}
            onClick={(e: React.MouseEvent): void => {
              e.stopPropagation();
              if (typeof onClick === 'function') {
                onClick();
              }
            }}
          />
        </IconButtonWrapper>
      }
    />
  );
};

export default Action;
