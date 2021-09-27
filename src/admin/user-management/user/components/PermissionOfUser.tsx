import React from 'react';
import { Tab } from 'semantic-ui-react';

import GroupRolePermissionOfUser from './GroupRolePermissionOfUser';

const panes = [
  {
    menuItem: 'UI',
    render: () => <GroupRolePermissionOfUser isPermissionUI />,
  },
  {
    menuItem: 'Resource',
    render: () => <GroupRolePermissionOfUser isPermissionResource />,
  },
];

const PermissionOfUser: React.FC = () => (
  <Tab
    panes={panes}
    renderActiveOnly
    menu={{ secondary: true, pointing: true }}
  />
);

export default PermissionOfUser;
