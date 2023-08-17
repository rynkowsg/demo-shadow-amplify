const { existsSync, lstatSync } = require("fs");
const { resolve, dirname, relative } = require("path");

const isRelativeImport = (path) => path.startsWith(".")
const isDirectory = (path) => existsSync(path) && lstatSync(path).isDirectory()

const absolutePathForImport = (sourcePath, relativeImportPath) => resolve(dirname(sourcePath), relativeImportPath);

const relativeToJsMain = (projectRoot, filepath, absolutePath) => {
    const filepathRelativeToRoot = relative(projectRoot, absolutePath)
    const match = filepathRelativeToRoot.match(/(?:[^/]+\/){2}(.*)/)
    // all files are stored in either src/ts, src/graphql, src/js, etc. Extract file path within such a directory.
    const pathWithinSources= match ? match[1] : null;
    return pathWithinSources
}

function addIndexSuffixForRelativeImportDirs() {
    return {
        visitor: {
            ImportDeclaration: (path, state) => {
                const importPath = path.node.source.value;
                const fileName = state.file.opts.filename;
                if (isRelativeImport(importPath) && isDirectory(absolutePathForImport(fileName, importPath))) {
                    const updatedImport = `${importPath}/index`
                    path.node.source.value = updatedImport;
                    console.log(`Updated import: ${importPath} => ${updatedImport}`)
                }
            },
        },
    };
}

function addCustomPrefixToRelativeImports() {
    const prefix = "Demo"
    return {
        visitor: {
            ImportDeclaration: (path, state) => {
                const importPath = path.node.source.value;
                const fileName = state.file.opts.filename;
                const absoluteImportPath = absolutePathForImport(fileName, importPath);
                const projectRoot = state.file.opts.root;
                // every relative import with prefix
                if (isRelativeImport(importPath)) {
                    const updatedImport = `${prefix}/${relativeToJsMain(projectRoot, fileName, absoluteImportPath)}`
                    path.node.source.value = updatedImport
                    console.log(`Updated import: ${importPath} => ${updatedImport}`)
                }
            },
        },
    };
}

module.exports =     {
    presets: [
        "@babel/env",
        // Compile tsx files.
        "@babel/preset-typescript",
        // Use the react runtime import if available.
        ["@babel/preset-react", { runtime: "automatic" }],
    ],
    plugins: [
        addIndexSuffixForRelativeImportDirs,
        // addCustomPrefixToRelativeImports,
    ],
    // Do not apply this babel config to node_modules.
    // Shadow-CLJS also runs babel over node_modules and we don't want this
    // configuration to apply to it.
    // We still want it to be picked up by storybook though.
    exclude: ["node_modules"],
};
