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

interface Props {
  open: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

const AddPermissionResourceToGroupModal: React.FC<Props> = (props) => {
  const { open, onClose, onRefresh } = props;

  const { fetch, fetching } = useFetchApi();
  const { selectedGroup } = useSelector(
    (state) => state.admin.userManagement.group,
  );

  const handleSubmit = async (d: Permission): Promise<void> => {
    if (selectedGroup) {
      await fetch(
        permissionService.createPermission({
          permission: d,
          holderId: selectedGroup.id,
          isGroup: true,
          isPermissionUI: false,
          isPermissionResource: true,
        }),
      );
      onRefresh();
      onClose();
    }
  };

  const formFields = useMemo((): FormField<Permission>[] => {
    return [
      {
        name: 'name',
        label: 'Tên quyền',
      },
      {
        name: 'method',
        type: 'select',
        required: true,
        label: 'Phương thức',
        options: methodList.map((m) => ({
          text: m.text,
          value: m.value,
          label: {
            color: m.color,
            empty: true,
            circular: true,
          },
        })),
      },
      {
        name: 'url',
        label: 'URL',
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
  }, []);

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>Thêm quyền Resource</Modal.Header>
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

export default AddPermissionResourceToGroupModal;
