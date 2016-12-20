var webpack = require('webpack'),
    path = require('path'),
    yargs = require('yargs');

var TransferWebpackPlugin = require('transfer-webpack-plugin');
 

var libraryName = 'WsJmsLib',
    plugins = [ 
      new TransferWebpackPlugin([
            { from: 'kaazing-enterprise-client', to: '/kaazing-enterprise-client' }
        ], path.join(__dirname, '/node_modules/'))
    ],
    outputFile;

if (yargs.argv.p) {
  plugins.push(new webpack.optimize.UglifyJsPlugin({ minimize: true }));
  outputFile = libraryName + '.min.js';
} else {
  outputFile = libraryName + '.js';
}

var config = {
  entry: [
    __dirname + '/src/index.ts',
   
    //glob_entries(__dirname + '/node_modules/kaazing-enterprise-client/**/*.js'),
   
  //  __dirname + '/node_modules/kaazing-enterprise-client/WebSocket.js',
  //  __dirname + '/node_modules/kaazing-enterprise-client/JmsClient.js',

  //  __dirname + '/node_modules/kaazing-enterprise-client/JmsClient.nocache.js'
  //  __dirname + '/node_modules/kaazing-enterprise-client/044B299E3B837324A1C39174F5BCE8A0.cache.js',
  //  0D1754AC47916821D0CBE69DED4DB484.cache.js
  //  52D96B4F8585F9A9117EC18B3C071EEE.cache.js
  //  761092AC7AB921CC729D4A9A662951D2.cache.js
  //  9E7EF02171DCD8CC27F2FAB0AF52DBAD.cache.js
  //  AmqpClient.js

   // glob.sync(__dirname + '/node_modules/kaazing-enterprise-client/*.js')

  ],
  devtool: 'source-map',
  output: {
    path: path.join(__dirname, '/dist'),
    filename: outputFile,
    library: libraryName
  },
  module: {
    preLoaders: [
      { test: /\.tsx?$/, loader: 'tslint', exclude: /node_modules/ }
    ],
    loaders: [
      { test: /\.tsx?$/, loader: 'ts', exclude: /node_modules/ }
    ]
  },
  resolve: {
    root: path.resolve('./src'),
    extensions: [ '', '.js', '.ts', '.jsx', '.tsx' ]
  },
  plugins: plugins,

  // Individual Plugin Options
  tslint: {
    emitErrors: true,
    failOnHint: true
  }
};

module.exports = config;
