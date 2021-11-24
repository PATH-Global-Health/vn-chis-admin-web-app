import React, { useState, useEffect } from 'react';

import { Form, Select } from 'semantic-ui-react';
import { useSelector, useDispatch } from '@app/hooks';
import { getSiteTypes } from '@pqm/category/site-type/site-type.slice';
import { getProvinces } from '@pqm/category/province/province.slice';
import { getDistricts } from '@pqm/category/district/district.slice';
import { setFilter } from '@pqm/category/site/site.slice';
import { deburr } from '@app/utils/helpers';

interface Option {
  value: string;
  text: string;
}

const SiteFilter: React.FC = () => {
  const [siteTypeValue, setSiteTypeValue] = useState('');
  const [provinceValue, setProvinceValue] = useState('');
  const [districtValue, setDistrictValue] = useState('');

  const dispatch = useDispatch();
  const { filter } = useSelector((state) => state.pqm.category.site);
  const { siteTypeList, getSiteTypesLoading } = useSelector(
    (state) => state.pqm.category.siteType,
  );
  const { provinceList, getProvincesLoading } = useSelector(
    (state) => state.pqm.category.province,
  );
  const { districtList, getDistrictsLoading } = useSelector(
    (state) => state.pqm.category.district,
  );

  const search = (options: Option[], query: string) => {
    return (options || []).filter((option: Option) =>
      deburr(option?.text ?? '').includes(deburr(query)),
    );
  };

  useEffect(() => {
    if (provinceList.length === 0) {
      dispatch(getProvinces());
    }
    if (siteTypeList.length === 0) {
      dispatch(getSiteTypes());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);
  useEffect(() => {
    dispatch(getDistricts({ provinceCode: provinceValue }));
    dispatch(
      setFilter({
        ...filter,
        provinceCode: provinceValue,
        districtCode: '',
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provinceValue]);
  useEffect(() => {
    if (districtValue !== (filter?.districtCode ?? '')) {
      dispatch(
        setFilter({
          ...filter,
          districtCode: districtValue,
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [districtValue]);
  useEffect(() => {
    if (siteTypeValue !== (filter?.siteTypeId ?? '')) {
      dispatch(
        setFilter({
          ...filter,
          siteTypeId: siteTypeValue,
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteTypeValue]);

  return (
    <Form>
      <Form.Group widths="equal">
        <Form.Field
          deburr
          search={search}
          label="Tỉnh/Thành"
          loading={getProvincesLoading}
          control={Select}
          value={provinceValue}
          options={(provinceList || []).map((o) => ({
            text: o?.nameWithType ?? '',
            value: o?.code ?? '',
          }))}
          onChange={(__: any, { value }: any) => {
            setProvinceValue(value);
          }}
        />
        <Form.Field
          deburr
          clearable
          search={search}
          label="Quận/Huyện"
          loading={getDistrictsLoading}
          control={Select}
          value={districtValue}
          options={(districtList || []).map((o) => ({
            text: o?.nameWithType ?? '',
            value: o?.code ?? '',
          }))}
          onChange={(__: any, { value }: any) => {
            setDistrictValue(value);
          }}
        />
      </Form.Group>
      <Form.Group widths="equal">
        <Form.Field
          deburr
          clearable
          search={search}
          label="Loại cơ sở"
          loading={getSiteTypesLoading}
          control={Select}
          value={siteTypeValue}
          options={(siteTypeList || []).map((o) => ({
            text: o?.name ?? '',
            value: o?.id ?? '',
          }))}
          onChange={(__: any, { value }: any) => {
            setSiteTypeValue(value);
          }}
        />
      </Form.Group>
    </Form>
  );
};

export default SiteFilter;
