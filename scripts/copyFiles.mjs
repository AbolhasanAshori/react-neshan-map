/*
 * Copyright (c) 2024 Abolhasan Ashori
 *
 * This file includes code from @mui/material
 * Source: https://github.com/mui/material-ui
 * License: MIT License
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs/promises';
import path from 'path';

const packagePath = process.cwd();
const buildPath = path.join(packagePath, './build');

async function prepend(file, string) {
  const data = await fs.readFile(file, 'utf8');
  await fs.writeFile(file, string + data, 'utf8');
}

async function addLicense(packageData) {
  const license = `/**
 * ${packageData.name} v${packageData.version}
 * 
 * @license ${packageData.license}
 * This source code is licensed under the ${packageData.license} license found in the
 * LICENSE file in the root directory of this source tree.
 */
`;

  await Promise.all(
    ['./index.js', './index.mjs'].map(async file => {
      try {
        await prepend(path.resolve(buildPath, file), license);
      } catch (err) {
        if (err.code === 'ENOENT') {
          console.log(`Skipped license for ${file}`);
        } else {
          throw err;
        }
      }
    })
  );
}

async function createPackageFile() {
  const packageData = await fs.readFile(
    path.resolve(packagePath, './package.json'),
    'utf8'
  );
  // eslint-disable-next-line no-unused-vars -- intended omit
  const { scripts, devDependencies, workspaces, ...packageDataOther } =
    JSON.parse(packageData);

  const newPackageData = {
    ...packageDataOther,
    private: false,
    main: './index.js',
    module: './index.mjs',
    types: './index.d.ts',
  };

  const targetPath = path.resolve(buildPath, './package.json');

  await fs.writeFile(
    targetPath,
    JSON.stringify(newPackageData, null, 2),
    'utf8'
  );
  console.log(`Created package.json in ${targetPath}`);

  return newPackageData;
}

async function includeFileInBuild(file, target = path.basename(file)) {
  const sourcePath = path.resolve(packagePath, file);
  const targetPath = path.resolve(buildPath, target);
  await fs.copyFile(sourcePath, targetPath);
  console.log(`Copied ${sourcePath} to ${targetPath}`);
}

async function run() {
  const extraFiles = process.argv.slice(2);
  try {
    const packageData = await createPackageFile();

    await Promise.all(
      ['./README.md', '../../CHANGELOG.md', '../../LICENSE', ...extraFiles].map(
        async file => {
          const [sourcePath, targetPath] = file.split(':');
          await includeFileInBuild(sourcePath, targetPath);
        }
      )
    );

    await addLicense(packageData);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
