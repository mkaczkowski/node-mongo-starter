// @flow
/**
 * Section wrapper for switching between preview and editable form using data context
 */
import * as React from 'react';
import { PropertiesContext } from '../../../providers/Properties';
import type { Property } from '../../../model/Property';

export type EditableItemProps = {
  children: any,
  // eslint-disable-next-line react/no-unused-prop-types
  property?: Property
};

export type EditableItemState = {|
  isEdited: boolean,
|};

class Editable extends React.PureComponent<EditableItemProps, EditableItemState> {
  state = {
    isEdited: false,
  };

  onShowEdit = () => this.setState(() => ({ isEdited: true }));

  onHideEdit = () => this.setState(() => ({ isEdited: false }));

  render() {
    const { isEdited } = this.state;
    const enchantSuccessCallback = params => () => params.onSuccess(this.onHideEdit);
    return (
      <PropertiesContext.Consumer>
        {context => {
          const combinedProps = {
            ...context,
            ...this.props,
            onShowEdit: this.onShowEdit,
            onCancel: this.onHideEdit,
            onUpdate: params => context.api.update({ ...params, onSuccess: enchantSuccessCallback(params) }),
            isEdited,
          };
          return this.props.children(combinedProps);
        }}
      </PropertiesContext.Consumer>
    );
  }
}

export default Editable;
