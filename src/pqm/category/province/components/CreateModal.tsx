import React, { useState, useCallback } from 'react';

import { Controller, useForm } from 'react-hook-form';

import { Modal, Form, Input, Select } from 'semantic-ui-react';

import { useFetchApi } from '@app/hooks';
import { toSlug } from '@app/utils/helpers';
import {
  ProvinceCM,
  provinceType,
} from '@pqm/category/province/province.model';
import provinceService from '@pqm/category/province/province.service';

interface Props {
  open: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

const CreateModal: React.FC<Props> = ({ open, onClose, onRefresh }) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { control, getValues, setValue } = useForm<ProvinceCM>();
  const { fetch, fetching } = useFetchApi();

  const [validation, setValidation] = useState(false);

  const handleChange = useCallback(() => {
    const d = getValues();
    if ((d?.name ?? '') !== '') {
      setValue('nameWithType', `${provinceType[d?.type] || ''} ${d.name}`);
      setValue('slug', toSlug(d.name));
    }
    setValue('code', d?.code);
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
      await fetch(provinceService.createProvince(getValues()));
      onRefresh();
      onClose();
    }
  }, [validation, getValues, fetch, onClose, onRefresh]);

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>Tạo mới</Modal.Header>
      <Modal.Content>
        <Form>
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
                  clearable
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

export default CreateModal;
