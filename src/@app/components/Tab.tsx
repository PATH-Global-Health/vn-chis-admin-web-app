import React, { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';

import { Dimmer, Loader, Menu } from 'semantic-ui-react';

const Wrapper = styled.div`
  width: 100%;
  position: relative;
`;

interface Props {
  loading?: boolean;
  items: Item[];
}

export interface Item {
  title: string;
  component: React.ReactNode;
}

const Tab: React.FC<Props> = (props) => {
  const { loading, items } = props;

  const [selected, setSelected] = useState<Item | undefined>(undefined);

  const tabListNode = useMemo(() => {
    return (
      <Menu pointing>
        {loading
          ? (
            <Wrapper>
              <Dimmer active inverted>
                <Loader />
              </Dimmer>
            </Wrapper>
          )
          : items.map((i) => (
            <Menu.Item
              key={`key_${i}`}
              active={Boolean(selected?.title && selected.title === i.title)}
              onClick={() => setSelected(i)}
            >
              {i.title}
            </Menu.Item>
          ))
        }
      </Menu>
    );
  }, [loading, items, selected])

  useEffect(() => {
    if (items.length > 0) {
      setSelected(items[0]);
    }
  }, [items]);

  return (
    <div>
      {tabListNode}
      {selected?.component ?? null}
    </div>
  );
};

export default Tab;