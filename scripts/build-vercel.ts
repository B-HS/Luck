import { mkdirSync, writeFileSync, copyFileSync, readdirSync } from 'fs'

const FUNC_DIR = '.vercel/output/functions/api/index.func'

mkdirSync(FUNC_DIR, { recursive: true })
mkdirSync('.vercel/output/static', { recursive: true })

const result = Bun.spawnSync(['bun', 'build', 'entry/vercel.ts', '--outfile', `${FUNC_DIR}/index.js`, '--target', 'node', '--format', 'esm'])

if (result.exitCode !== 0) {
    console.error(result.stderr.toString())
    process.exit(1)
}

console.log(result.stdout.toString())

writeFileSync(
    `${FUNC_DIR}/.vc-config.json`,
    JSON.stringify({
        runtime: 'nodejs22.x',
        handler: 'index.js',
        launcherType: 'Nodejs',
    }),
)

writeFileSync(`${FUNC_DIR}/package.json`, JSON.stringify({ type: 'module' }))

const publicFiles = readdirSync('public')
for (const file of publicFiles) {
    copyFileSync(`public/${file}`, `.vercel/output/static/${file}`)
}

writeFileSync(
    '.vercel/output/config.json',
    JSON.stringify({
        version: 3,
        routes: [{ handle: 'filesystem' }, { src: '/(.*)', dest: '/api/index' }],
    }),
)

console.log('Vercel Build Output API 빌드 완료')
