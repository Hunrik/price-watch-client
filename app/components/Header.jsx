import React from 'react'
import { IndexLink, Link } from 'react-router'
import { Menu } from 'semantic-ui-react'

export const Header = () => (
  <Menu pointing secondary>
    <Menu.Item as={IndexLink} to='/' name='home' />
    <Menu.Item as={Link} to='/Dashboard' name='Dashboard' />
    <Menu.Item as={Link} to='/new' name='Add new' />
    <Menu.Item as={Link} to='/pricelist' name='Price list' />
    <Menu.Menu position='right'>
      <Menu.Item as={Link} to='/logout' name='logout' />
    </Menu.Menu>
  </Menu>
)

export default Header
