import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Dropdown } from 'semantic-ui-react';

import { useDispatch, useSelector } from '@app/hooks';
import { getCategories } from '@news/category/category.slice';
import { BLANK_FIELD } from '@app/utils/constants';

const Wrapper = styled.div`
  & i.icon {
    display: none;
  }
  & .ui.labeled.icon.button {
    width: 100%;
    padding: 0.61111111em 0.61111111em !important;
  }
  & .ui.search.dropdown div.text {
    font-weight: bold;
  }
`;

interface Props {
  data?: string[];
  onChange: (value: string[]) => void;
}

const CategorySection: React.FC<Props> = ({ data, onChange }) => {
  const { categoryList, getCategoriesLoading } = useSelector(
    (state) => state.news.category,
  );
  const dispatch = useDispatch();

  const [value, setValue] = useState<string>('');

  useEffect(() => {
    if (categoryList.length === 0) {
      dispatch(getCategories());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (value) {
      onChange([value]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  useEffect(() => {
    if (data) {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const [_data] = data;
      setValue(_data);
    }
  }, [data]);

  return (
    <Wrapper>
      <Dropdown
        button
        floating
        labeled
        search
        loading={getCategoriesLoading}
        placeholder="Thể loại"
        className="icon"
        value={value}
        options={(categoryList || []).reduce(
          (_, o) => {
            return [
              ..._,
              {
                text: o?.description ?? '',
                value: o?.id ?? '',
              },
            ];
          },
          [{ text: BLANK_FIELD, value: '' }],
        )}
        onChange={(e: any, { value: v }: any) => {
          setValue(v);
        }}
      />
    </Wrapper>
  );
};

export default CategorySection;
