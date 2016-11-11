import React, { Component, PropTypes } from 'react'
import { Checkbox } from 'semantic-ui-react'

class CheckboxInput extends Component {

  onCheck (e, checked) {
    this.props.input.onChange(checked)
  }
  render () {
    this.props.input.value = this.props.input.checked.toString()
    return <Checkbox {...this.props.input} label={this.props.label} checked={this.props.input.checked} onChange={this.onCheck.bind(this)} />
  }
}

export default CheckboxInput
