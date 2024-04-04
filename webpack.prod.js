const webpack = require('webpack');
const { merge } = require('webpack-merge');
const common = require('./webpack.common');
const dotenv = require('dotenv');

// Load env
dotenv.config();

// Webpack configs
module.exports = merge(common, {
	mode: 'production',
	plugins: [
		new webpack.DefinePlugin({
			'process.env': JSON.stringify(process.env)
		})
	]
});
