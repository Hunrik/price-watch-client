import _ from 'lodash'
import { connect } from 'react-redux'
import { getSites, toggleRow, addNewSite, closeNewSite, reParse,
  emptyProductsQueue, emptySitesQueue, editSite } from '../reducers/home'
import { getStatus } from '../reducers/statistics'
import { Loader, Segment, Button, Image, Icon, Grid, Header, Statistic } from 'semantic-ui-react'
import Collapse from 'react-collapse'
import React, { PropTypes, Component } from 'react'
import SiteForm from 'components/SiteForm'

type Props = {
  isAddNewOpen: PropTypes.Function.isRequired,
  closeNewSite: PropTypes.Function.isRequired,
  addNewSite: PropTypes.Function.isRequired,
  toggleRow: PropTypes.Function.isRequired,
  reParse: PropTypes.Function.isRequired,
  isAddNewOpen: PropTypes.boolean,
  rowsOpen: PropTypes.Array,
  sites: PropTypes.Object
}

export class Home extends Component {
  props: Props

  render () {
    const { toggleRow, reParse, sites, rowsOpen, addNewSite, isAddNewOpen, closeNewSite, status, emptySitesQueue,
      emptyProductsQueue, getStatus, isLoading, editSite } = this.props
    const sitesList = sites.map((site, index) => {
      const isOpen = rowsOpen.includes(index)
      return (
        <Segment key={index}>
          <Button floated='right' onClick={() => toggleRow(index)}>{ isOpen ? 'Close' : 'View' }</Button>
          <Button floated='right' onClick={() => reParse(site.domainName)} color='red'>Re-Parse</Button>
          <Image avatar src={'https://www.google.com/favicon.ico'} />
          {site.domainName}
          <Collapse isOpened={isOpen} className='siteRow'>
            <SiteForm 
            form={site.domainName}          // formKey should be a string
            initialValues={site}
            onSubmit={(arg) => editSite(arg)} />
          </Collapse>
        </Segment>
      )
    })
    return (
      <div>
        <Segment.Group>
          <Loader active={sitesList.length === 0 && isLoading} inline='centered' >Loading...</Loader>
          {sitesList.length === 0 && !isLoading ? <Segment><h3>Empty</h3></Segment> : ''}
          {sitesList}
          <Button basic color='green' attached='bottom' onClick={addNewSite}>
            <Icon name='add circle' />
            Add New
          </Button>
        </Segment.Group>
        <Segment color='green'>
          <Grid columns={2}>
            <Grid.Column>
              <Header
                as='h2'
                icon='heartbeat'
                content='Status'
              />
            </Grid.Column>
            <Grid.Column>
              <Button circular icon='refresh' basic color='green' floated='right' onClick={getStatus} />
            </Grid.Column>
          </Grid>
          <Grid columns={3} divided textAlign='center'>
            <Grid.Row>
              <Grid.Column>
                <Statistic size='small'>
                  <Statistic.Value>{status.sitesInQueue ? status.sitesInQueue : '0'}</Statistic.Value>
                  <Statistic.Label>Pages to check</Statistic.Label>
                </Statistic>
                <br />
                <Button
                  color='red'
                  content='Empty'
                  onClick={emptySitesQueue} />
              </Grid.Column>
              <Grid.Column>
                <Statistic size='small'>
                  <Statistic.Value>{ status.productsInQueue ? status.productsInQueue : '0'}</Statistic.Value>
                  <Statistic.Label>Products to check</Statistic.Label>
                </Statistic>
                <br />
                <Button
                  color='red'
                  content='Empty'
                  onClick={emptyProductsQueue} />
              </Grid.Column>
              <Grid.Column />
            </Grid.Row>
          </Grid>
        </Segment>
      </div>
    )
  }
  componentDidMount () {
    const { getSites, getStatus } = this.props
    getSites()
    getStatus()
  }
}

const mapDispatchToProps = {
  getSites,
  toggleRow,
  addNewSite,
  closeNewSite,
  getStatus,
  reParse,
  emptyProductsQueue,
  emptySitesQueue,
  editSite
}
const mapStateToProps = (state) => ({
  sites: state.home.sites,
  rowsOpen: state.home.rowsOpen,
  isAddNewOpen: state.home.isAddNewOpen,
  isLoading: state.home.isLoading,
  status: state.statistics
})

export default connect(mapStateToProps, mapDispatchToProps)(Home)
