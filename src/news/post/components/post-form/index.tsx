import React, { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import _ from 'lodash';

import { Grid, Dimmer, Loader, Form, Header, Input } from 'semantic-ui-react';
import { FiSave, FiX } from 'react-icons/fi';
import CategorySection from '@news/post/components/post-form/CategorySection';
import TagSection from '@news/post/components/post-form/TagSection';
import DescriptionSection from '@news/post/components/post-form/DescriptionSection';
import PartSection from '@news/post/components/post-form/PartSection';
import Action from '@news/post/components/post-form/Action';
import PostPreview from '@news/post/components/PostPreview';

import { useSelector, useFetchApi, useConfirm } from '@app/hooks';
import { Part as PartForm } from '@news/part/part.model';
import { PostCM, PostForm as PostFormModel } from '@news/post/post.model';
import partService from '@news/part/part.service';
import postService from '@news/post/post.service';

const ToolbarWrapper = styled.div`
  display: flex;
  padding: 0 0 8px 0;
`;
const StyledHeader = styled(Header)`
  margin-bottom: 0 !important;
  font-size: 28px !important;
`;
const ActionsWrapper = styled.div`
  margin-left: auto;
`;

interface Props {
  data?: PostFormModel;
  onClose: () => void;
  onRefresh: () => void;
}

const PostForm: React.FC<Props> = ({ data, onClose, onRefresh }) => {
  const { token } = useSelector((state) => state.auth);
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const {
    formState: { errors },
    register,
    reset,
    watch,
    trigger,
    setValue,
    getValues,
  } = useForm<PostCM>({
    defaultValues: {},
  });
  const { fetch, fetching } = useFetchApi();
  const confirm = useConfirm();

  const [changed, setChanged] = useState<boolean>(false);
  const [postForm, setPostForm] = useState<PostCM | undefined>();

  const username = useMemo((): string => token?.username ?? 'Unknown', [token]);

  const handleSubmit = async () => {
    if (Object.keys(errors).length === 0) {
      const payload = getValues();
      const postId = await fetch(
        data?.id
          ? postService.updatePost({ ..._.omit(payload, 'parts'), id: data.id })
          : postService.createPost(payload),
      );
      if (postId && postId !== '') {
        const parts = (payload?.parts ?? []).map((o, index) => ({ ...o, order: index }));
        const newParts = parts.filter((o) => !o.isDeleted && o.isNew);
        if (newParts.length > 0) {
          await fetch(postService.addPartsToPost({ postId, parts: newParts }));
        }
        for (const part of parts) {
          if (!part?.isNew) {
            await fetch(
              part?.isDeleted
              ? partService.deletePart(part)
              : partService.updatePart(part)
            )
          }
        }
      }
      onClose();
      onRefresh();
    }
  };

  const handleChange = (key: string, value: any, isTrigger = false): void => {
    setChanged(true);
    setValue(key, value);
    setPostForm(getValues());
    if (isTrigger) {
      trigger();
    }
  };

  const actions = useMemo(
    () => ([
      {
        title: 'Lưu bài viết',
        icon: <FiSave />,
        color: 'blue',
        onClick: async () => {
          await trigger();
          handleSubmit();
        },
      },
      {
        title: 'Đóng bài viết',
        icon: <FiX />,
        color: 'grey',
        onClick: () => {
          if (changed) {
            confirm('Bạn đã lưu bài viết?', () => {
              onClose();
            });
          } else {
            onClose();
          }
        },
      },
      // eslint-disable-next-line
    ]), [changed]);

  useEffect(() => {
    register('name', { required: 'Bắt buộc phải nhập tên bài viết' });
    register('description');
    register('publishDate');
    register('writter');
    register('categories');
    register('tags');
    register('parts');
  }, [register]);
  useEffect(() => {
    if (data) {
      reset({
        ...data,
        categories: (data?.categories ?? []).map((o) => o.id),
        tags: (data?.tags ?? []).map((o) => o.id),
        parts: (data?.parts ?? []).sort((a, b) => (a.order > b.order ? 1 : 0)),
      });
    } else {
      setValue('description', '');
      setValue('publishDate', new Date().toISOString());
      setValue('writter', username);
      setValue('categories', []);
      setValue('tags', []);
    }
    // eslint-disable-next-line
  }, [data]);

  return (
    <>
      <Dimmer inverted active={fetching}>
        <Loader />
      </Dimmer>
      <ToolbarWrapper>
        <StyledHeader>
          {data ? 'Sửa ' : 'Tạo '}
          bài viết
        </StyledHeader>
        <ActionsWrapper>
          {actions.map((o) => (
            <Action
              title={o.title}
              icon={o.icon}
              color={o.color}
              onClick={o.onClick}
            />
          ))}
        </ActionsWrapper>
      </ToolbarWrapper>
      <Grid>
        <Grid.Row>
          <Grid.Column width={postForm?.parts ? 8 : 16}>
            <Form>
              <Form.Group widths="equal">
                <Form.Field
                  width="4"
                  control={CategorySection}
                  data={watch('categories') || []}
                  onChange={(value: string[]): void => {
                    handleChange('categories', value || []);
                  }}
                />
                <Form.Field
                  width="12"
                  control={Input}
                  placeholder="Tên bài viết"
                  error={errors?.name?.message ?? false}
                  value={watch('name') || ''}
                  onChange={(e: any, { value }: any) => {
                    handleChange('name', value, true);
                  }}
                />
              </Form.Group>
              <Form.Group widths="equal">
                <Form.Field>
                  <TagSection
                    data={watch('tags') || []}
                    onChange={(value: string[]): void => {
                      handleChange('tags', value || []);
                    }}
                  />
                </Form.Field>
              </Form.Group>
              <Form.Group widths="equal">
                <Form.Field>
                  <DescriptionSection
                    onChange={(d: string) => {
                      handleChange('description', d);
                    }}
                  />
                </Form.Field>
              </Form.Group>
              <Form.Group widths="equal">
                <Form.Field>
                  <PartSection
                    data={watch('parts') || []}
                    onChange={(d: PartForm[]) => {
                      handleChange('parts', d || []);
                    }}
                  />
                </Form.Field>
              </Form.Group>
            </Form>
          </Grid.Column>
          {postForm?.parts && (
            <Grid.Column width="8">
              <PostPreview edit data={postForm} />
            </Grid.Column>
          )}
        </Grid.Row>
      </Grid>
    </>
  );
};

export default PostForm;
