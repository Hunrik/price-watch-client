import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

class Home extends Component {

  render () {
    return (
      <div>
        <h1>Home</h1>
        <p>Hashcheck {Math.random()}</p>
      </div>
    )
  }
}

Home.propTypes = {
}

function mapStateToProps (state) {
  return {
  }
}

// Read more about where to place `connect` here:
// https://github.com/rackt/react-redux/issues/75#issuecomment-135436563
export default connect(mapStateToProps)(Home)
