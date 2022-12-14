import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';

import { Controller, useForm } from 'react-hook-form';

import { Modal, Form, Select, Input } from 'semantic-ui-react';

import { useSelector, useDispatch, useFetchApi } from '@app/hooks';
import { toSlug } from '@app/utils/helpers';
import { getProvinces } from '@pqm/category/province/province.slice';
import { provinceType } from '@pqm/category/province/province.model';
import {
  DistrictCM,
  districtType,
} from '@pqm/category/district/district.model';
import districtService from '@pqm/category/district/district.service';

interface Props {
  open: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

const StyledFormGroup = styled(Form.Group)`
  & .field {
    opacity: 1 !important;
    & label {
      opacity: 1 !important;
    }
    & div {
      opacity: 1 !important;
    }
  }
`;

const CreateModal: React.FC<Props> = ({ open, onClose, onRefresh }) => {
  const { provinceList } = useSelector((state) => state.pqm.category.province);
  const { filter } = useSelector((state) => state.pqm.category.district);
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { control, getValues, setValue } = useForm<DistrictCM>({
    defaultValues: {
      parentCode: filter?.provinceCode ?? '',
      type: Object.keys(districtType)[0] || '',
    },
  });
  const { fetch, fetching } = useFetchApi();
  const dispatch = useDispatch();

  const [validation, setValidation] = useState(false);

  const handleValidation = useCallback(() => {
    let flag = false;
    const d = getValues();
    if ((d?.code ?? '') !== '' && (d?.name ?? '') !== '') {
      flag = true;
    }
    setValidation(flag);
  }, [getValues]);
  const handleChange = useCallback(() => {
    const d = getValues();
    const p = (provinceList || []).find(
      (o) => o.code === (filter?.provinceCode ?? ''),
    );
    if (d.name !== '') {
      setValue('nameWithType', `${districtType[d.type] || ''} ${d.name}`);
      setValue('path', `${d.name}${p ? `, ${p.name}` : ''}`);
      setValue(
        'pathWithType',
        `${districtType[d.type] || ''} ${d.name}${
          p ? `, ${provinceType[p.type] || ''} ${p.name}` : ''
        }`,
      );
      setValue('slug', toSlug(d.name));
    }
  }, [filter, provinceList, getValues, setValue]);
  const handleConfirm = useCallback(async () => {
    if (validation) {
      await fetch(
        districtService.createDistrict({
          ...getValues(),
          parentCode: filter?.provinceCode ?? '',
        }),
      );
      onRefresh();
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetch, validation, getValues, onClose, onRefresh]);

  useEffect(() => {
    if (provinceList.length === 0) {
      dispatch(getProvinces());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>T???o m???i</Modal.Header>
      <Modal.Content>
        <Form>
          <StyledFormGroup widths="equal">
            <Controller
              name="parentCode"
              control={control}
              render={() => (
                <Form.Field
                  deburr
                  disabled
                  label="T???nh/Th??nh"
                  value={filter?.provinceCode ?? ''}
                  control={Select}
                  options={(provinceList || []).map((o) => ({
                    text: o?.name ?? '',
                    value: o?.code ?? '',
                  }))}
                />
              )}
            />
          </StyledFormGroup>
          <Form.Group widths="equal">
            <Controller
              name="code"
              control={control}
              defaultValue=""
              render={({ onChange, onBlur, value }) => (
                <Form.Field
                  type="text"
                  label="M??"
                  value={value as string}
                  control={Input}
                  onChange={onChange}
                  onBlur={() => {
                    onBlur();
                    handleValidation();
                  }}
                />
              )}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Controller
              name="type"
              control={control}
              defaultValue=""
              render={({ onChange, value }) => (
                <Form.Field
                  search
                  deburr
                  label="Lo???i"
                  value={value as string}
                  control={Select}
                  options={Object.keys(districtType || {}).map((k) => ({
                    text: districtType[k],
                    value: k,
                  }))}
                  onChange={(e: any, { value: v }: any) => {
                    onChange(v);
                    handleChange();
                    handleValidation();
                  }}
                />
              )}
            />
            <Controller
              name="name"
              control={control}
              defaultValue=""
              render={({ onChange, onBlur, value }) => (
                <Form.Field
                  type="text"
                  label="T??n"
                  value={value as string}
                  control={Input}
                  onChange={onChange}
                  onBlur={() => {
                    onBlur();
                    handleChange();
                    handleValidation();
                  }}
                />
              )}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Controller
              name="nameWithType"
              control={control}
              defaultValue=""
              render={({ value }) => (
                <Form.Field
                  type="text"
                  label="T??n chu???n"
                  value={value as string}
                  control={Input}
                />
              )}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Controller
              name="path"
              control={control}
              defaultValue=""
              render={({ value }) => (
                <Form.Field
                  type="text"
                  label="?????a ch???"
                  value={value as string}
                  control={Input}
                />
              )}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Controller
              name="pathWithType"
              control={control}
              defaultValue=""
              render={({ value }) => (
                <Form.Field
                  type="text"
                  label="?????a ch??? chu???n"
                  value={value as string}
                  control={Input}
                />
              )}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Controller
              name="slug"
              control={control}
              defaultValue=""
              render={({ value }) => (
                <Form.Field
                  type="text"
                  label="Slug"
                  value={value as string}
                  control={Input}
                />
              )}
            />
          </Form.Group>
          <Form.Button
            primary
            content="X??c nh???n"
            loading={fetching}
            onClick={!fetching ? handleConfirm : () => {}}
            disabled={!validation}
          />
        </Form>
      </Modal.Content>
    </Modal>
  );
};

export default CreateModal;
