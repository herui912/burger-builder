
import axios from 'axios'

const instance = axios.create({
	baseURL: 'https://react-burger-c93eb.firebaseio.com/'
})

export default instance