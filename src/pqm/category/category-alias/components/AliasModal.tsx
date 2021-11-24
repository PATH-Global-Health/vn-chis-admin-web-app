import React, { useMemo } from 'react';

import { Modal } from 'semantic-ui-react';
import SimpleForm from '@app/components/simple-form';
import { FormField } from '@app/models/form-field';

import { useSelector, useFetchApi } from '@app/hooks';
import { CategoryAlias } from '@pqm/category/category-alias/category-alias.model';
import categoryAliasService from '@pqm/category/category-alias/category-alias.service';

interface Props {
  open: boolean;
  data?: CategoryAlias;
  onRefresh: () => void;
  onClose: () => void;
}

const AliasModal: React.FC<Props> = ({ open, data, onClose, onRefresh }) => {
  const { selectedCategory, getAliasesOfCategoryLoading } = useSelector(
    (state) => state.pqm.category.categoryAlias,
  );

  const formFields = useMemo(
    (): FormField<CategoryAlias>[] => [
      {
        name: 'id',
        hidden: true,
      },
      {
        name: 'categoryId',
        hidden: true,
      },
      {
        name: 'alias',
        label: 'Tên viết tắt',
      },
      {
        name: 'category',
        hidden: true,
      },
    ],
    [],
  );

  const { fetch, fetching } = useFetchApi();

  const handleSubmit = async (d: CategoryAlias): Promise<void> => {
    await fetch(
      d.id
        ? categoryAliasService.updateCategoryAlias(d)
        : categoryAliasService.createCategoryAlias({
            ...d,
            category: selectedCategory?.type ?? '',
            categoryId: selectedCategory?.id ?? '',
          }),
    );
    onRefresh();
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>{data ? 'Sửa ' : 'Tạo '}</Modal.Header>
      <Modal.Content>
        <SimpleForm
          defaultValues={data}
          formFields={formFields}
          loading={fetching || getAliasesOfCategoryLoading}
          onSubmit={handleSubmit}
        />
      </Modal.Content>
    </Modal>
  );
};

export default AliasModal;
