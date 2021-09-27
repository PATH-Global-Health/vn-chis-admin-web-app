import React, { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';

import { Modal, Form, Input, Select, Button } from 'semantic-ui-react';

import { useFetchApi, useSelector, useDispatch } from '@app/hooks';
import { UnitCM } from '@unit/unit.model';
import { User } from '@admin/user-management/user/user.model';
import { getUnitTypes } from '@category/unit-type/unit-type.slice';

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

  const onSubmit = (payload: UnitCM) => {};

  useEffect(() => {
    register('unitTypeId', { required: 'Bắt buộc phải chọn cơ sở' });
    register('name', { required: 'Bắt buộc phải nhập tên cơ sở' });
  }, [register]);
  useEffect(() => {
    if (unitTypeList.length === 0)
      dispatch(getUnitTypes());
  }, [dispatch, unitTypeList]);
  useEffect(() => {
    console.log(errors);
  }, [errors]);

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
        </Form>
      </Modal.Content>
    </Modal>
  )
};

export default CreateUnitWithUserModal;