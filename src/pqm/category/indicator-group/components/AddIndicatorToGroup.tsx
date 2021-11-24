import React, { useState, useCallback, useEffect } from 'react';

import { Modal, Form, Select, Button } from 'semantic-ui-react';

import { useFetchApi, useDispatch, useSelector } from '@app/hooks';
import { Indicator } from '@pqm/category/indicator/indicator.model';
import { getIndicators as fetchIndicators } from '@pqm/category/indicator/indicator.slice';
import {
  IndicatorGroup,
  IndicatorGroupUM,
} from '@pqm/category/indicator-group/indicator-group.model';
import indicatorGroupService from '@pqm/category/indicator-group/indicator-group.service';

interface Props {
  open: boolean;
  onClose: () => void;
  onRefresh: (d: IndicatorGroup) => void;
}

const AddIndicatorToGroup: React.FC<Props> = ({ open, onClose, onRefresh }) => {
  const { selectedIndicatorGroup } = useSelector(
    (state) => state.pqm.category.indicatorGroup,
  );
  const { indicatorList, getIndicatorsLoading } = useSelector(
    (state) => state.pqm.category.indicator,
  );
  const { fetch, fetching } = useFetchApi();
  const dispatch = useDispatch();

  const [selected, setSelected] = useState<Indicator>();

  const getIndicators = useCallback(() => {
    dispatch(fetchIndicators());
  }, [dispatch]);

  const onSubmit = useCallback(async () => {
    if (selectedIndicatorGroup?.id ?? false) {
      const indicators =
        (selectedIndicatorGroup?.indicators &&
          selected && [...selectedIndicatorGroup.indicators, selected]) ||
        [];
      const data: IndicatorGroupUM = {
        id: selectedIndicatorGroup?.id ?? '',
        name: selectedIndicatorGroup?.name ?? '',
        indicators,
      };
      await fetch(indicatorGroupService.updateIndicatorGroup(data));
      onRefresh(data);
      onClose();
    }
  }, [selected, selectedIndicatorGroup, fetch, onRefresh, onClose]);

  useEffect(() => {
    if (indicatorList.length === 0) {
      getIndicators();
    } else {
      setSelected(indicatorList[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getIndicators]);

  return (
    <Modal open={open && Boolean(selectedIndicatorGroup)} onClose={onClose}>
      <Modal.Header>Thêm chỉ số vào nhóm</Modal.Header>
      <Modal.Content>
        <Form loading={getIndicatorsLoading}>
          <Form.Group widths="equal">
            <Form.Field
              control={Select}
              label="Tên chỉ số"
              error={!selected ? 'Bắt buộc phải chọn chỉ số' : false}
              options={(indicatorList || [])
                .filter(
                  (o) =>
                    !(selectedIndicatorGroup?.indicators ?? []).some(
                      (_o) => o.id === _o.id,
                    ),
                )
                .map((o) => ({
                  value: o.id,
                  text: o.name,
                }))}
              value={selected?.id ?? ''}
              onChange={(e: any, { value }: any) => {
                setSelected((indicatorList || []).find((o) => value === o.id));
              }}
            />
          </Form.Group>
          <Button
            primary
            content="Xác nhận"
            loading={fetching}
            disabled={!selected}
            onClick={() => onSubmit()}
          />
        </Form>
      </Modal.Content>
    </Modal>
  );
};

export default AddIndicatorToGroup;
