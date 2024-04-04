module.exports = (args) => {
	const mode = args.dev ? 'dev' : args.prod ? 'prod' : '';
	return require(`./webpack.${mode}.js`);
};
