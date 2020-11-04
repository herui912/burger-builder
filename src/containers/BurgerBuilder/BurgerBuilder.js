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
import * as actionTypes from '../../store/actions'

class BurgerBuilder extends Component {
	state = {
		purchasing: false,
		loading: false,
		error: false,
	}
	componentWillMount () {
		// axios.get('https://react-burger-c93eb.firebaseio.com/ingredients.json')
		// .then(res => {
		// 	this.setState({ingredients: res.data})
		// })
		// .catch(err => {
		// 	this.setState({ error: true })
		// })
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
		this.setState({purchasing: true})
	}
	purchaseCancelHandler = () => {
		this.setState({purchasing: false})
	}
	purchaseContinueHandler = () => {
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
		let burger = this.state.error ? <p>Ingredients can't be loaded.</p> : <Spinner />
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
						/>
					</React.Fragment>
			)
			orderSummary = <OrderSummary
				ingredients={this.props.ings}
				price={this.props.price}
				purchaseCanceled={this.purchaseCancelHandler}
				purchaseContinued={this.purchaseContinueHandler}
			/>
			if (this.state.loading) {
				orderSummary = <Spinner />
			}
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
		ings: state.ingredients,
		price: state.totalPrice
	}
}

const mapDispatchToProps = dispatch => {
	return {
		onIngredientAdded: (ingName) => dispatch({type: actionTypes.ADD_INGREDIENT, ingredientName: ingName}),
		onIngredientRemoved: (ingName) => dispatch({type: actionTypes.REMOVE_INGREDIENT, ingredientName: ingName})
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios))