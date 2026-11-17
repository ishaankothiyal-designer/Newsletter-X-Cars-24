import {mkdtempSync, mkdirSync, cpSync, writeFileSync, readFileSync, rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';

// Deploy only the small redirect output; never upload the working repository.
const project = {"id": "prj_V7R5iGis6hr4zzEcVuU3rSdDxhVG", "name": "newsletter-x-cars-24"};
const temp = mkdtempSync(join(tmpdir(), 'cars24-vercel-redirect-'));
try {
  cpSync(fileURLToPath(new URL('../vercel-redirect/', import.meta.url)), temp, {recursive:true});
  mkdirSync(join(temp, '.vercel'), {recursive:true});
  writeFileSync(join(temp, '.vercel/project.json'), JSON.stringify({
    orgId:'team_0bZH0HWbIcaAPC3lIBVinB4p', projectId:project.id, projectName:project.name,
    settings:{framework:null, buildCommand:'', installCommand:'', outputDirectory:'public', rootDirectory:null, nodeVersion:'22.x'},
  }));
  writeFileSync(join(temp, '.vercel/.env.production.local'), '');
  const run = args => execFileSync('npx', ['--yes','vercel@65.17.0',...args], {cwd:temp, stdio:'inherit'});
  run(['build','--prod','--yes']);
  const config = JSON.parse(readFileSync(join(temp,'.vercel/output/config.json'),'utf8'));
  const redirect = config.routes.find(route => route.status === 307);
  if (!redirect || redirect.src !== '^/(.*)$') throw new Error('Expected root and trailing-slash preserving redirect');
  for (const path of ['/', '/index.html', '/versions/v10/']) {
    if (!new RegExp(redirect.src).test(path)) throw new Error(`Unmatched path: ${path}`);
  }
  console.log(`Verified redirect for ${project.name}: ${redirect.headers.Location}`);
  if (process.argv.includes('--deploy')) run(['deploy','--prebuilt','--prod','--yes','--scope','design-ea38']);
  else console.log('Build only. Pass --deploy after the Vercel deployment allowance is available.');
} finally {
  rmSync(temp, {recursive:true, force:true});
}
