const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

// Get the project root (this app folder)
const projectRoot = __dirname;

// Get the monorepo root
const monorepoRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// 1. Watch all files in the monorepo
config.watchFolders = [monorepoRoot];

// 2. Let Metro know where to resolve packages
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];

// 3. Force resolving from projectRoot for the app entry
config.resolver.disableHierarchicalLookup = true;

module.exports = config;
