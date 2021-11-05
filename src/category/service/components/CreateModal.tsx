import React, { useMemo } from 'react';
import { Modal } from 'semantic-ui-react';

import SimpleForm from '@app/components/simple-form';
import { FormField } from '@app/models/form-field';
import { useFetchApi, useSelector } from '@app/hooks';

import serviceService from '../service.service';
import { ServiceCM } from '../service.model';

interface Props {
  open: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

const CreateModal: React.FC<Props> = (props) => {
  const { open, onClose, onRefresh } = props;
  const { fetch, fetching } = useFetchApi();

  // const serviceTypeList = useSelector(
  //   (state) => state.category.serviceType.serviceTypeList,
  // );
  const getServiceTypesLoading = useSelector(
    (state) => state.category.serviceType.getServiceTypesLoading,
  );

  const formFields = useMemo(
    (): FormField<ServiceCM>[] => [
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
      /*   {
          name: 'ServiceTypeId',
          label: 'Loại hình',
          type: 'select',
          options: serviceTypeList?.map((e) => ({ text: e.Name, value: e.Id })),
        }, */
      { name: 'Interval', label: 'Thời gian khám', inputType: 'number' },
      { name: 'Price', label: 'Giá', inputType: 'number' },
    ],
    // [serviceTypeList],
    [],
  );

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Modal.Header>Tạo mới</Modal.Header>
        <Modal.Content>
          <SimpleForm
            formFields={formFields}
            loading={fetching || getServiceTypesLoading}
            onSubmit={async (d): Promise<void> => {
              await fetch(serviceService.createService(d));
              onRefresh();
              onClose();
            }}
          />
        </Modal.Content>
      </Modal>
    </>
  );
};

export default CreateModal;
