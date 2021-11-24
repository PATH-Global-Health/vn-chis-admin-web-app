import React, { useState, useCallback, useEffect } from 'react';

import { Controller, useForm } from 'react-hook-form';

import { Modal, Form, Input, Select } from 'semantic-ui-react';

import { useFetchApi } from '@app/hooks';
import { toSlug } from '@app/utils/helpers';
import {
  Province,
  ProvinceUM,
  provinceType,
} from '@pqm/category/province/province.model';
import provinceService from '@pqm/category/province/province.service';

interface Props {
  data?: Province;
  onClose: () => void;
  onRefresh: () => void;
}

const UpdateModal: React.FC<Props> = ({ data, onClose, onRefresh }) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { control, reset, getValues, setValue } = useForm<ProvinceUM>();
  const { fetch, fetching } = useFetchApi();

  const [validation, setValidation] = useState(false);

  const handleChange = useCallback(() => {
    const d = getValues();
    if ((d?.name ?? '') !== '') {
      setValue('nameWithType', `${provinceType[d?.type] || ''} ${d.name}`);
      setValue('slug', toSlug(d.name));
    }
  }, [setValue, getValues]);
  const handleValidation = useCallback(() => {
    let flag = false;
    const d = getValues();
    if (d?.code !== '' && d?.name !== '') {
      flag = true;
    }
    setValidation(flag);
  }, [getValues]);
  const handleConfirm = useCallback(async () => {
    if (validation) {
      await fetch(provinceService.updateProvince(getValues()));
      onRefresh();
      onClose();
    }
  }, [validation, getValues, fetch, onClose, onRefresh]);

  useEffect(() => {
    reset(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <Modal open={Boolean(data)} onClose={onClose}>
      <Modal.Header>Sửa</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Group widths="equal" style={{ display: 'none' }}>
            <Controller
              name="id"
              control={control}
              defaultValue=""
              render={({ value }) => (
                <Form.Field
                  type="text"
                  className="d-none"
                  value={value as string}
                  control={Input}
                />
              )}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Controller
              name="code"
              control={control}
              defaultValue=""
              render={({ onChange, onBlur, value }) => (
                <Form.Field
                  type="text"
                  label="Mã"
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
              name="type"
              control={control}
              defaultValue=""
              render={({ onChange, value }) => (
                <Form.Field
                  search
                  deburr
                  label="Loại"
                  value={value as string}
                  control={Select}
                  options={Object.keys(provinceType).map((k) => ({
                    text: provinceType[k],
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
                  label="Tên"
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
                  label="Tên chuẩn"
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
            content="Xác nhận"
            loading={fetching}
            onClick={!fetching ? handleConfirm : () => {}}
            disabled={!validation}
          />
        </Form>
      </Modal.Content>
    </Modal>
  );
};

export default UpdateModal;
