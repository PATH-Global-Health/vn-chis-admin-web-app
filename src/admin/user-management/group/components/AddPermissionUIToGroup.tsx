import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';

import { Modal, Form, Select } from 'semantic-ui-react';

import { useFetchApi, useSelector } from '@app/hooks';

import permissionService from '@admin/user-management/permission/permission.service';
import {
  permissionUIList,
  permissionUITypeList,
} from '@admin/user-management/utils/helpers';
import { PermissionType } from '@admin/user-management/utils/constants';

const StyledSelect = styled(Select)`
  & input {
    min-height: 0 !important;
  }
`;

interface FormCM {
  code: string;
  types: any;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

const AddPermissionToGroupModal: React.FC<Props> = (props) => {
  const { open, onClose, onRefresh } = props;

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const {
    formState: { errors },
    register,
    watch,
    setValue,
    handleSubmit,
  } = useForm<FormCM>({
    defaultValues: {},
  });

  const { fetch, fetching } = useFetchApi();
  const { selectedGroup, permissionUIOfGroupList } = useSelector(
    (state) => state.admin.userManagement.group,
  );

  const permissionList = permissionUIList.filter(
    (permission) =>
      !permissionUIOfGroupList.find((p) =>
        (p?.code ?? '').includes(permission.code),
      ),
  );
  const permissionCode = watch('code');
  const permissionTypeList: string[] = useMemo(
    () => permissionUIList.find((p) => p.code === permissionCode)?.types ?? [],
    [permissionCode],
  );

  const onSubmit = async (data: FormCM): Promise<void> => {
    if (selectedGroup?.id) {
      const { code, types } = data;
      const permission = permissionList.find((p) => code === p.code);
      if (permission) {
        if (types) {
          const permissions = types.map((type: any) => ({
            name: permission.name,
            code: `${permission.code}${type !== 'ALL' ? `_${type}` : ''}`,
            permissionType: PermissionType.ALLOW,
          }));
          await fetch(
            permissionService.createPermissionList({
              permissions,
              holderId: selectedGroup.id,
              isGroup: true,
              isPermissionUI: true,
              isPermissionResource: false,
            }),
          );
        }
        if (!types && permissionTypeList.length === 0) {
          await fetch(
            permissionService.createPermission({
              permission: {
                name: permission.name,
                code: permission.code,
                permissionType: PermissionType.ALLOW,
              },
              holderId: selectedGroup.id,
              isGroup: true,
              isPermissionUI: true,
              isPermissionResource: false,
            }),
          );
        }
      }
      onClose();
      onRefresh();
    }
  };

  useEffect(() => {
    register('code', { required: 'Bắt buộc phải chọn chức năng' });
    register('types', { required: 'Bắt buộc phải chọn quyền' });
  }, [register]);

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>Thêm quyền UI</Modal.Header>
      <Modal.Content>
        <Form loading={fetching} onSubmit={handleSubmit((d) => onSubmit(d))}>
          <Form.Group widths="equal">
            <Form.Field
              required
              fluid
              search
              deburr
              error={!!errors.code?.message && errors.code.message}
              label="Chức năng"
              control={Select}
              options={(permissionList || []).map((p) => ({
                text: p.name,
                value: p.code,
              }))}
              value={watch('code')}
              // eslint-disable-next-line
              onChange={(e: any, d: any): void => setValue('code', d.value)}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field
              required
              fluid
              search
              deburr
              clearable
              multiple
              error={!!errors.types?.message && errors.types.message}
              label="Quyền"
              control={StyledSelect}
              options={permissionUITypeList.filter((p) =>
                permissionTypeList.includes(p.value),
              )}
              value={watch('types') || []}
              // eslint-disable-next-line
              onChange={(e: any, d: any): void => setValue('types', d.value)}
            />
          </Form.Group>
          <Form.Button primary content="Xác nhận" />
        </Form>
      </Modal.Content>
    </Modal>
  );
};

export default AddPermissionToGroupModal;
