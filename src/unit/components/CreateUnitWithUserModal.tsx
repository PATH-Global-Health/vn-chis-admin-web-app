import React, { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';

import { Modal, Form, Input, TextArea, Select } from 'semantic-ui-react';
import NumberFormat from 'react-number-format';

import { useFetchApi, useSelector, useDispatch, useAddress } from '@app/hooks';
import { User } from '@admin/user-management/user/user.model';
import { getUnitTypes } from '@category/unit-type/unit-type.slice';
import { UnitCM } from '@unit/unit.model';
import unitService from '@unit/unit.service';

interface Props {
  data?: User;
  onClose: () => void;
}

const CreateUnitWithUserModal: React.FC<Props> = (props) => {
  const { data, onClose } = props;

  const {
    errors,
    register,
    trigger,
    reset,
    watch,
    setValue,
    handleSubmit
  } = useForm<UnitCM>();
  const {
    setProvince,
    setDistrict,
    provinceOptions,
    districtOptions,
    wardOptions,
  } = useAddress('79', '760', '');
  const dispatch = useDispatch();
  const { fetch, fetching } = useFetchApi();
  const { unitTypeList, getUnitTypeLoading } = useSelector(
    (state) => state.category.unitType,
  );

  const unitTypeOptions = useMemo(() =>
    (unitTypeList || []).map((unitType) => ({
      key: unitType.id,
      value: unitType.id,
      text: unitType.code,
    })),
  [unitTypeList]);

  const onSubmit = async (payload: UnitCM): Promise<void> => {
    if (data?.username) {
      await fetch(unitService.createUnitWithUser(data.username, payload));
      onClose();
      reset({});
    }
  };

  useEffect(() => {
    register('unitTypeId', { required: 'Bắt buộc phải chọn cơ sở' });
    register('name', { required: 'Bắt buộc phải nhập tên cơ sở' });
    register('phone', { required: 'Bắt buộc phải nhập số điện thoại' });
    register('email', {
      validate: (d) => {
        // eslint-disable-next-line no-useless-escape
        const regex = new RegExp('[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$')
        if (d && !regex.test(d))
          return 'Email không đúng định dạng';
        return true;
      }
    });
    register('website');
    register('introduction');
    register('province', { required: 'Bắt buộc phải chọn tỉnh/thành' });
    register('district', { required: 'Bắt buộc phải chọn quận/huyện' });
    register('ward', { required: 'Bắt buộc phải chọn phường/xã' });
    register('address', { required: 'Bắt buộc phải nhập địa chỉ' });
  }, [register]);
  useEffect(() => {
    if (unitTypeList.length === 0)
      dispatch(getUnitTypes());
  }, [dispatch, unitTypeList]);

  return (
    <Modal open={Boolean(data?.id)} onClose={onClose}>
      <Modal.Header>Tạo cơ sở với tài khoản {data?.username ?? '#'}</Modal.Header>
      <Modal.Content>
        <Form loading={fetching} onSubmit={handleSubmit((d) => onSubmit(d))}>
          <Form.Group>
            <Form.Field
              fluid
              required
              width={6}
              error={errors?.unitTypeId?.message}
              loading={getUnitTypeLoading}
              label="Loại cơ sở"
              control={Select}
              options={unitTypeOptions}
              value={watch('unitTypeId') || undefined}
              onChange={(_: any, d: any): void => setValue('unitTypeId', d.value)}
              onBlur={(): void => {
                trigger('unitTypeId');
              }}
            />
            <Form.Field
              fluid
              required
              width={10}
              error={errors?.name?.message}
              label="Tên cơ sở"
              control={Input}
              value={watch('name') || ''}
              onChange={(_: any, { value }: any): void => setValue('name', value)}
              onBlur={(): void => {
                trigger('name');
              }}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field
              required
              label="Số điện thoại"
              control={NumberFormat}
              value={watch('phone') || ''}
              onValueChange={(values: any): void => {
                const { value } = values;
                setValue('phone', value);
              }}
              onBlur={(): void => {
                trigger('phone');
              }}
            />
            <Form.Field
              fluid
              type="email"
              error={errors?.email?.message}
              label="Email"
              control={Input}
              value={watch('email') || ''}
              onChange={(_: any, { value }: any): void => setValue('email', value)}
              onBlur={(): void => {
                trigger('email');
              }}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field
              fluid
              label="Website"
              control={Input}
              value={watch('website') || ''}
              onChange={(_: any, { value }: any): void => setValue('website', value)}
              onBlur={(): void => {
                trigger('website');
              }}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field
              label="Mô tả"
              control={TextArea}
              value={watch('introduction') || ''}
              onChange={(_: any, { value }: any): void => setValue('introduction', value)}
              onBlur={(): void => {
                trigger('introduction');
              }}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field
              fluid
              required
              error={errors?.province?.message}
              label="Tỉnh/Thành"
              control={Select}
              options={provinceOptions}
              value={watch('province') || undefined}
              onChange={(_: any, d: any): void => {
                setValue('province', d.value);
                setProvince(d.value);
              }}
              onBlur={(): void => {
                trigger('province');
              }}
            />
            <Form.Field
              fluid
              required
              error={errors?.district?.message}
              label="Quận/Huyện"
              control={Select}
              options={districtOptions}
              value={watch('district') || undefined}
              onChange={(_: any, d: any): void => {
                setValue('district', d.value);
                setDistrict(watch('province') || '', d.value);
              }}
              onBlur={(): void => {
                trigger('district');
              }}
            />
            <Form.Field
              fluid
              required
              error={errors?.ward?.message}
              label="Phường/Xã"
              control={Select}
              options={wardOptions}
              value={watch('ward') || undefined}
              onChange={(_: any, d: any): void => setValue('ward', d.value)}
              onBlur={(): void => {
                trigger('ward');
              }}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field
              fluid
              required
              error={errors?.address?.message}
              label="Địa chỉ"
              control={Input}
              value={watch('address') || ''}
              onChange={(_: any, { value }: any): void => setValue('address', value)}
              onBlur={(): void => {
                trigger('address');
              }}
            />
          </Form.Group>
          <Form.Button primary content="Xác nhận" />
        </Form>
      </Modal.Content>
    </Modal>
  )
};

export default CreateUnitWithUserModal;