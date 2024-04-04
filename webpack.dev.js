const webpack = require('webpack');
const { merge } = require('webpack-merge');
const common = require('./webpack.common');
const dotenv = require('dotenv');

// // Load env
// dotenv.config();

// dotenv.config();
dotenv.config({
	path: './.env.local'
});

// Webpack configs
module.exports = merge(common, {
	mode: 'development',
	plugins: [
		new webpack.DefinePlugin({
			'process.env': JSON.stringify(process.env)
		})
	]
});
