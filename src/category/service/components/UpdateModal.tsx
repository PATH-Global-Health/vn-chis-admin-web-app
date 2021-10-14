import React, { useMemo } from 'react';
import { Modal } from 'semantic-ui-react';

import SimpleForm from '@app/components/simple-form';
import { FormField } from '@app/models/form-field';
import { useFetchApi, useSelector } from '@app/hooks';

import serviceService from '../service.service';
import { Service } from '../service.model';

interface Props {
  data?: Service;
  onClose: () => void;
  onRefresh: () => void;
}

const UpdateModal: React.FC<Props> = (props) => {
  const { data, onClose, onRefresh } = props;
  const { fetch, fetching } = useFetchApi();

  const serviceTypeList = useSelector(
    (state) => state.category.serviceType.serviceTypeList,
  );
  const getServiceTypesLoading = useSelector(
    (state) => state.category.serviceType.getServiceTypesLoading,
  );

  const formFields = useMemo(
    (): FormField<Service>[] => [
      { name: 'Id', hidden: true },
      { name: 'code', label: 'Mã' },
      { name: 'name', label: 'Dịch vụ' },
      {
        name: 'serviceFormId',
        label: 'Hình thức',
        type: 'select',
        options: [
          { text: 'KCB tại cơ sở', value: 'KCB tại cơ sở' },
          { text: 'Tư vấn sức khỏe từ xa', value: 'Tư vấn sức khỏe từ xa' },
          { text: 'Telemedicine', value: 'Telemedicine' },
          { text: 'Homecare', value: 'Homecare' },
          { text: 'Tiêm chủng', value: 'Tiêm chủng' },
        ],
      },
      /*  {
         name: 'ServiceTypeId',
         label: 'Loại hình',
         type: 'select',
         options: serviceTypeList?.map((e) => ({ text: e.Name, value: e.Id })),
       }, */
      { name: 'Interval', label: 'Thời gian khám', inputType: 'number' },
      { name: 'Price', label: 'Giá', inputType: 'number' },
    ],
    [serviceTypeList],
  );

  return (
    <>
      <Modal open={Boolean(data)} onClose={onClose}>
        <Modal.Header>Cập nhật</Modal.Header>
        <Modal.Content>
          <SimpleForm
            defaultValues={data}
            formFields={formFields}
            loading={fetching || getServiceTypesLoading}
            onSubmit={async (d): Promise<void> => {
              await fetch(serviceService.updateService(d));
              onRefresh();
              onClose();
            }}
          />
        </Modal.Content>
      </Modal>
    </>
  );
};

export default UpdateModal;
