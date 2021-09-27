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
import {
  HolderType,
  PermissionType,
} from '@admin/user-management/utils/constants';

const StyledSelect = styled(Select)`
  & input {
    min-height: 0 !important;
  }
`;

interface Permission {
  id?: string;
  name?: string;
  code?: string;
}

interface FormUM {
  id: string;
  name: string;
  code: string;
  types: string[];
}

interface Props {
  data?: Permission;
  onClose: () => void;
  onRefresh: () => void;
}

const EditPermissionOfGroupModal: React.FC<Props> = (props) => {
  const { data, onClose, onRefresh } = props;

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, reset, watch, setValue, handleSubmit } = useForm<FormUM>();

  const { fetch, fetching } = useFetchApi();
  const { selectedGroup, permissionUIOfGroupList } = useSelector(
    (state) => state.admin.userManagement.group,
  );

  const permissionCode = watch('code') || '';
  const permissionUI = useMemo(
    () => permissionUIList.find((p) => permissionCode.includes(p?.code ?? '')),
    [permissionCode],
  );
  const permissionTypeList = useMemo(
    () =>
      // eslint-disable-next-line
      permissionUIList.find((p) => p.code.includes(permissionUI?.code ?? ''))?.types ?? [],
    [permissionUI],
  );
  const permissionTypeOfGroupList = useMemo(
    () =>
      permissionTypeList.filter((type) =>
        permissionUIOfGroupList.find((permission) =>
          (permission?.code ?? '').includes(type),
        ),
      ),
    [permissionUIOfGroupList, permissionTypeList],
  );

  const onSubmit = async (d: FormUM): Promise<void> => {
    if (selectedGroup?.id) {
      const { types } = d;
      // eslint-disable-next-line
      const deletePromises = 
        (permissionUIOfGroupList || [])
        // eslint-disable-next-line
        .filter(
          (permission) =>
            !types.find((type) => (permission?.code ?? '').includes(type)),
        )
        .map((permission) => {
          return fetch(
            permissionService.deletePermission(
              permission.id,
              selectedGroup.id,
              HolderType.GROUP,
              true,
              false,
            ),
          );
        });
      // eslint-disable-next-line
      const createPermissions =
        (types || [])
        // eslint-disable-next-line
        .filter((type) => !(permissionUIOfGroupList || []).find((permission) => (permission?.code ?? '').includes(type)))
        .map((type) => ({
          name: permissionUI?.name ?? '',
          code: `${permissionUI?.code ?? ''}_${type}`,
          permissionType: PermissionType.ALLOW,
        }));

      await fetch(
        permissionService.createPermissionList({
          permissions: createPermissions,
          holderId: selectedGroup.id,
          isUser: true,
          isPermissionUI: true,
          isPermissionResource: false,
        }),
      );
      await Promise.all(deletePromises);
      onClose();
      onRefresh();
    }
  };

  useEffect(() => {
    register('id');
    register('name');
    register('code', { required: 'Bắt buộc phải chọn quyền' });
    register('types');
  }, [register]);
  useEffect(() => {
    reset(data);
  }, [data, reset]);
  useEffect(() => {
    setValue('types', permissionTypeOfGroupList);
  }, [permissionTypeOfGroupList, setValue]);

  return (
    <Modal open={Boolean(data?.id)} onClose={onClose}>
      <Modal.Header>Sửa quyền UI</Modal.Header>
      <Modal.Content>
        <Form loading={fetching} onSubmit={handleSubmit((d) => onSubmit(d))}>
          <Form.Group widths="equal">
            <Form.Field
              fluid
              search
              deburr
              clearable
              multiple
              label="Loại quyền"
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

export default EditPermissionOfGroupModal;
