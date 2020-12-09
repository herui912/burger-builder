import React, {Component} from 'react'
import {connect} from 'react-redux'
import Aux from '../../hoc/Aux/Aux'
import Burger from '../../components/Burger/Burger'
import BurgerControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from '../../components/UI/Modal/Modal'
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'
import Spinner from '../../components/UI/Spinner/Spinner'
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'
import axios from '../../axios-orders'
import * as burgerBuilderActions from '../../store/actions/index'

class BurgerBuilder extends Component {
	state = {
		purchasing: false
	}
	componentWillMount () {
		this.props.onInitIngredients()
	}
	updatePurchaseState (ingred) {
		const ingredients = {
			...ingred
		}
		const sum = Object.keys(ingredients)
		.map(igKey => {
			return ingredients[igKey]
		}).reduce((sum, el) => {
			return sum + el
		}, 0)

		return sum > 0
	}
	purchaseHandler = () => {
		if (this.props.isAuthenticated) {
			this.setState({purchasing: true})
		} else {
			this.props.history.push('/auth')
			this.props.onSetAuthRedirectPath('/checkout')
		}
		
	}
	purchaseCancelHandler = () => {
		this.setState({purchasing: false})
	}
	purchaseContinueHandler = () => {
		this.props.onInitPurchase()
		this.props.history.push('/checkout')
	}
	render () {
		const disabledInfo = {
			...this.props.ings
		}
		for (let key in disabledInfo) {
			disabledInfo[key] = disabledInfo[key] <= 0
		}
		let orderSummary = null
		let burger = this.props.error ? <p>Ingredients can't be loaded.</p> : <Spinner />
		if (this.props.ings){
			burger = (
				<React.Fragment>
					<Burger ingredients={this.props.ings}/>
					<BurgerControls
						ingredientAdded={this.props.onIngredientAdded}
						ingredientRemoved={this.props.onIngredientRemoved}
						disabled={disabledInfo}
						price={this.props.price}
						purchaseable={this.updatePurchaseState(this.props.ings)}
						ordered={this.purchaseHandler}
						isAuth={this.props.isAuthenticated}
						/>
					</React.Fragment>
			)
			orderSummary = <OrderSummary
				ingredients={this.props.ings}
				price={this.props.price}
				purchaseCanceled={this.purchaseCancelHandler}
				purchaseContinued={this.purchaseContinueHandler}
			/>
		}

		return (
			<Aux>
				<Modal
					show={this.state.purchasing}
					modalClosed={this.purchaseCancelHandler}>
					{orderSummary}
				</Modal>
				{burger}
			</Aux>
		)
	}
}

const mapStateToProps = state => {
	return {
		ings: state.burgerBuilder.ingredients,
		price: state.burgerBuilder.totalPrice,
		error: state.burgerBuilder.error,
		isAuthenticated: state.auth.token !== null
	}
}

const mapDispatchToProps = dispatch => {
	return {
		onIngredientAdded: (ingName) => dispatch(burgerBuilderActions.addIngredient(ingName)),
		onIngredientRemoved: (ingName) => dispatch(burgerBuilderActions.removeIngredient(ingName)),
		onInitIngredients: () => dispatch(burgerBuilderActions.initIngredients()),
		onInitPurchase: () => dispatch(burgerBuilderActions.purchaseInit()),
		onSetAuthRedirectPath: (path) => dispatch(burgerBuilderActions.setAuthRedirectPath(path))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios))