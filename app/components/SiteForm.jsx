import React, { PropTypes, Component } from 'react'
import { Button, Checkbox, Form } from 'semantic-ui-react'
import { Field, reduxForm } from 'redux-form'
type Props = {
}

export class SiteForm extends Component {
  props: Props

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
        <Button type='submit'>Save</Button>
      </Form>
    )
  }
}

export default reduxForm({
  form: 'editSite',  // a unique identifier for this form
  //validate           // <--- validation function given to redux-form
})(SiteForm)
