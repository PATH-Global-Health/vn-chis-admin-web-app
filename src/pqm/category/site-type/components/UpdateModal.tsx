import React, { useEffect } from 'react';

import { useForm } from 'react-hook-form';

import { Modal, Form, Input, Button } from 'semantic-ui-react';

import { useFetchApi } from '@app/hooks';
import { SiteType, SiteTypeUM } from '@pqm/category/site-type/site-type.model';
import siteTypeService from '@pqm/category/site-type/site-type.service';

interface Props {
  data?: SiteType;
  onClose: () => void;
  onRefresh: () => void;
}

const UpdateModal: React.FC<Props> = ({ data, onClose, onRefresh }) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const {
    formState: { errors },
    register,
    trigger,
    reset,
    watch,
    setValue,
    handleSubmit,
  } = useForm<SiteTypeUM>({
    defaultValues: {},
  });
  const { fetch, fetching } = useFetchApi();

  const disabled = !!errors.name;

  const onSubmit = async (d: SiteTypeUM): Promise<void> => {
    if (data?.id) {
      await fetch(
        siteTypeService.updateSiteType({
          ...d,
          id: data?.id,
        }),
      );
      onRefresh();
      onClose();
      reset({});
    }
  };

  useEffect(() => {
    register('name', { required: 'Bắt buộc phải nhập loại cơ sở' });
  }, [register]);

  useEffect(() => {
    if (data?.id) {
      reset(data);
    }
  }, [data, reset]);

  return (
    <Modal open={Boolean(data?.id)} onClose={onClose}>
      <Modal.Header>Sửa đổi</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Group widths="equal">
            <Form.Field
              required
              control={Input}
              label="Tên loại cơ sở"
              error={!!errors?.name?.message && errors.name.message}
              value={watch('name') || ''}
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
  );
};

export default UpdateModal;
