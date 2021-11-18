import React, { ReactNode } from 'react';

import UserPage from '@admin/user-management/user';
import GroupPage from '@admin/user-management/group';
import RolePage from '@admin/user-management/role';

import CategoriesPage from '@news/category';
import TagsPage from '@news/tag';
import PostsPage from '@news/post';
import ServicesPage from '@category/service';
import QuestionTemplateTypesPage from '@form-assessment/question-template-type';
import QuestionPage from '@form-assessment/question';
import QuestionTemplatesPage from '@form-assessment/question-template';

export enum GroupKey {
  // #region admin
  ADMIN_USER_MANAGEMENT = 'ADMIN_USER_MANAGEMENT',
  // #endregion

  // #region news
  ADMIN_NEW_MANAGEMENT = 'ADMIN_NEW_MANAGEMENT',
  // #endregion

  // #region csyt
  ADMIN_SERVICE_MANAGEMENT = 'ADMIN_SERVICE_MANAGEMENT',
  // #endregion

  // #region form assessment
  ADMIN_QUESTION_MANAGEMENT = 'ADMIN_QUESTION_MANAGEMENT',
  // #endregion
}

export enum ComponentKey {
  // #region admin
  ADMIN_USER = 'ADMIN_USER',
  ADMIN_GROUP = 'ADMIN_GROUP',
  ADMIN_ROLE = 'ADMIN_ROLE',
  // #endregion

  // #region news
  NEWS_CATEGORY = 'NEWS_CATEGORY',
  NEWS_TAG = 'NEWS_TAG',
  NEWS_POST = 'NEWS_POST',
  // #endregion

  // #region csyt
  CSYT_SERVICE = 'CSYT_SERVICE',
  CSYT_SERVICE_TYPE = 'CSYT_SERVICE_TYPE',

  // #region form assessment
  QUESTION = 'QUESTION',
  QUESTION_TEMPLATE = 'QUESTION_TEMPLATE',
  QUESTION_TEMPLATE_TYPE = 'QUESTION_TEMPLATE_TYPE',
  // #endregion
}

export interface Component {
  key: GroupKey | ComponentKey;
  title: string;
  hidden?: boolean;
  component?: ReactNode;
  childrenList?: Component[];
  permissionCode?: string;
}

const componentTree: Component[] = [
  {
    key: GroupKey.ADMIN_USER_MANAGEMENT,
    title: 'Quản lý người dùng',
    permissionCode: GroupKey.ADMIN_USER_MANAGEMENT,
    childrenList: [
      {
        key: ComponentKey.ADMIN_USER,
        title: 'Người dùng',
        component: <UserPage />,
      },
      {
        key: ComponentKey.ADMIN_GROUP,
        title: 'Nhóm',
        component: <GroupPage />,
      },
      {
        key: ComponentKey.ADMIN_ROLE,
        title: 'Vai trò',
        component: <RolePage />,
      },
    ],
  },
  {
    key: GroupKey.ADMIN_SERVICE_MANAGEMENT,
    title: 'Quản lý dịch vụ',
    permissionCode: GroupKey.ADMIN_SERVICE_MANAGEMENT,
    childrenList: [

      {
        key: ComponentKey.CSYT_SERVICE,
        title: 'Dịch vụ',
        component: <ServicesPage />,
        /* permissionCode: 'ADMIN_SERVICE_MANAGEMENT_SERVICE', */
      },
    ],
  },
  {
    key: GroupKey.ADMIN_NEW_MANAGEMENT,
    title: 'Quản lí bài viết',
    permissionCode: GroupKey.ADMIN_NEW_MANAGEMENT,
    childrenList: [
      {
        key: ComponentKey.NEWS_CATEGORY,
        title: 'Thể loại',
        component: <CategoriesPage />,
      },
      {
        key: ComponentKey.NEWS_TAG,
        title: 'Nhãn',
        component: <TagsPage />,
      },
      {
        key: ComponentKey.NEWS_POST,
        title: 'Bài viết',
        component: <PostsPage />,
      },
    ],
  },
  {
    key: GroupKey.ADMIN_QUESTION_MANAGEMENT,
    title: 'Quản lí biểu mẫu đánh giá',
    permissionCode: GroupKey.ADMIN_QUESTION_MANAGEMENT,
    childrenList: [
      {
        key: ComponentKey.QUESTION,
        title: 'Câu hỏi',
        component: <QuestionPage />,
      },
      {
        key: ComponentKey.QUESTION_TEMPLATE_TYPE,
        title: 'Loại biểu mẫu',
        component: <QuestionTemplateTypesPage />,
      },
      {
        key: ComponentKey.QUESTION_TEMPLATE,
        title: 'Biểu mẫu',
        component: <QuestionTemplatesPage />,
      },
    ],
  },
];

const getGroup = (groupKey: string): Component | null => {
  const group = componentTree.find((g) => g.key === groupKey);
  return group ?? null;
};

const getComponent = (groupKey: string, key: string): Component | null => {
  const group = componentTree.find((g) => g.key === groupKey);
  if (group) {
    if (!group.childrenList) {
      return group;
    }
    const childComponent = group.childrenList.find((c) => c.key === key);
    return childComponent ?? null;
  }
  return null;
};

export default componentTree;
export { getGroup, getComponent };
