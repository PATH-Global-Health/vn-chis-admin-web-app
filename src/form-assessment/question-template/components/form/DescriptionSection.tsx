import React, { useState } from 'react';

import { Accordion } from 'semantic-ui-react';

interface Props {
  data?: string;
  onChange: (value: string) => void;
}
const DescriptionSection: React.FC<Props> = ({ data, onChange }) => {
  const [expand, setExpand] = useState<boolean>(false);
  const [value, setValue] = useState<string>('');

  return (
    <Accordion fluid styled>

    </Accordion>
  )
};

export default DescriptionSection;