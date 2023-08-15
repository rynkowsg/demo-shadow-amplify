const path = require('path');

module.exports = [
    // Pack npm packages needed by shadow.
    {
        mode: 'development',
        devtool: 'source-map', // should be only in dev config

        // defined in shadow-cljs.edn, in :js-options :external-index
        entry: './.shadow-cljs/index.js',

        // js/libs.js needs to be loaded in index.html before shadows target
        output: { path: path.resolve('resources/public/js'), filename: 'libs.js' },

        // uncommenting it casues issue
        // resolve: {
        //     modules: [
        //         path.resolve(__dirname, 'node_modules'),
        //     ],
        // }
    },
]
