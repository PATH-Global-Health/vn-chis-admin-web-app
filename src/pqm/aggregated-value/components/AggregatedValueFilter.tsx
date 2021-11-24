import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import moment from 'moment';

import { FiFilter } from 'react-icons/fi';
import { Accordion, Form, Input, Select, Button } from 'semantic-ui-react';
import { useDispatch, useSelector } from '@app/hooks';
import { deburr } from '@app/utils/helpers';
import { getProvinces } from '@pqm/category/province/province.slice';
import { getDistricts } from '@pqm/category/district/district.slice';
import { getSites } from '@pqm/category/site/site.slice';
import { getIndicators } from '@pqm/category/indicator/indicator.slice';
import { getAgeGroups } from '@pqm/category/age-group/age-group.slice';
import { getKeyPopulations } from '@pqm/category/key-population/key-population.slice';
import { getGenders } from '@pqm/category/gender/gender.slice';
import { periodTypes } from '@pqm/aggregated-value/models';
import { setFilter } from '@pqm/aggregated-value/slices';

const Wrapper = styled.div`
  padding: 0 0 8px 0;
`;
const WrapperButton = styled.div`
  display: flex;
  flex-direction: row-reverse;
`;

const StyledAccordion = styled(Accordion)`
  box-shadow: none !important;
  .title {
    padding: 0 !important;
    .disabled {
      opacity: 1 !important;
    }
  }
  .content {
    border: 1px solid rgba(34, 36, 38, 0.15);
    border-top: none;
    border-bottom-right-radius: 0.25rem;
    border-bottom-left-radius: 0.25rem;
    padding: 8px !important;
    background: white;
  }
`;

// prettier-ignore
const quarters = [
  'Quí 1', 'Quí 2',
  'Quí 3', 'Quí 4',
];
// prettier-ignore
const months = [
  'Tháng 1', 'Tháng 2', 'Tháng 3',
  'Tháng 4', 'Tháng 5', 'Tháng 6',
  'Tháng 7', 'Tháng 8', 'Tháng 9',
  'Tháng 10', 'Tháng 11', 'Tháng 12',
];

const blankField = '--- Tất cả ---';

interface Option {
  value: string;
  text: string;
}

const AggregatedValueFilter: React.FC = () => {
  const { provinceList, getProvincesLoading } = useSelector(
    (state) => state.pqm.category.province,
  );
  const { districtList, getDistrictsLoading } = useSelector(
    (state) => state.pqm.category.district,
  );
  const { siteList, getSitesLoading } = useSelector(
    (state) => state.pqm.category.site,
  );

  const { indicatorList, getIndicatorsLoading } = useSelector(
    (state) => state.pqm.category.indicator,
  );
  const { ageGroupList, getAgeGroupsLoading } = useSelector(
    (state) => state.pqm.category.ageGroup,
  );
  const { keyPopulationList, getKeyPopulationsLoading } = useSelector(
    (state) => state.pqm.category.keyPopulation,
  );
  const { genderList, getGendersLoading } = useSelector(
    (state) => state.pqm.category.gender,
  );

  const dispatch = useDispatch();

  const [expanded, setExpanded] = useState(false);

  const [periodValue, setPeriodValue] = useState('');
  const [yearValue, setYearValue] = useState('');
  const [quarterValue, setQuarterValue] = useState('');
  const [monthValue, setMonthValue] = useState('');

  const [provinceValue, setProvinceValue] = useState('');
  const [districtValue, setDistrictValue] = useState('');
  const [siteValue, setSiteValue] = useState('');

  const [indicatorValue, setIndicatorValue] = useState('');
  const [ageGroupValue, setAgeGroupValue] = useState('');
  const [keyPopulationValue, setKeyPopuplationValue] = useState('');
  const [genderValue, setGenderValue] = useState('');

  const search = (options: Option[], query: string) => {
    return (options || []).filter((option: Option) =>
      deburr(option?.text ?? '').includes(deburr(query)),
    );
  };

  const filter = (p?: any) => {
    dispatch(
      setFilter(
        p || {
          period: periodValue || '',
          year: yearValue || '',
          quarter: quarterValue || '',
          month: monthValue || '',
          provinceId: provinceValue || '',
          districtId: districtValue || '',
          siteId: siteValue || '',
          indicatorId: indicatorValue || '',
          ageGroupId: ageGroupValue || '',
          keyPopulationId: keyPopulationValue || '',
          genderId: genderValue || '',
        },
      ),
    );
  };

  const reset = () => {
    setPeriodValue('');
    setQuarterValue('');
    setYearValue('');
    setMonthValue('');
    setProvinceValue('');
    setDistrictValue('');
    setSiteValue('');
    setIndicatorValue('');
    setAgeGroupValue('');
    setKeyPopuplationValue('');
    setGenderValue('');

    filter({});
  };

  useEffect(() => {
    if (provinceList.length === 0) {
      dispatch(getProvinces());
    }
    if (indicatorList.length === 0) {
      dispatch(getIndicators());
    }
    if (ageGroupList.length === 0) {
      dispatch(getAgeGroups());
    }
    if (keyPopulationList.length === 0) {
      dispatch(getKeyPopulations());
    }
    if (genderList.length === 0) {
      dispatch(getGenders());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);
  useEffect(() => {
    if (provinceValue !== '') {
      const provinceCode =
        (provinceList || []).find((o) => (o?.id ?? '') === provinceValue)
          ?.code ?? '';
      dispatch(getDistricts({ provinceCode }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provinceValue]);
  useEffect(() => {
    if (districtValue !== '') {
      dispatch(getSites({ districtId: districtValue }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [districtValue]);

  return (
    <Wrapper>
      <StyledAccordion fluid>
        <Accordion.Title active={expanded}>
          <Input
            fluid
            disabled
            size="small"
            label={{
              basic: true,
              content: <FiFilter />,
              onClick: (): void => setExpanded((e) => !e),
            }}
          />
        </Accordion.Title>
        <Accordion.Content active={expanded}>
          <Form>
            <Form.Group widths="equal">
              <Form.Field
                control={Select}
                label="Chu kì"
                options={Object.keys(periodTypes || {}).reduce(
                  (array, key) => [
                    ...array,
                    {
                      value: key,
                      text: periodTypes[key],
                    },
                  ],
                  [
                    {
                      value: '',
                      text: blankField,
                    },
                  ],
                )}
                value={periodValue || ''}
                onChange={(e: any, { value }: any) => {
                  setPeriodValue(value);
                }}
              />
              <Form.Field
                control={Select}
                label="Năm"
                options={[-3, -2, -1, 0].reduce(
                  (array, key) => {
                    const time = moment().add(key, 'year').format('YYYY');
                    return [
                      ...array,
                      {
                        value: time,
                        text: `Năm ${time}`,
                      },
                    ];
                  },
                  [
                    {
                      value: '',
                      text: blankField,
                    },
                  ],
                )}
                value={yearValue || ''}
                onChange={(e: any, { value }: any) => {
                  setYearValue(value);
                }}
              />
              <Form.Field
                control={Select}
                label="Quí"
                options={(quarters || []).reduce(
                  (array, key, index) => [
                    ...array,
                    {
                      value: `${index + 1}`,
                      text: quarters[index],
                    },
                  ],
                  [
                    {
                      value: '',
                      text: blankField,
                    },
                  ],
                )}
                value={quarterValue || ''}
                onChange={(e: any, { value }: any) => {
                  setQuarterValue(value);
                }}
              />
              <Form.Field
                control={Select}
                label="Tháng"
                options={(months || []).reduce(
                  (array, key, index) => [
                    ...array,
                    {
                      value: `${index + 1}`,
                      text: months[index],
                    },
                  ],
                  [
                    {
                      value: '',
                      text: blankField,
                    },
                  ],
                )}
                value={monthValue || ''}
                onChange={(e: any, { value }: any) => {
                  setMonthValue(value);
                }}
              />
            </Form.Group>
            <Form.Group widths="equal">
              <Form.Field
                search={search}
                control={Select}
                label="Tỉnh/Thành"
                loading={getProvincesLoading}
                options={(provinceList || []).reduce(
                  (array, object) => [
                    ...array,
                    {
                      value: object?.id ?? '',
                      text: object?.nameWithType ?? '',
                    },
                  ],
                  [
                    {
                      value: '',
                      text: blankField,
                    },
                  ],
                )}
                value={provinceValue || ''}
                onChange={(e: any, { value }: any) => {
                  setProvinceValue(value);
                }}
              />
              <Form.Field
                search={search}
                control={Select}
                label="Quận/Huyện"
                loading={getDistrictsLoading}
                options={(districtList || []).reduce(
                  (array, object) => [
                    ...array,
                    {
                      value: object?.id ?? '',
                      text: object?.nameWithType ?? '',
                    },
                  ],
                  [
                    {
                      value: '',
                      text: blankField,
                    },
                  ],
                )}
                value={districtValue || ''}
                onChange={(e: any, { value }: any) => {
                  setDistrictValue(value);
                }}
              />
              <Form.Field
                search={search}
                control={Select}
                label="Cơ sở"
                loading={getSitesLoading}
                options={(siteList || []).reduce(
                  (array, object) => [
                    ...array,
                    {
                      value: object?.id ?? '',
                      text: object?.name ?? '',
                    },
                  ],
                  [
                    {
                      value: '',
                      text: blankField,
                    },
                  ],
                )}
                value={siteValue || ''}
                onChange={(e: any, { value }: any) => {
                  setSiteValue(value);
                }}
              />
            </Form.Group>
            <Form.Group widths="equal">
              <Form.Field
                search={search}
                control={Select}
                label="Chỉ số"
                loading={getIndicatorsLoading}
                options={(indicatorList || []).reduce(
                  (array, object) => [
                    ...array,
                    {
                      value: object?.id ?? '',
                      text: object?.name ?? '',
                    },
                  ],
                  [
                    {
                      value: '',
                      text: blankField,
                    },
                  ],
                )}
                value={indicatorValue || ''}
                onChange={(e: any, { value }: any) => {
                  setIndicatorValue(value);
                }}
              />
              <Form.Field
                search={search}
                control={Select}
                label="Nhóm tuổi"
                loading={getAgeGroupsLoading}
                options={(ageGroupList || []).reduce(
                  (array, object) => [
                    ...array,
                    {
                      value: object?.id ?? '',
                      text: object?.name ?? '',
                    },
                  ],
                  [
                    {
                      value: '',
                      text: blankField,
                    },
                  ],
                )}
                value={ageGroupValue || ''}
                onChange={(e: any, { value }: any) => {
                  setAgeGroupValue(value);
                }}
              />
              <Form.Field
                search={search}
                control={Select}
                label="Nhóm nguy cơ"
                loading={getKeyPopulationsLoading}
                options={(keyPopulationList || []).reduce(
                  (array, object) => [
                    ...array,
                    {
                      value: object?.id ?? '',
                      text: object?.name ?? '',
                    },
                  ],
                  [
                    {
                      value: '',
                      text: blankField,
                    },
                  ],
                )}
                value={keyPopulationValue || ''}
                onChange={(e: any, { value }: any) => {
                  setKeyPopuplationValue(value);
                }}
              />
              <Form.Field
                search={search}
                control={Select}
                label="Giới tính"
                loading={getGendersLoading}
                options={(genderList || []).reduce(
                  (array, object) => [
                    ...array,
                    {
                      value: object?.id ?? '',
                      text: object?.name ?? '',
                    },
                  ],
                  [
                    {
                      value: '',
                      text: blankField,
                    },
                  ],
                )}
                value={genderValue || ''}
                onChange={(e: any, { value }: any) => {
                  setGenderValue(value);
                }}
              />
            </Form.Group>
            <WrapperButton>
              <Button onClick={() => reset()}>Đặt lại</Button>
              <Button primary onClick={() => filter()}>
                Lọc
              </Button>
            </WrapperButton>
          </Form>
        </Accordion.Content>
      </StyledAccordion>
    </Wrapper>
  );
};

export default AggregatedValueFilter;
