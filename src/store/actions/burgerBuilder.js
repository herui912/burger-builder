import * as actionTypes from './actionTypes';
import axios from '../../axios-orders'

export const addIngredient = (ingName) => {
  return {
    type: actionTypes.ADD_INGREDIENT,
    ingredientName: ingName
  }
}

export const removeIngredient = (ingName) => {
  return {
    type: actionTypes.REMOVE_INGREDIENT,
    ingredientName: ingName
  }
}

export const setIngredients = (ingredients) => {
  return {
    type: actionTypes.SET_INGREDIENTS,
    // to make sure the order of ingredients under control, can hard code it.
    ingredients: ingredients
  }
}

export const fetchIngredientsFailed = () => {
  return {
    type: actionTypes.FETCH_INGREDIENTS_FAILED
  }
}

export const initIngredients = () => {
  return dispatch => {
    axios.get('https://react-burger-c93eb.firebaseio.com/ingredients.json')
		.then(res => {
      dispatch(setIngredients(res.data));
		})
		.catch(err => {
      dispatch(fetchIngredientsFailed());
		})
  }
}