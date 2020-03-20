import React, {Component} from 'react'
import Aux from '../../hoc/Aux/Aux'
import Burger from '../../components/Burger/Burger'
import BurgerControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from '../../components/UI/Modal/Modal'
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'
import Spinner from '../../components/UI/Spinner/Spinner'
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'
import axios from '../../axios-orders'

const INGREDIENT_PRICES = {
	salad: 0.5,
	bacon: 0.4,
	cheese: 1.3,
	meat: 0.7
}
class BurgerBuilder extends Component {
	state = {
		ingredients: null,
		totalPrice: 4,
		purchaseable: false,
		purchasing: false,
		loading: false,
		error: false,
	}
	componentWillMount () {
		axios.get('https://react-burger-c93eb.firebaseio.com/ingredients.json')
		.then(res => {
			this.setState({ingredients: res.data})
		})
		.catch(err => {
			this.setState({ error: true })
		})
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
		this.setState({purchaseable: sum > 0})
	}
	purchaseHandler = () => {
		this.setState({purchasing: true})
	}
	purchaseCancelHandler = () => {
		this.setState({purchasing: false})
	}
	purchaseContinueHandler = () => {
		const queryParams = []
		for (let i in this.state.ingredients) {
			queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]))
		}
		queryParams.push('price=' + this.state.totalPrice)
		const queryString = queryParams.join('&')
		this.props.history.push({
			pathname: '/checkout',
			search: `?${queryString}`
		})
	}
	render () {
		const disabledInfo = {
			...this.state.ingredients
		}
		for (let key in disabledInfo) {
			disabledInfo[key] = disabledInfo[key] <= 0
		}
		let orderSummary = null
		let burger = this.state.error ? <p>Ingredients can't be loaded.</p> : <Spinner />
		if (this.state.ingredients){
			burger = (
				<React.Fragment>
					<Burger ingredients={this.state.ingredients}/>
					<BurgerControls
						ingredientAdded={this.addIngredientHandler}
						ingredientRemoved={this.removeIngredientHandler}
						disabled={disabledInfo}
						price={this.state.totalPrice}
						purchaseable={this.state.purchaseable}
						ordered={this.purchaseHandler}
						/>
					</React.Fragment>
			)
			orderSummary = <OrderSummary
				ingredients={this.state.ingredients}
				price={this.state.totalPrice}
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
	addIngredientHandler = (type) => {
		const oldCount = this.state.ingredients[type]
		const updatedCount = oldCount + 1
		const updatedIngredients = {
			...this.state.ingredients
		}
		updatedIngredients[type] = updatedCount
		const priceAddition = INGREDIENT_PRICES[type]
		const newPrice = this.state.totalPrice + priceAddition
		this.setState({ingredients: updatedIngredients, totalPrice: newPrice})
		this.updatePurchaseState(updatedIngredients)
	}
	removeIngredientHandler = (type) => {
		const oldCount = this.state.ingredients[type]
		if (oldCount <= 0) return
		const updatedCount = oldCount - 1
		const updatedIngredients = {
			...this.state.ingredients
		}
		updatedIngredients[type] = updatedCount
		const priceDeduction = INGREDIENT_PRICES[type]
		const newPrice = this.state.totalPrice - priceDeduction
		this.setState({ingredients: updatedIngredients, totalPrice: newPrice})
		this.updatePurchaseState(updatedIngredients)
	}
}
export default withErrorHandler(BurgerBuilder, axios)