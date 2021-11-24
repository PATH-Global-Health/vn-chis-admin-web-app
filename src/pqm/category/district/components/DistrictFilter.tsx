import React, { useState, useEffect } from 'react';

import { Form, Select } from 'semantic-ui-react';
import { useSelector, useDispatch } from '@app/hooks';
import { getProvinces } from '@pqm/category/province/province.slice';
import { setFilter } from '@pqm/category/district/district.slice';
import { deburr } from '@app/utils/helpers';

interface Option {
  value: string;
  text: string;
}

const SiteFilter: React.FC = () => {
  const dispatch = useDispatch();
  const { provinceList, getProvincesLoading } = useSelector(
    (state) => state.pqm.category.province,
  );
  const { filter } = useSelector((state) => state.pqm.category.district);

  const [provinceValue, setProvinceValue] = useState('');

  const search = (options: Option[], query: string) => {
    return (options || []).filter((option: Option) =>
      deburr(option?.text ?? '').includes(deburr(query)),
    );
  };

  useEffect(() => {
    if (provinceList.length === 0) {
      dispatch(getProvinces());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);
  useEffect(() => {
    if (
      provinceValue !== '' &&
      provinceValue !== (filter?.provinceCode ?? '')
    ) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      dispatch(setFilter({ provinceCode: provinceValue }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provinceValue]);
  useEffect(() => {
    if ((filter?.provinceCode ?? '') !== '') {
      setProvinceValue(
        (provinceList || []).find(
          (o) => o.code === (filter?.provinceCode ?? ''),
        )?.code ?? '',
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);
  return (
    <Form loading={getProvincesLoading}>
      <Form.Group widths="equal">
        <Form.Field
          deburr
          search={search}
          clearable
          label="Tỉnh/Thành"
          control={Select}
          options={(provinceList || []).map((o) => ({
            text: o?.nameWithType ?? '',
            value: o?.code ?? '',
          }))}
          onChange={(el: any, { value }: any) => {
            setProvinceValue(value);
          }}
        />
      </Form.Group>
    </Form>
  );
};

export default SiteFilter;
