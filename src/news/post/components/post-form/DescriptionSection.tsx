import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

import { Menu, Label, Icon } from 'semantic-ui-react';

const Wrapper = styled.div`
  & .ui.menu {
    box-shadow: none;
  }
  & .item {
    padding-top: 0.4rem !important;
    padding-bottom: 0.4rem !important;
  }
  & .header {
    font-size: 0.9rem !important;
    padding-left: 0.8rem !important;
    padding-right: 0.8rem !important;
  }
  & .content {
    padding-left: 0.6rem !important;
    padding-right: 0.6rem !important;

    &::before {
      background-color: white !important;
    }

    & .dropdown {
      min-height: 0 !important;
      &--custom {
        font-size: 1rem !important;
      }
    }
  }
  & .label {
    margin-left: 0 !important;
    margin-right: 0.4rem;
    padding: 0.5rem !important;
    font-size: 14px !important;
    & .plus.icon {
      cursor: pointer;
      margin-right: 0em;
      font-size: 0.94444444em;
      opacity: 0.5;
      transition: background 0.1s ease;

      &:hover {
        opacity: 1;
      }
    }
  }
`;

interface Props {
  data?: string;
  onChange: (data: string) => void;
}

const DescriptionSection: React.FC<Props> = ({ data, onChange }) => {
  const imageInputRef = useRef() as React.MutableRefObject<HTMLInputElement>;

  const [selectedImage, setSelectedImage] = useState<File>();
  const [infoImage, setInfoImage] = useState<string>('');
  const [base64Image, setBase64Image] = useState<string>('');

  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (reader?.result) {
          let encoded = reader.result.toString().replace(/^.*,/, '') ?? 1;
          if (encoded.length % 4 > 0) {
            encoded += '='.repeat(4 - (encoded.length % 4));
          }
          resolve(encoded);
        } else {
          reject(new Error('Empty file'));
        }
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const addImage = async (file: File) => {
    const base64 = await convertImageToBase64(file);
    setInfoImage(file.name);
    setBase64Image(`data:${file.type};base64,${base64}`);
  };

  useEffect((): void => {
    if (data && data !== '' && data !== base64Image) {
      const parse = /^name:(.*?);(.*)/i.exec(data);
      setInfoImage(parse ? parse[1] : 'Unknown');
      setBase64Image(parse ? parse[2] : data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);
  useEffect((): void => {
    if (!selectedImage) return;
    addImage(selectedImage);
    // eslint-disable-next-line
  }, [selectedImage]);
  useEffect((): void => {
    if (base64Image !== '' && base64Image !== (data || '')) {
      onChange(`name:${selectedImage?.name ?? ''};${base64Image}`);
    }
    // eslint-disable-next-line
  }, [base64Image]);

  return (
    <Wrapper>
      <Menu icon size="small">
        <Menu.Item className="header">Ảnh bìa</Menu.Item>
        <Menu.Item className="content">
          {base64Image !== '' && (
            <Label>
              {infoImage}
              <Icon
                name="delete"
                onClick={(): void => {
                  setInfoImage('');
                  setBase64Image('');
                }}
              />
            </Label>
          )}
          {base64Image === '' && (
            <Label>
              <Icon name="plus" onClick={() => imageInputRef.current.click()} />
            </Label>
          )}
        </Menu.Item>
      </Menu>
      <input
        hidden
        ref={imageInputRef}
        type="file"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          if (!e.target.files) return false;
          setSelectedImage(e.target.files[0]);
        }}
        accept=".png, .jpg"
      />
    </Wrapper>
  );
};

export default DescriptionSection;
