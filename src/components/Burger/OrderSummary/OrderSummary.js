import React from 'react'
import Aux from '../../../hoc/Aux'
import Button from '../../UI/Button/Button'

const orderSummary = (props) => {
	const ingredientSummary = Object.keys(props.ingredients)
	.map(igKey => {
	return <li key={igKey}>
		<span style={{textForm: 'captilize'}}>
			{igKey}: {props.ingredients[igKey]}
		</span>
	</li>
	})

	return (
		<Aux>
			<h3>Your Order</h3>
			<p>A delicious buger with following ingredience:</p>
			<ul>
				{ingredientSummary}
			</ul>
			<p><strong>Total Price: {props.price.toFixed(2)}</strong></p>
			<p>Continue to checkout</p>
			<Button btnType="Danger" clicked={props.purchaseCanceled}>Cancel</Button>
			<Button btnType="Success" clicked={props.purchaseContinued}>Continue</Button>
		</Aux>
	)
}
export default orderSummary
