const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
	entry: './src/index.ts',
	output: {
		filename: './sdk.js',
		publicPath: 'auto',
		path: path.resolve(__dirname, '../theme-app-extensions/extensions/amote/assets')
	},
	plugins: [
		new CopyWebpackPlugin({
			patterns: [{ from: 'src/assets/images', to: 'images' }]
		})
	],
	module: {
		rules: [
			{
				test: /\.s?css$/,
				use: [
					{
						loader: 'style-loader',
						options: {
							injectType: 'lazySingletonStyleTag',
							insert: function insertIntoTarget(element, options) {
								let parent = !options?.target ? document.head : options.target;
								parent.append(element);
							}
						}
					},
					'css-loader',
					'postcss-loader',
					'sass-loader'
				]
			},
			{
				test: /\.js$/,
				use: ['babel-loader']
			},
			{
				test: /\.ts?$/,
				use: 'ts-loader',
				exclude: ['/node_modules/']
			}
		]
	},
	resolve: {
		extensions: ['.ts', '.js'],
		alias: {
			_: path.resolve(__dirname, './src')
		}
	}
};
