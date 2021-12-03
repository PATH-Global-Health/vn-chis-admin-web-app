/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/unbound-method */
import React, { useState } from 'react';

import { Controller, useForm } from 'react-hook-form';
import { Modal, Form, Input, Select, Button } from 'semantic-ui-react';

import { useFetchApi } from '@app/hooks';
import { Option } from '@app/models/utility';
import { PermissionCM } from '@admin/user-management/permission/permission.model';
import permissionService from '@admin/user-management/permission/permission.service';
import {
  methodList,
  permissionUIList,
  permissionTypeList,
  permissionUITypeList,
} from '@admin/user-management/utils/helpers';
import { PermissionType } from '@admin/user-management/utils/constants';

interface Props {
  open: boolean;
  isPermissionUI?: boolean;
  isPermissionResource?: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

const methodOptions =
  methodList.map((m) => ({
    text: m.text,
    value: m.value,
    label: {
      color: m.color,
      empty: true,
      circular: true,
    },
  }));

const permissionUIOptions = 
  permissionUIList.map((p) => ({
    text: p.name,
    value: p.code,
  }));

const CreateModal: React.FC<Props> = (props) => {
  const {
    open,
    isPermissionUI,
    isPermissionResource,
    onClose,
    onRefresh
  } = props;

  const [functionOptions, setFunctionOptions] = useState<Option[]>([]);

  const { fetch, fetching } = useFetchApi();
  const {
    formState: { errors },
    control,
    setValue,
    reset,
    handleSubmit,
  } = useForm<PermissionCM>();

  const disabled =
    !!errors?.name?.message ||
    !!errors?.description?.message ||
    !!errors?.code?.message ||
    !!errors?.url?.message ||
    !!errors?.method?.message ||
    !!errors?.type?.message;

  const rules = {
    name: { required: 'Bắt buộc phải nhập tên' },
    description: { required: 'Bắt buộc phải nhập mô tả' },
    code: { required: 'Bắt buộc phải chọn mã' },
    url: { required: 'Bắt buộc phải nhập đường dẫn' },
    method: { required: 'Bắt buộc phải chọn phương thức' },
    type: { required: 'Bắt buộc phải chọn loại quyền' },
    function: { required: 'Bắt buộc phải chọn chức năng' },
  };

  const onSubmit = async (d: PermissionCM): Promise<void> => {
    await fetch(
      permissionService.createPermission({
        permission:
          isPermissionUI
          ? {
            ...d,
            name: permissionUIList.find((p) => p.code === d.code)?.name ?? d.code,
            code: `${d.code}_${d.function}`,
            type: PermissionType.ALLOW,
          }
          : d,
        isPermissionUI: Boolean(isPermissionUI),
        isPermissionResource: Boolean(isPermissionResource)
      }),
    );
    onRefresh();
    onClose();
    reset({});
  };
 
  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>Tạo mới</Modal.Header>
      <Modal.Content>
        <Form>
          {isPermissionResource && (
            <>
              <Form.Group widths="equal">
                <Controller
                  control={control}
                  name="url"
                  defaultValue=""
                  rules={rules.url}
                  render={({ onChange, onBlur, value }): React.ReactElement => (
                    <Form.Field
                      required
                      control={Input}
                      label="Đường dẫn"
                      error={!!errors?.url?.message && errors.url.message}
                      value={value}
                      onChange={(__: any, { value: v }: any) => {
                        setValue('url', v);
                      }}
                      onBlur={onBlur}
                    />
                  )}
                />
              </Form.Group>
              <Form.Group widths="equal">
                <Controller
                  control={control}
                  name="method"
                  defaultValue={methodList[0].value}
                  rules={rules.method}
                  render={({ onChange, onBlur, value }): React.ReactElement => (
                    <Form.Field
                      required
                      control={Select}
                      label="Phương thức"
                      error={!!errors?.method?.message && errors.method.message}
                      options={methodOptions}
                      value={value}
                      onChange={(__: any, { value: v }: any) => {
                        setValue('method', v);
                      }}
                      onBlur={onBlur}
                    />
                  )}
                />
              </Form.Group>
              <Form.Group widths="equal">
                <Controller
                  control={control}
                  name="type"
                  defaultValue={permissionTypeList[0].value}
                  rules={rules.type}
                  render={({ onChange, onBlur, value }): React.ReactElement => (
                    <Form.Field
                      required
                      control={Select}
                      label="Loại quyền"
                      error={!!errors?.method?.message && errors.method.message}
                      options={permissionTypeList}
                      value={value}
                      onChange={(__: any, { value: v }: any) => {
                        setValue('type', v);
                      }}
                      onBlur={onBlur}
                    />
                  )}
                />
              </Form.Group>
            </>
          )}
          {isPermissionUI && (
            <>
              <Form.Group widths="equal">
                <Controller
                  control={control}
                  name="code"
                  defaultValue={undefined}
                  rules={rules.code}
                  render={({ onChange, onBlur, value }): React.ReactElement => (
                    <Form.Field
                      required
                      control={Select}
                      label="Quyền"
                      error={!!errors?.code?.message && errors.code.message}
                      options={permissionUIOptions}
                      value={value}
                      onChange={(__: any, { value: v }: any) => {
                        setValue('code', v);
                        setFunctionOptions(
                          (permissionUIList.find((p) => v && p.code === v)?.types ?? []).map((type) => ({
                            text: permissionUITypeList.find((p) => p.value === type)?.text ?? type,
                            value: type,
                          }))
                        );
                      }}
                      onBlur={onBlur}
                    />
                  )}
                />
              </Form.Group>
              <Form.Group widths="equal">
                <Controller
                  control={control}
                  name="function"
                  defaultValue=""
                  rules={rules.function}
                  render={({ onChange, onBlur, value }): React.ReactElement => (
                    <Form.Field
                      required
                      control={Select}
                      label="Chức năng"
                      error={!!errors?.function?.message && errors.function.message}
                      options={functionOptions}
                      value={value}
                      onChange={(__: any, { value: v }: any) => {
                        setValue('function', v);
                      }}
                      onBlur={onBlur}
                    />
                  )}
                />
              </Form.Group>
            </>
          )}
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button
          positive
          content="Xác nhận"
          loading={fetching}
          disabled={disabled}
          onClick={handleSubmit((d) => onSubmit(d))}
        />
      </Modal.Actions>
    </Modal>
  );
};

export default CreateModal;
