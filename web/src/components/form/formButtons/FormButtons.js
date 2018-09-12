// @flow
import * as React from 'react';
import Button from '../../common/button/Button';
import type { ActionButtonsType } from '../../complex/actionButtons/ActionButtons';
import {} from './FormButtons.css';

export type FormButtonsType = ActionButtonsType & {
  isSubmitting: boolean,
};

const FormButtons = ({ isSubmitting, onCancel }: FormButtonsType) => (
  <div styleName="wrapper">
    <Button type="button" disabled={isSubmitting} onClick={onCancel}>
      Cancel
    </Button>
    <Button type="submit" primary disabled={isSubmitting} loading={isSubmitting}>
      Save
    </Button>
  </div>
);

export default FormButtons;
