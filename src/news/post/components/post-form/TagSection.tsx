import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import { Menu, Label, Icon, Dropdown } from 'semantic-ui-react';

import { useDispatch, useSelector } from '@app/hooks';
import { getTags } from '@news/tag/tag.slice';

const Wrapper = styled.div`
  & .ui.menu {
    box-shadow: none;
  }
  & .item {
    padding-top: 0.4rem !important;
    padding-bottom: 0.4rem !important;
  }
  & .header {
    font-size: 0.9rem !important;
    padding-left: 0.8rem !important;
    padding-right: 0.8rem !important;
  }
  & .content {
    padding-left: 0.6rem !important;
    padding-right: 0.6rem !important;

    &::before {
      background-color: white !important;
    }

    & .dropdown {
      min-height: 0 !important;
      &--custom {
        font-size: 1rem !important;
      }
    }
  }
  & .label {
    margin-left: 0 !important;
    margin-right: 0.4rem;
    padding: 0.5rem !important;
    font-size: 14px !important;
    & .plus.icon {
      cursor: pointer;
      margin-right: 0em;
      font-size: 0.94444444em;
      opacity: 0.5;
      transition: background 0.1s ease;

      &:hover {
        opacity: 1;
      }
    }
  }
`;

interface Props {
  data?: string[];
  onChange: (data: string[]) => void;
}

const Tag: React.FC<Props> = ({ data, onChange }) => {
  const { tagList, getTagsLoading } = useSelector(
    (state) => state.news.tag,
  );
  const dispatch = useDispatch();

  const [selectedTags, setSeletectedTags] = useState<string[]>([]);

  useEffect(() => {
    if (tagList.length === 0) {
      dispatch(getTags());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);
  useEffect(() => {
    if (data) {
      setSeletectedTags(data);
    }
  }, [data]);
  useEffect(() => {
    if (!data || JSON.stringify(data) !== JSON.stringify(selectedTags)) {
      onChange(selectedTags);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTags]);

  return (
    <Wrapper>
      <Menu icon size="small">
        <Menu.Item className="header">Nhãn</Menu.Item>
        <Menu.Item className="content">
          {(selectedTags || []).map((s) => (
            <Label>
              {tagList.find((o) => o.id === s)?.description ?? ''}
              <Icon
                name="delete"
                onClick={(): void => {
                  setSeletectedTags(
                    (selectedTags || []).filter((_s) => _s !== s),
                  );
                }}
              />
            </Label>
          ))}
          <Label>
            <Dropdown icon="plus" loading={getTagsLoading}>
              <Dropdown.Menu className="dropdown--custom">
                {(tagList || [])
                  .filter((o) => !(selectedTags || []).includes(o.id))
                  .map((o, index) => (
                    <Dropdown.Item
                      key={`tag_${index}`}
                      text={o?.description ?? ''}
                      onClick={(): void => {
                        setSeletectedTags([...selectedTags, o.id]);
                      }}
                    />
                  ))}
              </Dropdown.Menu>
            </Dropdown>
          </Label>
        </Menu.Item>
      </Menu>
    </Wrapper>
  );
};

export default Tag;
