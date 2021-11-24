/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/unbound-method */
import React, { useEffect } from 'react';

import { useForm } from 'react-hook-form';
import { Modal, Form, Input, Button } from 'semantic-ui-react';

import { useFetchApi } from '@app/hooks';
import {
  IndicatorGroup,
  IndicatorGroupUM,
} from '@pqm/category/indicator-group/indicator-group.model';
import indicatorGroupService from '@pqm/category/indicator-group/indicator-group.service';

interface Props {
  data?: IndicatorGroup;
  onClose: () => void;
  onRefresh: () => void;
}
const UpdateModal: React.FC<Props> = (props) => {
  const { data, onClose, onRefresh } = props;

  const { fetch, fetching } = useFetchApi();
  const {
    formState: { errors },
    register,
    watch,
    reset,
    trigger,
    setValue,
    handleSubmit,
  } = useForm<IndicatorGroupUM>({
    defaultValues: {},
  });

  const disabled = !!errors?.name?.message;

  const onSubmit = async (d: IndicatorGroupUM) => {
    if (data?.id) {
      const p: IndicatorGroupUM = {
        id: data.id,
        name: d.name,
        indicators: data.indicators,
      };

      await fetch(indicatorGroupService.updateIndicatorGroup(p));
      onRefresh();
      onClose();
      reset({});
    }
  };

  useEffect(() => {
    register('name', { required: 'Bắt buộc phải nhập tên nhóm chỉ số' });
  }, [register, watch]);

  useEffect(() => {
    if (data?.id) {
      reset(data);
    }
  }, [data, reset]);

  return (
    <>
      <Modal open={Boolean(data)} onClose={onClose}>
        <Modal.Header>Cập nhật</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Group widths="equal">
              <Form.Field
                required
                width={10}
                control={Input}
                label="Tên nhóm chỉ số"
                error={!!errors?.name?.message && errors.name.message}
                value={watch('name')}
                onChange={(__: any, { value }: any) => {
                  setValue('name', value);
                }}
                onBlur={() => trigger('name')}
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
    </>
  );
};

export default UpdateModal;
