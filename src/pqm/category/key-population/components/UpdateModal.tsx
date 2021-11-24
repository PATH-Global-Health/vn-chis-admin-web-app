/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/unbound-method */
import React, { useEffect } from 'react';

import { useForm } from 'react-hook-form';
import { Modal, Form, Input, Button } from 'semantic-ui-react';

import { useFetchApi } from '@app/hooks';
import {
  KeyPopulation,
  KeyPopulationUM,
} from '@pqm/category/key-population/key-population.model';
import keyPopulationService from '@pqm/category/key-population/key-population.service';

interface Props {
  data?: KeyPopulation;
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
  } = useForm<KeyPopulationUM>({
    defaultValues: {},
  });

  const disabled = !!errors?.name?.message;

  const onSubmit = async (d: KeyPopulationUM) => {
    if (data?.id) {
      const p: KeyPopulationUM = {
        id: data.id,
        name: d.name,
      };

      if (d?.order) {
        p.order = parseInt((d.order as unknown) as string, 10);
      } else {
        p.order = 0;
      }

      await fetch(keyPopulationService.updateKeyPopulation(p));
      onRefresh();
      onClose();
      reset({});
    }
  };

  useEffect(() => {
    register('name', { required: 'Bắt buộc phải nhập tên nhóm nguy cơ' });
    register('order');
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
                control={Input}
                label="Tên nhóm nguy cơ"
                error={!!errors?.name?.message && errors.name.message}
                value={watch('name')}
                onChange={(__: any, { value }: any) => {
                  setValue('name', value);
                }}
                onBlur={() => trigger('name')}
              />
            </Form.Group>
            <Form.Group widths="equal">
              <Form.Field
                type="number"
                control={Input}
                label="Thứ tự"
                value={watch('order')}
                onChange={(__: any, { value }: any) => {
                  setValue('order', value);
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
    </>
  );
};

export default UpdateModal;
