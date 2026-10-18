const fs = require('fs');
const path = require('path');

const packageJsonPath = path.join(__dirname, '..', 'package.json');
const gradlePath = path.join(__dirname, '..', 'android', 'app', 'build.gradle');

if (!fs.existsSync(gradlePath)) {
  console.error('Error: build.gradle not found at ' + gradlePath);
  process.exit(1);
}

let gradleContent = fs.readFileSync(gradlePath, 'utf8');

// Match versionCode and versionName
const codeMatch = gradleContent.match(/versionCode\s+(\d+)/);
const nameMatch = gradleContent.match(/versionName\s+"([^"]+)"/);

if (!codeMatch) {
  console.error('Could not find versionCode in build.gradle');
  process.exit(1);
}

const currentCode = parseInt(codeMatch[1], 10);
const nextCode = currentCode + 1;

let currentName = nameMatch ? nameMatch[1] : '1.0.0';
const parts = currentName.split('.').map(n => parseInt(n, 10));
if (parts.length >= 2) {
  parts[parts.length - 1] = (parts[parts.length - 1] || 0) + 1;
}
const nextName = parts.join('.');

console.log(`Bumping Version: Code ${currentCode} -> ${nextCode}, Name ${currentName} -> ${nextName}`);

gradleContent = gradleContent.replace(/versionCode\s+\d+/, `versionCode ${nextCode}`);
gradleContent = gradleContent.replace(/versionName\s+"[^"]+"/, `versionName "${nextName}"`);

fs.writeFileSync(gradlePath, gradleContent, 'utf8');

// Also update package.json if present
if (fs.existsSync(packageJsonPath)) {
  const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  pkg.version = nextName;
  fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2), 'utf8');
}

console.log('✅ Successfully updated Android versionCode and versionName!');
