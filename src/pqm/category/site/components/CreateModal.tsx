import React, { useEffect, useCallback } from 'react';

import { useForm } from 'react-hook-form';

import { Modal, Form, Input, Select, Button } from 'semantic-ui-react';
import Map from '@pqm/category/site/components/Map';

import { useDispatch, useSelector, useFetchApi } from '@app/hooks';
import { getSiteTypes } from '@pqm/category/site-type/site-type.slice';
import { SiteCM } from '@pqm/category/site/site.model';
import siteService from '@pqm/category/site/site.service';

interface Props {
  open: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

const CreateModal: React.FC<Props> = ({ open, onClose, onRefresh }) => {
  const { districtList } = useSelector((state) => state.pqm.category.district);
  const { filter } = useSelector((state) => state.pqm.category.site);
  const { siteTypeList, getSiteTypesLoading } = useSelector(
    (state) => state.pqm.category.siteType,
  );
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const {
    formState: { errors },
    register,
    watch,
    reset,
    trigger,
    setValue,
    handleSubmit,
  } = useForm<SiteCM>({
    defaultValues: {},
  });
  const { fetch, fetching } = useFetchApi();
  const dispatch = useDispatch();

  const disabled =
    !!errors.code ||
    !!errors.name ||
    !!errors.districtId ||
    !!errors.siteTypeId ||
    !!errors.lat ||
    !!errors.lng;

  const onSubmit = useCallback(
    async (d: SiteCM) => {
      await fetch(
        siteService.createSite({
          ...d,
          order: d?.order ? parseInt((d.order as unknown) as string, 10) : 0,
        }),
      );
      onRefresh();
      onClose();
      reset({});
    },
    [reset, fetch, onClose, onRefresh],
  );

  useEffect(() => {
    register('order');
    register('code', { required: 'Bắt buộc nhập mã cở sở' });
    register('name', { required: 'Bắt buộc nhập tên cơ sở' });
    register('districtId', { required: 'Bắt buộc phải chọn quận/huyện' });
    register('siteTypeId', { required: 'Bắt buộc phải chọn loại hình cơ sở' });
    register('lat', { required: 'Bắt buộc phải chọn tọa độ cơ sở' });
    register('lng', { required: 'Bắt buộc phải chọn tọa độ cơ sở' });

    setValue('lat', 21.027763);
    setValue('lng', 105.83416);
  }, [register, setValue]);

  useEffect(() => {
    if (siteTypeList.length === 0) {
      dispatch(getSiteTypes());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {
    if (filter?.districtCode ?? false) {
      const value =
        (districtList || []).find(
          (o) => o.code === (filter?.districtCode ?? ''),
        )?.id ?? '';
      setValue('districtId', value);
    }
  }, [filter, districtList, setValue]);

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>Tạo mới</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Group widths="equal">
            <Form.Field
              required
              control={Input}
              label="Mã cơ sở"
              error={!!errors?.code?.message && errors.code.message}
              onChange={(__: any, { value }: any) => {
                setValue('code', value);
                trigger('code');
              }}
            />
            <Form.Field
              control={Input}
              label="Thứ tự"
              type="number"
              onChange={(__: any, { value }: any) => {
                setValue('order', parseInt((value as unknown) as string, 10));
              }}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field
              required
              control={Input}
              label="Tên cơ sở"
              error={!!errors?.name?.message && errors.name.message}
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
              label="Loại hình cơ sở"
              loading={getSiteTypesLoading}
              error={!!errors?.siteTypeId?.message && errors.siteTypeId.message}
              options={(siteTypeList || []).map((o) => ({
                value: o.id,
                text: o.name,
              }))}
              value={watch('siteTypeId') ?? ''}
              onChange={(__: any, { value }: any) => {
                setValue('siteTypeId', value);
                trigger('siteTypeId');
              }}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field
              control={Map}
              label="Tọa độ cơ sở"
              error={
                (!!errors?.lat?.message && errors.lat.message) ||
                (!!errors?.lng?.message && errors.lng.message)
              }
              value={{
                lat: watch('lat') ?? 21.027763,
                lng: watch('lng') ?? 105.83416,
              }}
              onChange={(lat: number, lng: number) => {
                setValue('lat', lat ?? 0);
                setValue('lng', lng ?? 0);
                trigger('lat');
                trigger('lng');
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

export default CreateModal;
