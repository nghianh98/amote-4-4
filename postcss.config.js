module.exports = {
	plugins: [
		require('autoprefixer')({
			grid: 'autoplace',
			flexbox: true,
			supports: true,
			remove: true
		})
	]
};
