import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Loader, Segment, Table } from 'semantic-ui-react'
import { getProducts } from '../reducers/products'
class PriceList extends Component {
  render () {
    const { products, isLoading } = this.props
    const rows = products.map((product, id) => {
      const newPrice = product.price ? product.price[product.price.length - 1] : 'N/A'
      const oldPrice = product.price ? product.price[product.price.length - 2] : 'N/A'
      const percentage = typeof oldPrice === 'number' ? 100 - (newPrice / oldPrice * 100) : '0'
      return (
        <Table.Row key={id} >
          <Table.Cell>{product.domainName}</Table.Cell>
          <Table.Cell singleLine>{product.productName}</Table.Cell>
          <Table.Cell>{newPrice}</Table.Cell>
          <Table.Cell>{oldPrice}</Table.Cell>
          <Table.Cell>{percentage}%</Table.Cell>
          <Table.Cell><a href={product.url}>Link</a></Table.Cell>
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
              <Table.HeaderCell>New Price</Table.HeaderCell>
              <Table.HeaderCell>Old Price</Table.HeaderCell>
              <Table.HeaderCell>Difference</Table.HeaderCell>
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
