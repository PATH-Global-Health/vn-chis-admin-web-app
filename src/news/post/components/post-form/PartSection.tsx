import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';

import { Menu, Dropdown, Icon, Button } from 'semantic-ui-react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DraggableProvided,
} from 'react-beautiful-dnd';
import TextSection from '@news/post/components/post-form/TextSection';
import ImageSection from '@news/post/components/post-form/ImageSection';

import { useConfirm } from '@app/hooks';
import { Part as PartModel } from '@news/part/part.model';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  & > * {
    margin-bottom: 1em;
  }
`;
const Wrapper = styled.div`
  & .dropdown--custom {
    font-size: 1rem !important;
  }
`;
const ToolbarWrapper = styled.div`
  display: flex;
  padding: 0 0 1rem 0;
`;
const ActionsWrapper = styled.div`
  margin-left: auto;
  margin-right: auto;
`;

interface PropsPart {
  data: PartModel;
  provided: DraggableProvided;
  onDelete: (id: string) => void;
  onChange: (data: PartModel) => void;
}

interface PropsPartSection {
  data?: PartModel[];
  onChange: (d: PartModel[]) => void;
}

const Part: React.FC<PropsPart> = ({ data, provided, onDelete, onChange }) => {
  const confirm = useConfirm();

  const [value, setValue] = useState<PartModel>(data);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const handleChangeType = (type: number) => {
    if (type === value.type) return;
    if (data.content !== '') {
      confirm('Bạn có chắc muốn đổi kiểu dữ liệu', () => {
        setValue({ ...value, type });
      });
    } else {
      setValue({ ...value, type });
    }
  };

  useEffect(() => {
    if (value !== data) {
      onChange(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    // eslint-disable-next-line
    <Wrapper ref={provided.innerRef} {...provided.draggableProps}>
      <Menu icon size="small" attached="top">
        <Menu.Item {...provided.dragHandleProps}>
          <Icon name="ellipsis vertical" />
        </Menu.Item>
        <Menu.Menu position="right">
          <Dropdown simple item icon="code">
            <Dropdown.Menu className="dropdown--custom">
              <Dropdown.Item onClick={() => handleChangeType(0)}>
                Chữ
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleChangeType(1)}>
                Hình ảnh
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Menu.Item>
            <Icon name="edit" onClick={() => setIsEdit(!isEdit)} />
          </Menu.Item>
          <Menu.Item>
            <Icon name="trash" onClick={() => onDelete(data.id)} />
          </Menu.Item>
        </Menu.Menu>
      </Menu>
      {value.type === 0 && (
        <TextSection
          data={data.content}
          isEdit={isEdit}
          onChange={(d: string) =>
            setValue({ ...value, isEdited: true, content: d })
          }
        />
      )}
      {value.type === 1 && (
        <ImageSection
          data={data.content}
          isEdit={isEdit}
          onChange={(d: string) =>
            setValue({ ...value, isEdited: true, content: d })
          }
        />
      )}
    </Wrapper>
  );
};

const PartSection: React.FC<PropsPartSection> = ({ data, onChange }) => {
  const confirm = useConfirm();

  const [count, setCount] = useState<number>(0);
  const [partList, setPartList] = useState<PartModel[]>([]);

  const onDrag = ({ destination, source }: any): void => {
    if (!destination) return;
    // eslint-disable-next-line
    const _partList = Array.from(partList || []);
    const [removed] = _partList.splice(source.index, 1);
    _partList.splice(destination.index, 0, removed);
    _partList[destination.index] = {
      ..._partList[destination.index],
      isEdited: true,
    };
    _partList[source.index] = {
      ..._partList[source.index],
      isEdited: true,
    };
    setPartList(_partList);
  };

  const addPart = () => {
    setPartList([
      ...(partList || []),
      {
        id: uuidv4(),
        order: count,
        type: 0,
        content: '',
        isNew: true,
      },
    ]);
    setCount(count + 1);
  };

  const handleChange = (d: PartModel): void => {
    const partListChanged = (partList || []).reduce(
      (array: PartModel[], object: PartModel) => {
        // eslint-disable-next-line
        let _object = object;
        if (d.id === object.id) {
          _object = d;
        }
        return [...array, _object];
      },
      [],
    );
    setPartList(partListChanged);
  };

  const handleDelete = (id: string): void => {
    confirm('Xác nhận xoá', () => {
      setPartList(
        (partList || []).map((o) => ({
          ...o,
          isDeleted: o.isDeleted ? o.isDeleted : o.id === id,
        })),
      );
    });
  };

  useEffect(() => {
    if (data && data.length > 0 && data !== partList) {
      setPartList(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);
  useEffect(() => {
    if (partList && partList.length > 0 && partList !== data) {
      onChange(partList);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [partList]);

  return (
    <>
      <ToolbarWrapper>
        <ActionsWrapper>
          <Button small color="teal" onClick={() => addPart()}>
            Thêm đoạn
          </Button>
        </ActionsWrapper>
      </ToolbarWrapper>
      <DragDropContext onDragEnd={onDrag}>
        <Droppable droppableId="parts">
          {(dropProvided) => (
            // eslint-disable-next-line
            <Container ref={dropProvided.innerRef} {...dropProvided.droppableProps}>
              {(partList || [])
                .filter((o) => !o?.isDeleted ?? false)
                .map((o, index) => (
                  <Draggable key={o.id} draggableId={o.id} index={index}>
                    {(dragProvided) => (
                      <Part
                        data={o}
                        provided={dragProvided}
                        onDelete={(id: string): void => {
                          handleDelete(id);
                        }}
                        onChange={(d: PartModel) => handleChange(d)}
                      />
                    )}
                  </Draggable>
                ))}
              {dropProvided.placeholder}
            </Container>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
};

export default PartSection;
