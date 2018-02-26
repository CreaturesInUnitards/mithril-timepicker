var path = require('path')

module.exports = {
	entry: path.resolve(__dirname, './src/mithril-timepicker.js'),
	module: {
		rules: [
			{
				test: /\.sass$/,
				use: [
					{
						loader: 'style-loader' 
					},
					{
						loader: 'css-loader',
						options: { sourceMap: true }
					},
					{
						loader: 'postcss-loader'
					},
					{
						loader: 'sass-loader',
						options: { sourceMap: true }
					}
				]
			},
		]
	},
	output: {
		filename: 'mithril-timepicker.js',
		path: path.resolve(__dirname, './build')
	},
	devtool: 'source-map',
	watch: true
}
