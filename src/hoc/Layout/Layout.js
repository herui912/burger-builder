import React, {Component} from 'react'
import { connect } from 'react-redux'
import Aux from '../Aux/Aux'
import classes from './Layout.module.css'
import Toolbar from '../../components/Navigation/Toolbar/Toolbar'
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer'

class Layout extends Component {
	state = {
		showSideDrawer: false
	}
	sideDrawerCloseHandler = () => {
		this.setState({showSideDrawer: false})
	}
	sideDrawerToggleHandler= () => {
		this.setState((prevState) => {
			return {showSideDrawer: !prevState.showSideDrawer}
		})
	}
	
	render () {
		return (
			<Aux>
				<Toolbar
					isAuth={this.props.token != null}
					drawToggleClicked={this.sideDrawerToggleHandler} />
				<SideDrawer
					isAuth={this.props.token != null}
					open={this.state.showSideDrawer}
					closed={this.sideDrawerCloseHandler} />
				<main className={classes.Content}>
					{this.props.children}
				</main>
			</Aux>
		)
	}
}
const mapStateToProps = state => {
	return {
		token: state.auth.token
	}
}
export default connect(mapStateToProps)(Layout)