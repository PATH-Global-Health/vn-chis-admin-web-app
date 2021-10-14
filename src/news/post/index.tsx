import React, { useCallback, useEffect, useState } from 'react';
import moment from 'moment';

import { FiPlus, FiEdit3, FiTrash2 } from 'react-icons/fi';
import { Dimmer, Loader, Grid } from 'semantic-ui-react';
import DataList from '@app/components/data-list';
import PostForm from '@news/post/components/post-form';
import PostPreview from '@news/post/components/PostPreview';

import {
  useFetchApi,
  useRefreshCallback,
  useConfirm,
  useSelector,
  useDispatch,
} from '@app/hooks';
import { GroupKey, ComponentKey } from '@app/utils/component-tree';
import {
  Post,
  PostPreview as PostPreviewModel,
} from '@news/post/post.model';
import partService from '@news/part/part.service';
import postService from '@news/post/post.service';
import {
  setPost,
  getPosts,
  getPartsOfSelectedPost,
} from '@news/post/post.slice';

const PostsPage: React.FC = () => {
  const {
    postList,
    selectedPost,
    getPostsLoading,
    getPartsOfSelectedPostLoading,
  } = useSelector((state) => state.news.post);
  const { fetch, fetching } = useFetchApi();
  const confirm = useConfirm();
  const dispatch = useDispatch();

  const [openCreate, setOpenCreate] = useState(false);
  const [updateDetails, setUpdateDetails] = useState<PostPreviewModel>();

  const { data } = postList;

  const getData = useCallback(() => {
    dispatch(getPosts());
  }, [dispatch]);

  const handleEdit = async (d: Post) => {
    const parts = await partService.getParts(d?.id);
    setUpdateDetails({ ...d, parts });
  };

  useRefreshCallback(GroupKey.PQM_NEWS, ComponentKey.PQM_CATEGORY, getData);
  useEffect(getData, [getData]);

  return (
    <>
      {!openCreate && !updateDetails && (
        <>
          <Dimmer inverted active={fetching || getPostsLoading}>
            <Loader />
          </Dimmer>
          <Grid>
            <Grid.Row>
              <Grid.Column width={selectedPost?.id ? 8 : 16}>
                <DataList
                  search
                  toggle
                  title="Danh sách bài viết"
                  data={data || []}
                  onRowClick={(d) => {
                    if (selectedPost?.id && selectedPost?.id === d.id) {
                      dispatch(setPost(undefined));
                    } else {
                      dispatch(setPost(d));
                      dispatch(getPartsOfSelectedPost(d.id));
                    }
                  }}
                  listActions={[
                    {
                      title: 'Tạo bài viết',
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
                          await fetch(postService.deletePost(d));
                          dispatch(setPost(undefined));
                          getData();
                        });
                      },
                    },
                    {
                      icon: <FiEdit3 />,
                      color: 'violet',
                      title: 'Sửa',
                      onClick: (d): void => {
                        handleEdit(d);
                      },
                    },
                  ]}
                  itemHeaderRender={(d): string => d.name}
                  itemContentRender={(d): string =>
                    `Người viết: ${d.writter}${d?.publishDate ? ` - Thời gian: ${moment(d.publishDate).format('DD/MM/YYYY')}` : ''}`}
                  getRowKey={(d): string => d.id}
                />
              </Grid.Column>
              {selectedPost?.id && (
                <Grid.Column width="8">
                  <PostPreview
                    title="Xem bài viết"
                    loading={getPartsOfSelectedPostLoading}
                    data={selectedPost}
                  />
                </Grid.Column>
              )}
            </Grid.Row>
          </Grid>
        </>
      )}
      {(openCreate || updateDetails) && (
        <PostForm
          data={updateDetails}
          onClose={() => {
            dispatch(setPost(undefined));
            setOpenCreate(false);
            setUpdateDetails(undefined);
          }}
          onRefresh={getData}
        />
      )}
    </>
  );
};

export default PostsPage;
