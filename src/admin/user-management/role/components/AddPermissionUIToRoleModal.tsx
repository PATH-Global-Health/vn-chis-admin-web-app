import React, { useState, useEffect, useMemo, useCallback } from 'react';
import styled from 'styled-components';

import { Modal, Popup, Label, Button } from 'semantic-ui-react';
import DataList from '@app/components/data-list';

import { useFetchApi, useDispatch, useSelector } from '@app/hooks';
import { Permission } from '@admin/user-management/permission/permission.model';
import permissionService from '@admin/user-management/permission/permission.service';
import { getPermissionsUI } from '@admin/user-management/permission/permission.slice';
import { PermissionType } from '@admin/user-management/utils/constants';
import { getFunctionFromPermission } from '@admin/user-management/utils/helpers';

const StyledContent = styled(Modal.Content)`
  padding: 0.5rem 1rem !important;
`;

interface Props {
  open: boolean;
  onClose: () => void;
  onRefresh: () => void;
};

const AddPermissionUIToRoleModal: React.FC<Props> = (props) => {
  const { open, onClose, onRefresh } = props;

  const [selected, setSelected] = useState<Permission[]>([]);

  const dispatch = useDispatch();
  const { fetch, fetching } = useFetchApi();
  const {
    selectedRole,
    permissionUIOfRoleList,
    getPermissionUIOfRoleLoading
  } = useSelector((state) => state.admin.userManagement.role);
  const {
    permissionUIList,
    getPermissionsUILoading
  } = useSelector((state) => state.admin.userManagement.permission);

  const loading = getPermissionsUILoading || getPermissionUIOfRoleLoading;

  const data = useMemo(() => {
    const permissionUIOfRoleIds = permissionUIOfRoleList.map((p) => p.id);
    return permissionUIList.filter((p) => !permissionUIOfRoleIds.includes(p.id));
  }, [permissionUIList, permissionUIOfRoleList])

  const onSubmit = async (): Promise<void> => {
    if (selectedRole?.id) {
      await fetch(
        permissionService.createPermissionForSubjectByIdList({
          ids: selected.map((s) => s.id),
          holderId: selectedRole.id,
          isRole: true,
          isPermissionUI: true,
          isPermissionResource: false,
          isPermissionData: false,
        })
      )
    }
    onClose();
    onRefresh();
    setSelected([]);
  };

  const getData = useCallback(() => {
    dispatch(getPermissionsUI());
  }, [dispatch]);
  useEffect(getData, [getData]);
  
  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>Thêm quyền</Modal.Header>
      <StyledContent>
        <DataList
          search
          selectable
          data={data}
          loading={loading}
          totalCount={data.length}
          selectedRows={selected}
          onMultipleSelect={(d: Permission[]) => {
            setSelected(d);
          }}
          getRowKey={(d): string => d.id}
          itemHeaderRender={(d): JSX.Element => {
            const type = getFunctionFromPermission(d?.code);
            return (
              <>
                <Popup
                  size="mini"
                  inverted
                  position="top left"
                  content={(d?.permissionType ?? PermissionType.DENY) === PermissionType.DENY ? 'Từ chối' : 'Cho phép'}
                  trigger={
                    <Label color={(d?.permissionType ?? PermissionType.DENY) === PermissionType.DENY ? 'red' : 'green'} basic horizontal>
                      {type ? type.text : 'Tất cả'}
                    </Label>
                  }
                />
                {d?.name ?? ''}
              </>
            )
          }}
          itemContentRender={(d): string => `Mã ${d?.code ?? ''}`}
        />
      </StyledContent>
      <Modal.Actions>
        <Button
          positive
          content="Xác nhận"
          loading={fetching}
          onClick={onSubmit}
        />
      </Modal.Actions>
    </Modal>
  );
};

export default AddPermissionUIToRoleModal;