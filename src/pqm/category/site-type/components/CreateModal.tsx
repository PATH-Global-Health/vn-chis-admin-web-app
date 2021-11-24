import React, { useEffect } from 'react';

import { useForm } from 'react-hook-form';

import { Modal, Form, Input, Button } from 'semantic-ui-react';

import { useFetchApi } from '@app/hooks';
import { SiteTypeCM } from '@pqm/category/site-type/site-type.model';
import siteTypeService from '@pqm/category/site-type/site-type.service';

interface Props {
  open: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

const CreateModal: React.FC<Props> = ({ open, onClose, onRefresh }) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const {
    formState: { errors },
    register,
    trigger,
    reset,
    watch,
    setValue,
    handleSubmit,
  } = useForm<SiteTypeCM>({
    defaultValues: {},
  });
  const { fetch, fetching } = useFetchApi();

  const disabled = !!errors.name;

  const onSubmit = async (d: SiteTypeCM): Promise<void> => {
    await fetch(siteTypeService.createSiteType(d));
    onRefresh();
    onClose();
    reset({});
  };

  useEffect(() => {
    register('name', { required: 'Bắt buộc phải nhập loại cơ sở' });
  }, [register]);

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>Tạo mới</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Group widths="equal">
            <Form.Field
              required
              control={Input}
              label="Tên loại cơ sở"
              error={!!errors?.name?.message && errors.name.message}
              value={watch('name') ?? ''}
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

export default CreateModal;
