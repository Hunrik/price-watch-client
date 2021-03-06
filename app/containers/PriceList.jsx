import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Loader, Segment, Table } from 'semantic-ui-react'
import { getProducts } from '../reducers/products'
class PriceList extends Component {
  render () {
    const { products, isLoading } = this.props
    const rows = products.map((product, id) => {
      return (
        <Table.Row key={id} >
          <Table.Cell>{product.domainName}</Table.Cell>
          <Table.Cell singleLine>{product.productName}</Table.Cell>
          <Table.Cell>{product.oldPrice}</Table.Cell>
          <Table.Cell>{product.newPrice}</Table.Cell>
          <Table.Cell>{product.difference.toFixed(1)}%</Table.Cell>
          <Table.Cell>{product.updatedAt}</Table.Cell>
          <Table.Cell><a href={product.url} target='_blank'>Link</a></Table.Cell>
        </Table.Row>)
    })
    return (
      <Segment>
        <Loader active={products.length === 0 && isLoading} inline='centered' >Loading...</Loader>
        <Table celled padded>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell singleLine>Domain</Table.HeaderCell>
              <Table.HeaderCell>Product Name</Table.HeaderCell>
              <Table.HeaderCell>Old Price</Table.HeaderCell>
              <Table.HeaderCell>New Price</Table.HeaderCell>
              <Table.HeaderCell>Difference</Table.HeaderCell>
              <Table.HeaderCell>Updated at</Table.HeaderCell>
              <Table.HeaderCell>Link</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {rows}
          </Table.Body>
        </Table>
      </Segment>
    )
  }
  componentDidMount () {
    const { getProducts } = this.props
    getProducts()
  }
}

PriceList.propTypes = {
}

function mapStateToProps (state) {
  return {
    products: state.products.products
  }
}
const mapDispatchToProps = {
  getProducts,
}
// Read more about where to place `connect` here:
// https://github.com/rackt/react-redux/issues/75#issuecomment-135436563
export default connect(mapStateToProps, mapDispatchToProps)(PriceList)
