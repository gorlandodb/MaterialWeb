const writePkg = require('write-pkg');
const path = require('path');
const fetch = require('node-fetch');
const {writeFileSync} = require('fs');
const mkdirp = require('mkdirp-promise');

const writeFile = async (filePath, contents) => {
  await mkdirp(path.dirname(filePath));
  writeFileSync(filePath, contents);
};

const getLatestMWCVersion = async() => {
  const unpkgUrl = 'https://unpkg.com/@material/mwc-textfield/README.md';
  const mwcFetch = await fetch(unpkgUrl);
  const url = mwcFetch.url;
  
  if (!url) {
    console.error(`Fetch to ${unpkgUrl} failed to find redirect url.`);
    process.exit(1);
  }

  const latest = url.split('/').filter(e => e.includes('mwc-textfield@'))[0].split('@')[1];
  
  if (!latest) {
    console.error(`No version found in: ${url}`);
    process.exit(1);
  }
  
  return latest;
}

const updatePackageJson = (version) => {
  const caretedVersion = `^${version}`;
  const packageJsonPath = path.join(__dirname, '..', 'package.json');
  const packageJson = require(packageJsonPath);

  if (!packageJson.dependencies) {
    console.error(`error fetching package.json at ${packageJsonPath}`);
    process.exit(1);
  }
  
  const depNames = Object.keys(packageJson.dependencies);
  const mwcDeps = depNames.filter(dep => dep.startsWith('@material/mwc-'));
  const firstDepVersion = packageJson.dependencies[mwcDeps[0]];

  if (firstDepVersion && firstDepVersion !== caretedVersion) {
    for (const mwcDep of mwcDeps) {
      packageJson.dependencies[mwcDep] = caretedVersion;
    }
  } else {
    console.log(`Nothing to update: latest is ${caretedVersion} and deps are already at ${firstDepVersion}`);
    process.exit(0);
  }
  
  return packageJson;
}

const writeAll = async (pkgJson) => {
  console.log('writing package json to disk...')
  await writePkg(path.join(__dirname, '..', 'package.json'), pkgJson);
};

(async () => {
  console.log('getting latest mwc version...');
  const latest = await getLatestMWCVersion();
  console.log(`latest version is: ${latest}.`);

  console.log(`Updating package.json model to ^${latest}...`);
  const pkgJson = updatePackageJson(latest);
  console.log(`package.json model updated (not written to disk)`);

  console.log(`writing demo files and package json...`)
  await writeAll(pkgJson);
  console.log(`all files updated!`)
})()