import React, { useCallback, useEffect, useState } from 'react';

import { FiPlus, FiEdit3, FiTrash2 } from 'react-icons/fi';
import DataList from '@app/components/data-list';
import TagModal from '@news/tag/components/TagModal';

import {
  useFetchApi,
  useRefreshCallback,
  useConfirm,
  useSelector,
  useDispatch,
} from '@app/hooks';
import { GroupKey, ComponentKey } from '@app/utils/component-tree';
import { Tag } from './tag.model';
import { getTags } from './tag.slice';
import tagService from './tag.service';

const TagsPage: React.FC = () => {
  const { tagList, getTagsLoading } = useSelector(
    (state) => state.news.tag,
  );
  const { fetch, fetching } = useFetchApi();
  const confirm = useConfirm();
  const dispatch = useDispatch();

  const [openCreate, setOpenCreate] = useState(false);
  const [updateDetails, setUpdateDetails] = useState<Tag>();

  const getData = useCallback(() => {
    dispatch(getTags());
  }, [dispatch]);

  useRefreshCallback(GroupKey.PQM_NEWS, ComponentKey.PQM_CATEGORY, getData);
  useEffect(getData, [getData]);

  return (
    <>
      <DataList
        search
        toggle
        title="Danh sách nhãn bài viết"
        data={tagList}
        loading={fetching || getTagsLoading}
        listActions={[
          {
            title: 'Tạo thể loại bài viết',
            color: 'green',
            icon: <FiPlus />,
            onClick: (): void => setOpenCreate(true),
          },
        ]}
        itemActions={[
          {
            icon: <FiTrash2 />,
            color: 'red',
            title: 'Xoá',
            onClick: (d): void => {
              confirm('Xác nhận xoá?', async () => {
                await fetch(tagService.deleteTag(d));
                getData();
              });
            },
          },
          {
            icon: <FiEdit3 />,
            color: 'violet',
            title: 'Sửa',
            onClick: (d): void => setUpdateDetails(d),
          },
        ]}
        itemHeaderRender={(d): string => d.description}
        getRowKey={(d): string => d.id}
      />

      <TagModal
        open={openCreate}
        data={updateDetails}
        onClose={(): void => {
          setOpenCreate(false);
          setUpdateDetails(undefined);
        }}
        onRefresh={getData}
      />
    </>
  );
};

export default TagsPage;
