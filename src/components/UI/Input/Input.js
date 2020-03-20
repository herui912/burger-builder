import React from 'react'
import classes from './Input.module.css'

const input = (props) => {
	let inputElement = null
	let validationError = null;
	const inputClasses = [classes.InputElement]
	if (props.invalid && props.shouldValidate && props.touched) {
		inputClasses.push(classes.Invalid)
		validationError = <p className={classes.ValidationError}>Please enter a valid {props.valueType}</p>;
	}
	switch (props.elementType) {
		case ('input'): 
			inputElement = <input
				className={inputClasses.join(' ')}
				value={props.value}
				{...props.elementConfig} 
				onChange={props.changed}/>
			break
		case ('textarea'): 
			inputElement = <textarea
				className={inputClasses.join(' ')}
				value={props.value}
				{...props.elementConfig} 
				onChange={props.changed}/>
			break
		case ('select'): 
			inputElement = (
				<select
					className={inputClasses.join(' ')}
					value={props.value}
					{...props.elementConfig}					
					onChange={props.changed}>
						{props.elementConfig.options.map(option => (
							<option value={option.value} key={option.value}>
								{option.displayValue}
							</option>
						))}
				</select>
			)
			break
		default: 
			inputElement = <input
				className={inputClasses.join(' ')}
				value={props.value}
				{...props.elementConfig} 
				onChange={props.changed}/>
	}

	return (
		<div className={classes.Input}>
			<label className={classes.Label}>{props.label}</label>
			{inputElement}
			{validationError}
		</div>
	)
}
export default input