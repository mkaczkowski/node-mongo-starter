// @flow
import * as React from 'react';
import { Formik } from 'formik';
import _omitBy from 'lodash/omitBy';
import _isUndefined from 'lodash/isUndefined';
import Error from '../../../../components/form/error/Error';
import FormButtons from '../../../../components/form/formButtons/FormButtons';
import DisplayFormikState from '../../../../components/form/helpers/DisplayFormikState';
import * as Validators from '../../../../util/validation/validation';
import type { PropertiesContextProps } from '../../../../providers/Properties';
import type { PropertyItemProps } from '../PropertyItem';
import type { Property } from '../../../../model/Property';

import './PropertyItemEditable.css';
import { integer } from '../../../../util/validation/validation';

type InputProps = {
  title: string,
  name: string,
  //TODO make more generic validators
  required?: boolean,
  numeric?: boolean,
  integer?: boolean,
};

const inputs: InputProps[] = [
  { title: 'Owner', name: 'owner', required: true },
  { title: 'Address (1)', name: 'line1', required: true },
  { title: 'Address (2)', name: 'line2', required: false },
  { title: 'Address (3)', name: 'line3', required: false },
  { title: 'Address (4)', name: 'line4', required: true },
  { title: 'City', name: 'city', required: true },
  { title: 'Post Code', name: 'postCode', required: true },
  { title: 'Country', name: 'country', required: true },
  { title: 'Income Generated', name: 'incomeGenerated', required: true, numeric: true },
  { title: 'Airbnb Id', name: 'airbnbId', required: true },
  { title: 'Number of bedrooms', name: 'numberOfBedrooms', integer: true },
  { title: 'Number of bathrooms', name: 'numberOfBathrooms', integer: true },
];

const renderField = ({ title, required, name }, { values, errors, touched, handleBlur, handleChange }) => (
  <div key={name}>
    <label htmlFor={name}>
      {title} {required && <span styleName="required">*</span>}
    </label>
    <input id={name} name={name} placeholder={title} onChange={handleChange} onBlur={handleBlur} value={values[name]} />
    <Error field={name} touched={touched} errors={errors} />
  </div>
);

type PropertyItemEditableProps = PropertyItemProps & PropertiesContextProps;
type PropertyItemEditableState = {
  property: Property,
};

class PropertyItemEditable extends React.Component<PropertyItemEditableProps, PropertyItemEditableState> {
  state = {
    property: this.props.property,
  };

  componentDidMount() {
    this.fetchFullProperty();
  }

  fetchFullProperty = async () => {
    const { _id } = this.state.property;
    const fullProperty = await this.props.api.fetchById(_id);
    this.setState(() => ({ property: fullProperty }));
  };

  render() {
    const { property } = this.state;
    // eslint-disable-next-line no-prototype-builtins
    const isFullProperty = property.hasOwnProperty('airbnbId');
    const initialValues = { ...property, ...property.address, address: undefined };

    return (
      <div styleName="box">
        {/*<h3>Edit #{property._id}</h3>*/}
        {isFullProperty && (
          <Formik
            initialValues={initialValues}
            validate={values => {
              const errors = {};
              //TODO refactor validators check
              inputs.forEach(({ name, required, numeric, integer }) => {
                if (required && !errors[name]) errors[name] = Validators.required(values[name]);
                if (numeric && !errors[name]) errors[name] = Validators.number(values[name]);
                if (integer && !errors[name]) errors[name] = Validators.integer(values[name]);
              });
              //removing empty key values from errors object (without it there was a weird problem)
              return _omitBy(errors, _isUndefined);
            }}
            onSubmit={(rawValues, { setSubmitting }) => {
              const onSuccess = extraCallback => {
                setSubmitting(false);
                if (extraCallback) extraCallback();
              };
              const onError = () => {
                setSubmitting(false);
              };
              setSubmitting(true);
              //prepare acceptable object format , to reformat!
              const { line1, line2, line3, line4, city, country, postCode } = rawValues;
              const values = { ...rawValues, address: { line1, line2, line3, line4, city, country, postCode } };
              this.props.onUpdate({ property, values, onSuccess, onError });
            }}
            render={formProps => {
              const { handleSubmit } = formProps;
              const { onCancel } = this.props;
              return (
                <form onSubmit={handleSubmit}>
                  {inputs.map(input => renderField(input, formProps))}
                  <div styleName="field">
                    <FormButtons {...formProps} onCancel={onCancel} />
                  </div>
                  {/*DEV ONLY - Change debug to true to display additional info*/}
                  <DisplayFormikState {...formProps} debug={false} />
                </form>
              );
            }}
          />
        )}
      </div>
    );
  }
}

export default PropertyItemEditable;
