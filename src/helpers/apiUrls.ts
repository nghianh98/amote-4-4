const apiUrls = {
	baseUrl: process.env.API_HOST,
	quotes: {
		get: '/quotes'
	},
	reward: {
		get: '/rewards'
	},
	product: {
		get: '/variants',
		getRecommend: '/recommend_products',
		getInfoVariant: '/variants/'
	},
	cart: {
		get: '/cart.js',
		postAdd: '/cart/add.js',
		postUpdate: '/cart/update.js',
		postChange: '/cart/change.js',
		addCodeFreeShipping: '/discount/'
	},
	blocks: {
		get: '/product_blocks'
	},
	linkAff: {
		get: 'aHR0cHM6Ly9zdG9yZWZyb250LmFtb3RlLmFwcC9ZWFJsY3c/cT1ZVzF2ZEdVPQ=='
	}
};

export default apiUrls;
