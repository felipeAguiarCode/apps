import fs from 'node:fs';
import path from 'node:path';

const images = /\.(?:avif|gif|ico|jpe?g|png|svg|webp)$/i;
const types = {
  icons: images,
  squares: images,
  banners: images,
  screenshots: images,
  videos: /\.(?:mp4|webm|ogv)$/i
};

function assetFiles(directory, type) {
  const stat = fs.lstatSync(directory, { throwIfNoEntry: false });
  if (!stat) return [];
  if (!stat.isDirectory()) throw new Error(`Expected a media directory at ${directory}.`);

  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    if (entry.isSymbolicLink()) throw new Error(`Media files cannot be symbolic links: ${path.join(directory, entry.name)}`);
    if (entry.isDirectory()) {
      return assetFiles(path.join(directory, entry.name), type).map(file => `${entry.name}/${file}`);
    }
    return entry.isFile() && types[type].test(entry.name) ? [entry.name] : [];
  }).sort();
}

export function syncProjectAssets(root, project, checkout) {
  if (!fs.statSync(checkout, { throwIfNoEntry: false })?.isDirectory()) {
    throw new Error(`Could not find a checkout of ${project.name} at ${checkout}.`);
  }

  const store = path.join(checkout, '.store');
  const source = fs.lstatSync(store, { throwIfNoEntry: false });
  if (source && !source.isDirectory()) throw new Error(`Expected a .store directory in ${checkout}.`);
  const destination = path.join(root, 'assets/projects', project.id);
  const target = fs.lstatSync(destination, { throwIfNoEntry: false });
  if (target && !target.isDirectory()) throw new Error(`Expected a media directory at ${destination}.`);
  const plan = Object.keys(types).map(type => {
    const input = path.join(store, type);
    const output = path.join(destination, type);
    return { input, output, files: new Set(assetFiles(input, type)), existing: assetFiles(output, type) };
  });

  for (const { input, output, files, existing } of plan) {
    for (const file of files) {
      const outputFile = path.join(output, file);
      fs.mkdirSync(path.dirname(outputFile), { recursive: true });
      fs.copyFileSync(path.join(input, file), outputFile);
    }
    for (const file of existing) {
      if (!files.has(file)) fs.unlinkSync(path.join(output, file));
    }
  }

  if (!source) console.log(`${project.name} has no .store directory and will be displayed without media.`);
}

export function projectAssets(root, project) {
  const relative = `assets/projects/${project.id}`;
  const files = type => assetFiles(path.join(root, relative, type), type);
  const url = (type, file) => file && `${relative}/${type}/${file.split('/').map(encodeURIComponent).join('/')}`;
  const icons = files('icons');
  const icon = icons.find(file => /(^|\/)icon-128\.png$/i.test(file)) ?? icons[0];
  const labels = new Map(project.screens ?? []);
  const screens = new Map(files('screenshots').map(file => [file, {
    image: url('screenshots', file),
    label: labels.get(file) ?? path.basename(file, path.extname(file)).replace(/^\d+[-_ ]+/, '').replace(/[-_]+/g, ' ')
  }]));

  return {
    icon: url('icons', icon),
    square: url('squares', files('squares')[0]),
    banner: url('banners', files('banners')[0]),
    coverScreen: screens.get(project.coverScreen)?.image,
    videos: files('videos').map(file => url('videos', file)),
    screens: [...screens.values()],
    featureScreens: (project.screens ?? []).map(([file]) => screens.get(file))
  };
}
