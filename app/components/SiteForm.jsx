import React, { PropTypes, Component } from 'react'
import { Button, Form } from 'semantic-ui-react'
import { Field, reduxForm } from 'redux-form'
import Checkbox from './Checkbox'
const renderRadio = ({ input, label, type, onChange, meta: { touched, error, warning } }) => {
  return (
    <Form.Field>
      <label>{label}</label>
      <Checkbox {...input} name={input.name} checked={input.checked} onChange={input.onChange} toggle />
      {touched && (error && <Message error>{error}</Message>)}
    </Form.Field>
) }

export class SiteForm extends Component {

  render () {
    const {handleSubmit} = this.props

    return (
      <Form onSubmit={handleSubmit}>
        <Form.Group widths='equal'>
          <Form.Field>
            <label>Domain</label>
            <Field placeholder='Domain' name='domainName' component='input' disabled />
          </Form.Field>
          <Form.Field>
            <label>Sitemap URL</label>
            <Field placeholder='sitemap' name='sitemap' component='input' />
          </Form.Field>
        </Form.Group>
        <Form.Group widths='equal'>
          <Form.Field>
            <label>Product ID selector</label>
            <Field placeholder='Product ID selector' name='productIdSelector' component='input' />
          </Form.Field>
          <Form.Field>
            <label>Product name selector</label>
            <Field placeholder='Product name selector' name='productNameSelector' component='input' />
          </Form.Field>
        </Form.Group>
        <Form.Group widths='equal'>
          <Form.Field>
            <label>Price selector</label>
            <Field placeholder='Price selector' name='priceSelector' component='input' />
          </Form.Field>
          <Form.Field>
            <label>Product page selector</label>
            <Field placeholder='Product page selector' name='productPageSelector' component='input' />
          </Form.Field>
        </Form.Group>
        <div className='ui toggle checkbox'>
          <Field name='enabled' component='input' type='checkbox' />
          <label>Enable</label>
        </div>
        <Button type='submit'>Save</Button>
      </Form>
    )
  }
}

export default reduxForm({
  form: 'editSite',  // a unique identifier for this form
  //validate           // <--- validation function given to redux-form
})(SiteForm)
