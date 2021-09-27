import React, { useState } from 'react';
import { Checkbox } from 'semantic-ui-react';

interface Props {
  checked?: boolean;
  onChange: (b: boolean) => void;
}

const RowCheckbox: React.FC<Props> = (props) => {
  const { checked, onChange } = props;
  const [value, setValue] = useState<boolean>(checked || false);

  return (
    <Checkbox
      checked={value}
      onChange={(e): void => {
        e.stopPropagation();
        onChange(!value);
        setValue(!value);
      }}
    />
  );
};

export default RowCheckbox;
