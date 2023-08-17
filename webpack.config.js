const path = require('path');

module.exports = {
    mode: 'development',
    devtool: 'source-map', // should be only in dev config

    // defined in shadow-cljs.edn, in :js-options :external-index
    entry: './.shadow-cljs/index.js',

    // js/libs.js needs to be loaded in index.html before shadows target
    output: {path: path.resolve('resources/public/js'), filename: 'libs.js'},

    resolve: {
        // uncommenting it causes issue
        // modules: [
        //     path.resolve(__dirname, 'node_modules'),
        //     'src/gen',
        //     'node_modules'
        // ],
        alias: {
            // Demo: path.resolve(__dirname, 'src/gen/'),
        },
    }
}