import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { SemanticCOLORS } from 'semantic-ui-react/dist/commonjs/generic';
import styled from 'styled-components';

import { Modal, Popup, Label, Icon, Button } from 'semantic-ui-react';
import DataList from '@app/components/data-list';

import { useDispatch, useFetchApi, useSelector } from '@app/hooks';

import { Permission } from '@admin/user-management/permission/permission.model';
import permissionService from '@admin/user-management/permission/permission.service';
import { getPermissionsResource } from '@admin/user-management/permission/permission.slice';
import { permissionTypeColorList } from '@admin/user-management/utils/helpers';
import { PermissionType } from '@admin/user-management/utils/constants';

const StyledContent = styled(Modal.Content)`
  padding: 0.5rem 1rem !important;
`;

interface Props {
  open: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

const AddPermissionResourceToUserModal: React.FC<Props> = (props) => {
  const { open, onClose, onRefresh } = props;

  const [selected, setSelected] = useState<Permission[]>([]);

  const dispatch = useDispatch();
  const { fetch, fetching } = useFetchApi();
  const { selectedUser, permissionsResourceOfUserList, getPermissionsResourceOfUserLoading } = useSelector(
    (state) => state.admin.userManagement.user,
  );
  const { permissionResourceList, getPermissionsResourceLoading } = useSelector(
    (state) => state.admin.userManagement.permission,
  );

  const loading = getPermissionsResourceLoading || getPermissionsResourceOfUserLoading;

  const data = useMemo(() => {
    const permissionsUIOfUserIds = permissionsResourceOfUserList.map((p) => p.id);
    return permissionResourceList.filter((p) => !permissionsUIOfUserIds.includes(p.id));
  }, [permissionResourceList, permissionsResourceOfUserList])

  const onSubmit = async (): Promise<void> => {
    if (selectedUser?.id) {
      await fetch(
        permissionService.createPermissionForSubjectByIdList({
          ids: selected.map((s) => s.id),
          holderId: selectedUser.id,
          isUser: true,
          isPermissionUI: false,
          isPermissionResource: true,
        }),
      );
      onRefresh();
      onClose();
      setSelected([]);
    }
  };

  const getData = useCallback(() => {
    dispatch(getPermissionsResource());
  }, [dispatch])
  useEffect(getData, [getData]);

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>Th??m quy???n</Modal.Header>
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
            const permissionTypeColor = permissionTypeColorList.find((p) => d?.normalizedMethod && p.name.includes(d?.normalizedMethod ?? ''))
            return (
              <>
                {d?.normalizedMethod ? (
                  <Popup
                    size="mini"
                    inverted
                    position="top left"
                    content={(d?.permissionType ?? PermissionType.DENY) === PermissionType.DENY ? 'T??? ch???i' : 'Cho ph??p'}
                    trigger={
                      <Label color={(permissionTypeColor?.color ?? 'black') as SemanticCOLORS} basic horizontal>
                        <Icon name={(d?.permissionType ?? PermissionType.DENY) === PermissionType.DENY ? 'x' : 'check'} /> 
                        {d?.normalizedMethod ?? ''}
                      </Label>
                    }
                  />
                ) : null}
      
                {d?.url ?? ''}
              </>
            )
          }}
        />
      </StyledContent>
      <Modal.Actions>
        <Button
          positive
          content="X??c nh???n"
          loading={fetching}
          onClick={onSubmit}
        />
      </Modal.Actions>
    </Modal>
  );
};

export default AddPermissionResourceToUserModal;