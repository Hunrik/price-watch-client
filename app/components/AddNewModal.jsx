import React from 'react'
import { connect } from 'react-redux'
import { Button, Modal, Form, Message } from 'semantic-ui-react'
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
  console.log(input)
  return (
    <Form.Field>
      <label>{label}</label>
      <input {...input} placeholder={label} type={type} />
      {touched && (error && <Message error>{error}</Message>)}
    </Form.Field>
) }

let AddNewModal = (props) => {
  const { handleSubmit, pristine, submitting, closeNewSite, isAddNewOpen, submit } = props

  return (
    <Modal dimmer='blurring' open={isAddNewOpen} onClose={closeNewSite}>
      <Modal.Header>Add a new site</Modal.Header>
      <Modal.Content>
        <Form onSubmit={handleSubmit}>
          <Form.Group widths='equal'>
            <Field name='domainName' type='text' component={renderField} label='Domain' />
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
      </Modal.Content>
      <Modal.Actions>
        <Button color='black' onClick={closeNewSite} content='Close' />
        <Button positive icon='save' labelPosition='right' onClick={submit} content='Save' disabled={pristine || submitting} />
      </Modal.Actions>
    </Modal>
  )
}

AddNewModal = reduxForm({
  form: 'newsite',  // a unique identifier for this form
  //validate           // <--- validation function given to redux-form
})(AddNewModal)

const mapDispatchToProps = {
  onSubmit: saveAndCloseNewSite
}

export default connect(null, mapDispatchToProps)(AddNewModal)
