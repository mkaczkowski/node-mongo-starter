// @flow
import * as React from 'react';
import Hover from '../../../../components/common/hover/Hover';
import ActionButtons from '../../../../components/complex/actionButtons/ActionButtons';
import type { PropertiesContextProps } from '../../../../providers/Properties';
import type { ActionButtonsType } from '../../../../components/complex/actionButtons/ActionButtons';
import type { Property } from '../../../../model/Property';
import type { PropertyItemProps } from '../PropertyItem';

import './PropertyItemPreview.css';

const OwnerColumn = ({ property: { owner } }: Property) => <div>{owner}</div>;

const AddressColumn = ({ property: { address } }: Property) => (
  <div>
    {address.line1 && <div>{address.line1}</div>}
    {address.line2 && <div>{address.line2}</div>}
    {address.line3 && <div>{address.line3}</div>}
    {address.line4 && <div>{address.line4}</div>}
    <div>{address.postCode}</div>
    <div>{address.city}</div>
    <div>{address.country}</div>
  </div>
);

const IncomeColumn = ({ property: { incomeGenerated } }: Property) => {
  //TODO currency should be given from API or locale based
  const currency = '£';
  return <div>{incomeGenerated} {currency}</div>;
};

type PropertyItemPreviewProps = PropertyItemProps & PropertiesContextProps & ActionButtonsType;

const PropertyItemPreview = ({ property, api, defaultItem, ...actionProps }: PropertyItemPreviewProps) => (
  <Hover>
    {isHovered => (
      <div styleName="wrapper">
        <div styleName="row">
          <OwnerColumn property={property} />
          <AddressColumn property={property} />
          <IncomeColumn property={property} />
        </div>
        {isHovered && <ActionButtons edit id={property._id} defaultItem={defaultItem} {...actionProps} />}
      </div>
    )}
  </Hover>
);

export default PropertyItemPreview;
