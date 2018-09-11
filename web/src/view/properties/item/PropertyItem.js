import * as React from 'react';
import Editable from '../../../components/complex/editable/Editable';
import PropertyItemEditable from './editable/PropertyItemEditable';
import PropertyItemPreview from './preview/PropertyItemPreview';
import type { Property } from '../../../model/Property';

export type PropertyItemProps = {
  property: Property,
};

const PropertyItem = (props: PropertyItemProps) => (
  <Editable {...props}>
    {({ isEdited, ...restProps }) =>
      //prettier-ignore
      isEdited ?
        <PropertyItemEditable {...restProps} /> :
        <PropertyItemPreview {...restProps} />
    }
  </Editable>
);

export default PropertyItem;
