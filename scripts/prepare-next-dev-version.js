const fs = require('fs');
const path = require('path');

function nextDevelopmentVersion(version) {
  const [major, minor, patchPart] = version.split('.');
  const patch = Number.parseInt(patchPart.split('-')[0], 10);
  if (!Number.isInteger(patch)) {
    throw new Error(
      `Cannot calculate the next development version from ${version}`
    );
  }
  return `${major}.${minor}.${patch + 1}-next`;
}

const command = process.argv[2];
const packagePath = path.join(process.cwd(), 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

if (command === 'calculate') {
  console.log(nextDevelopmentVersion(packageJson.version));
} else if (command === 'set') {
  const version = process.env.NEXT_DEV_VERSION;
  if (!version) {
    throw new Error('NEXT_DEV_VERSION is required');
  }
  packageJson.version = version;
  fs.writeFileSync(packagePath, `${JSON.stringify(packageJson, null, 2)}\n`);

  const lockPath = path.join(process.cwd(), 'package-lock.json');
  if (fs.existsSync(lockPath)) {
    const lock = JSON.parse(fs.readFileSync(lockPath, 'utf8'));
    lock.version = version;
    if (lock.packages && lock.packages['']) {
      lock.packages[''].version = version;
    }
    fs.writeFileSync(lockPath, `${JSON.stringify(lock, null, 2)}\n`);
  }
} else {
  throw new Error(`Unsupported command: ${command}`);
}
