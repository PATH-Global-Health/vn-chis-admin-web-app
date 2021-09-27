import React, { useMemo } from 'react';
import { Modal } from 'semantic-ui-react';

import { useFetchApi, useSelector } from '@app/hooks';
import { FormField } from '@app/models/form-field';
import SimpleForm from '@app/components/simple-form';

import { Permission } from '@admin/user-management/permission/permission.model';
import permissionService from '@admin/user-management/permission/permission.service';
import {
  methodList,
  permissionTypeList,
} from '@admin/user-management/utils/helpers';
import permissionUI from '@app/utils/component-tree';

interface Props {
  open: boolean;
  onClose: () => void;
  onRefresh: () => void;
  isPermissionUI?: boolean;
  isPermissionResource?: boolean;
}

const AddPermissionToRoleModal: React.FC<Props> = (props) => {
  const {
    open,
    onClose,
    onRefresh,
    isPermissionUI,
    isPermissionResource,
  } = props;
  const { selectedRole, permissionUIOfRoleList } = useSelector(
    (state) => state.admin.userManagement.role,
  );

  const { fetch, fetching } = useFetchApi();

  const permissionUIOfRoleOptions = permissionUI
    .filter((o) => o?.permissionCode)
    .filter(
      (o) =>
        !(permissionUIOfRoleList || []).find((i) =>
          JSON.stringify(i).includes(o?.permissionCode ?? ''),
        ),
    );

  const title = useMemo(() => {
    if (isPermissionUI) {
      return 'Thêm quyền UI';
    }
    if (isPermissionResource) {
      return 'Thêm quyền API';
    }
    return '';
  }, [isPermissionUI, isPermissionResource]);

  const formFields = useMemo((): FormField<Permission>[] => {
    return [
      {
        name: 'name',
        label: 'Tên quyền',
      },
      {
        name: 'code',
        type: 'select',
        required: true,
        label: 'Code',
        options: permissionUIOfRoleOptions.map((o) => ({
          value: o?.permissionCode ?? '',
          text: o?.title ?? '',
        })),
        hidden: isPermissionResource,
      },
      {
        name: 'method',
        type: 'select',
        required: true,
        label: 'Giao thức',
        options: methodList.map((m) => ({
          text: m.text,
          value: m.value,
          label: {
            color: m.color,
            empty: true,
            circular: true,
          },
        })),
        hidden: isPermissionUI,
      },
      {
        name: 'url',
        label: 'Đường dẫn',
        hidden: isPermissionUI,
      },
      {
        name: 'permissionType',
        type: 'select',
        required: true,
        label: 'Loại quyền',
        options: permissionTypeList,
      },
      {
        name: 'description',
        label: 'Miêu tả',
      },
    ];
  }, [isPermissionResource, isPermissionUI, permissionUIOfRoleOptions]);

  const handleSubmit = async (d: Permission): Promise<void> => {
    if (selectedRole) {
      await fetch(
        permissionService.createPermission({
          permission: d,
          holderId: selectedRole.id,
          isRole: true,
          isPermissionUI,
          isPermissionResource,
        }),
      );
      onRefresh();
      onClose();
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>{title}</Modal.Header>
      <Modal.Content>
        <SimpleForm
          formFields={formFields}
          loading={fetching}
          onSubmit={handleSubmit}
        />
      </Modal.Content>
    </Modal>
  );
};

export default AddPermissionToRoleModal;
