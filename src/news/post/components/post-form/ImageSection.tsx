import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

import { Segment, Button } from 'semantic-ui-react';

const Wrapper = styled(Segment)`
  min-height: 5rem !important;
  padding: 1rem 1rem !important;
  & img {
    max-width: 450px;
    margin-left: auto;
    margin-right: auto;
  }
`;

interface Props {
  data?: string;
  isEdit: boolean;
  onChange: (data: string) => void;
}

const ImageSection: React.FC<Props> = ({ data, isEdit, onChange }) => {
  const imageInputRef = useRef() as React.MutableRefObject<HTMLInputElement>;

  const [selectedImage, setSelectedImage] = useState<File>();
  const [base64Image, setBase64Image] = useState<string>(data || '');

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
    setBase64Image(`data:${file.type};base64,${base64}`);
  };

  useEffect((): void => {
    if (!selectedImage) return;
    addImage(selectedImage);
    // eslint-disable-next-line
  }, [selectedImage]);
  useEffect(() => {
    if (base64Image !== '' && base64Image !== (data || '')) {
      onChange(base64Image);
    }
    // eslint-disable-next-line
  }, [base64Image]);
  useEffect(() => {
    if (isEdit) {
      setBase64Image('');
    }
  }, [isEdit]);

  return (
    <>
      <Wrapper placeholder size="small" attached="bottom">
        {base64Image === '' && (
          <Button primary onClick={() => imageInputRef.current.click()}>
            Thêm hình ảnh
          </Button>
        )}
        {base64Image !== '' && <img src={base64Image} alt="" />}
      </Wrapper>
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
    </>
  );
};

export default ImageSection;
