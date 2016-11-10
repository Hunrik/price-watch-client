import React from 'react'
import { connect } from 'react-redux'
import { Button, Segment, Form, Message } from 'semantic-ui-react'
import { Field, reduxForm } from 'redux-form'
import { saveAndCloseNewSite } from '../reducers/home'
const validate = values => {
  const errors = {}
  if (!values.domain) {
    errors.domain = 'Required'
  } else if (!/^((https?):\/\/)?([w|W]{3}\.)+[a-zA-Z0-9\-\.]{3,}\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/.test(values.domain)) {
    errors.domain = 'Invalid domain'
  }
  return errors
}

const renderField = ({ input, label, type, meta: { touched, error, warning } }) => {
  return (
    <Form.Field>
      <label>{label}</label>
      <input {...input} placeholder={label} type={type} />
      {touched && (error && <Message error>{error}</Message>)}
    </Form.Field>
) }

let AddNewSite = (props) => {
  const { handleSubmit, pristine, submitting } = props

  return (
    <Segment>
      <h1>Add a new site</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group widths='equal'>
          <Field name='domain' type='text' component={renderField} label='Domain' />
          <Field name='sitemap' type='text' component={renderField} label='Sitemap URL' />
        </Form.Group>
        <Form.Group widths='equal'>
          <Field name='productIdSelector' type='text' component={renderField} label='Product ID selector' />
          <Field name='productNameSelector' type='text' component={renderField} label='Product name selector' />
        </Form.Group>
        <Form.Group widths='equal'>
          <Field name='priceSelector' type='text' component={renderField} label='Price selector' />
          <Field name='productPageSelector' type='text' component={renderField} label='Product page selector' />
        </Form.Group>
        <Button type='submit' disabled={pristine || submitting}>Save</Button>
      </Form>
    </Segment>
  )
}

AddNewSite = reduxForm({
  form: 'newsite',  // a unique identifier for this form
  //validate           // <--- validation function given to redux-form
})(AddNewSite)

const mapDispatchToProps = {
  onSubmit: saveAndCloseNewSite
}

export default connect(null, mapDispatchToProps)(AddNewSite)
