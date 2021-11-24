/* eslint-disable @typescript-eslint/unbound-method */
import React, { useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';

import {
  Modal,
  Form,
  Input,
  Select,
  TextArea,
  Button,
} from 'semantic-ui-react';

import { useDispatch, useSelector, useFetchApi } from '@app/hooks';
import {
  Indicator,
  IndicatorCM,
} from '@pqm/category/indicator/indicator.model';
import indicatorService from '@pqm/category/indicator/indicator.service';
import { getIndicatorGroups } from '@pqm/category/indicator-group/indicator-group.slice';

interface Props {
  data?: Indicator;
  onClose: () => void;
  onRefresh: () => void;
}

const UpdateModal: React.FC<Props> = ({ data, onClose, onRefresh }) => {
  const dispatch = useDispatch();
  const { fetch, fetching } = useFetchApi();
  const {
    reset,
    watch,
    trigger,
    setValue,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IndicatorCM>();

  const { indicatorGroupList, getIndicatorGroupsLoading } = useSelector(
    (state) => state.pqm.category.indicatorGroup,
  );
  const disabled =
    !!errors?.code?.message ||
    !!errors?.name?.message ||
    !!errors?.indicatorGroupId?.message;

  const onSubmit = useCallback(
    async (d: IndicatorCM) => {
      if (data?.id) {
        await fetch(
          indicatorService.updateIndicator({
            ...d,
            id: data?.id,
            order: parseInt((d.order as unknown) as string, 10),
          }),
        );
        onRefresh();
        onClose();
        reset({});
      }
    },
    [data, reset, fetch, onClose, onRefresh],
  );

  useEffect(() => {
    register('order');
    register('code', { required: 'Bắt buộc phải nhập mã chỉ số' });
    register('name', { required: 'Bắt buộc phải nhập tên chỉ số' });
    register('description');
    register('isTotal');
    register('indicatorGroupId', {
      required: 'Bắt buộc phải chọn nhóm chỉ số',
    });
  }, [register]);

  useEffect(() => {
    if (data?.id) {
      reset(data);
    }
  }, [data, reset]);

  useEffect(() => {
    if (indicatorGroupList.length === 0) {
      dispatch(getIndicatorGroups());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  return (
    <Modal open={Boolean(data?.id)} onClose={onClose}>
      <Modal.Header>Sửa đổi</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Group>
            <Form.Field
              required
              width={12}
              control={Input}
              label="Mã chỉ số"
              error={!!errors?.code?.message && errors.code.message}
              value={watch('code') ?? ''}
              onChange={(__: any, { value }: any) => {
                setValue('code', value);
              }}
              onBlur={() => trigger('code')}
            />
            <Form.Field
              width={4}
              control={Input}
              label="Thứ tự"
              type="number"
              value={watch('order') ?? 0}
              onChange={(__: any, { value }: any) => {
                setValue('order', parseInt((value as unknown) as string, 10));
                trigger('order');
              }}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field
              required
              control={Input}
              label="Tên chỉ số"
              error={!!errors?.name?.message && errors.name.message}
              value={watch('name') ?? ''}
              onChange={(__: any, { value }: any) => {
                setValue('name', value);
                trigger('name');
              }}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field
              required
              control={Select}
              label="Nhóm chỉ số"
              loading={getIndicatorGroupsLoading}
              error={
                !!errors?.indicatorGroupId?.message &&
                errors.indicatorGroupId.message
              }
              options={(indicatorGroupList || []).map((o) => ({
                value: o.id,
                text: o.name,
              }))}
              value={watch('indicatorGroupId')}
              onChange={(__: any, { value }: any) => {
                setValue('indicatorGroupId', value);
                trigger('indicatorGroupId');
              }}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field
              control={TextArea}
              label="Mô tả chỉ số"
              onChange={(__: any, { value }: any) => {
                setValue('description', value);
              }}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field
              control={Select}
              label="Tính tổng số hiện hữu"
              options={[
                { value: true, text: 'Có' },
                { value: false, text: 'Không' },
              ]}
              value={watch('isTotal') ?? false}
              onChange={(__: any, { value }: any) => {
                setValue('isTotal', value as boolean);
              }}
            />
          </Form.Group>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button
          positive
          content="Xác nhận"
          loading={fetching}
          disabled={disabled}
          onClick={handleSubmit((d) => onSubmit(d))}
        />
      </Modal.Actions>
    </Modal>
  );
};

export default UpdateModal;
