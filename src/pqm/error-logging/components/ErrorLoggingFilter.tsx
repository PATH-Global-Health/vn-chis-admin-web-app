import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import moment from 'moment';

import { Form, Select } from 'semantic-ui-react';
import { DatePicker } from '@app/components/date-picker';

import { useDispatch } from '@app/hooks';
import { setErrorFilter } from '@pqm/error-logging/slices';
import { errorOptions } from '@pqm/error-logging/utils';

const Wrapper = styled.div`
  padding: 0 0 8px 0;
`;

const ErrorLoggingFilter: React.FC = () => {
  const [code, setCode] = useState('');
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      setErrorFilter({
        code,
        from: from ? moment(from).format('YYYY-MM-DD') : undefined,
        to: to ? moment(to).format('YYYY-MM-DD') : undefined,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, from, to]);

  return (
    <Wrapper>
      <Form>
        <Form.Group widths="equal">
          <Form.Field
            search
            deburr
            clearable
            label="Mã"
            control={Select}
            value={code}
            options={errorOptions}
            onChange={(__: any, { value }: any) => {
              setCode(value);
            }}
          />
        </Form.Group>
        <Form.Group widths="equal">
          <Form.Field
            label="Từ ngày"
            control={DatePicker}
            disabledDays={[{ after: new Date() }]}
            value={to}
            onChange={setFrom}
          />
          <Form.Field
            label="Tới ngày"
            control={DatePicker}
            disabledDays={[
              {
                after: new Date(),
                before: from || undefined,
              },
            ]}
            value={to}
            onChange={setTo}
          />
        </Form.Group>
      </Form>
    </Wrapper>
  );
};

export default ErrorLoggingFilter;
