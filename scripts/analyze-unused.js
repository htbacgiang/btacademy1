const fs = require('fs')
const path = require('path')

const root = process.cwd()
const ignoreDirs = new Set(['node_modules', '.next', '.git'])
const codeExts = new Set(['.js', '.jsx', '.ts', '.tsx'])

function toPosix(p) {
  return p.split(path.sep).join('/')
}

function walk(dirAbs) {
  const out = []
  for (const ent of fs.readdirSync(dirAbs, { withFileTypes: true })) {
    if (ent.isDirectory()) {
      if (ignoreDirs.has(ent.name)) continue
      out.push(...walk(path.join(dirAbs, ent.name)))
    } else {
      out.push(path.join(dirAbs, ent.name))
    }
  }
  return out
}

function isCodeFile(fileAbs) {
  const ext = path.extname(fileAbs)
  if (!codeExts.has(ext)) return false
  if (fileAbs.endsWith('.d.ts')) return false
  return true
}

function readAllCodeFiles() {
  const files = walk(root).filter(isCodeFile)
  return files.map((abs) => {
    const rel = toPosix(path.relative(root, abs))
    return { abs, rel, text: fs.readFileSync(abs, 'utf8') }
  })
}

function getKeysForRelNoExt(relNoExt) {
  const keys = [relNoExt]
  if (relNoExt.endsWith('/index')) keys.push(relNoExt.slice(0, -'/index'.length))
  return keys.filter(Boolean)
}

function countRefs(keys, codeIndex, selfRel) {
  let count = 0
  const refFiles = []
  for (const f of codeIndex) {
    if (f.rel === selfRel) continue
    for (const key of keys) {
      if (f.text.includes(key)) {
        count++
        if (refFiles.length < 8) refFiles.push(f.rel)
        break
      }
    }
  }
  return { count, refFiles }
}

function analyzeDirUsage(dirRel, codeIndex) {
  const dirAbs = path.join(root, dirRel)
  if (!fs.existsSync(dirAbs)) return { dirRel, files: [] }
  const files = walk(dirAbs).filter(isCodeFile)
  const results = files.map((abs) => {
    const rel = toPosix(path.relative(root, abs))
    const relNoExt = rel.replace(/\.(js|jsx|ts|tsx)$/, '')
    const keys = getKeysForRelNoExt(relNoExt)
    const { count, refFiles } = countRefs(keys, codeIndex, rel)
    return { file: rel, refCount: count, keys, refFiles }
  })
  results.sort((a, b) => a.refCount - b.refCount || a.file.localeCompare(b.file))
  return { dirRel, files: results }
}

function routeFromApiRel(apiRel) {
  let route = apiRel.replace(/^pages\/api\//, '').replace(/\.(js|jsx|ts|tsx)$/, '')
  route = route.replace(/\/index$/, '')
  return '/api/' + route
}

function analyzeApiUsage(codeIndex) {
  const apiDir = path.join(root, 'pages', 'api')
  if (!fs.existsSync(apiDir)) return []
  const apiFiles = walk(apiDir)
    .filter(isCodeFile)
    .map((abs) => toPosix(path.relative(root, abs)))
    .filter((rel) => !rel.startsWith('pages/api/auth/lib/'))

  const nonApiCode = codeIndex.filter((f) => !f.rel.startsWith('pages/api/'))

  const results = apiFiles.map((rel) => {
    const route = routeFromApiRel(rel)
    const dynIdx = route.indexOf('[')
    const prefix = dynIdx > -1 ? route.slice(0, dynIdx) : route
    const keys = Array.from(new Set([route, prefix].filter(Boolean)))

    let hitCount = 0
    const hitFiles = []
    for (const f of nonApiCode) {
      for (const key of keys) {
        if (f.text.includes(key)) {
          hitCount++
          if (hitFiles.length < 8) hitFiles.push(f.rel)
          break
        }
      }
    }

    return { route, file: rel, hitCount, keys, hitFiles }
  })

  results.sort((a, b) => a.hitCount - b.hitCount || a.route.localeCompare(b.route))
  return results
}

function printSection(title, lines) {
  process.stdout.write('\n' + title + '\n')
  for (const line of lines) process.stdout.write(line + '\n')
}

function main() {
  const codeIndex = readAllCodeFiles()

  const api = analyzeApiUsage(codeIndex)
  const components = analyzeDirUsage('components', codeIndex)
  const hooks = analyzeDirUsage('hooks', codeIndex)
  const lib = analyzeDirUsage('lib', codeIndex)
  const emails = analyzeDirUsage('emails', codeIndex)
  const models = analyzeDirUsage('models', codeIndex)
  const middleware = analyzeDirUsage('middleware', codeIndex)

  const apiZero = api.filter((r) => r.hitCount === 0)
  const componentsZero = components.files.filter((r) => r.refCount === 0)
  const hooksZero = hooks.files.filter((r) => r.refCount === 0)
  const libZero = lib.files.filter((r) => r.refCount === 0)
  const emailsZero = emails.files.filter((r) => r.refCount === 0)
  const modelsZero = models.files.filter((r) => r.refCount === 0)
  const middlewareZero = middleware.files.filter((r) => r.refCount === 0)

  printSection('SUMMARY', [
    `Code files scanned: ${codeIndex.length}`,
    `API routes found: ${api.length}`,
    `Components files found: ${components.files.length}`,
    `Hooks files found: ${hooks.files.length}`,
    `Lib files found: ${lib.files.length}`,
    `Emails files found: ${emails.files.length}`,
    `Models files found: ${models.files.length}`,
    `Middleware files found: ${middleware.files.length}`,
  ])

  printSection('API ROUTES WITH 0 STRING REFS (heuristic)', apiZero.slice(0, 80).map((r) => `- ${r.route}  (${r.file})`))

  printSection('COMPONENT FILES WITH 0 STRING REFS (heuristic)', componentsZero.slice(0, 120).map((r) => `- ${r.file}`))

  printSection('OTHER FILES WITH 0 STRING REFS (heuristic)', [
    ...hooksZero.slice(0, 40).map((r) => `- ${r.file}`),
    ...libZero.slice(0, 40).map((r) => `- ${r.file}`),
    ...emailsZero.slice(0, 40).map((r) => `- ${r.file}`),
    ...modelsZero.slice(0, 40).map((r) => `- ${r.file}`),
    ...middlewareZero.slice(0, 40).map((r) => `- ${r.file}`),
  ])

  const output = {
    summary: {
      codeFiles: codeIndex.length,
      apiRoutes: api.length,
      components: components.files.length,
      hooks: hooks.files.length,
      lib: lib.files.length,
      emails: emails.files.length,
      models: models.files.length,
      middleware: middleware.files.length,
    },
    api,
    components: components.files,
    hooks: hooks.files,
    lib: lib.files,
    emails: emails.files,
    models: models.files,
    middleware: middleware.files,
  }

  const shouldWrite = process.argv.includes('--write')
  if (shouldWrite) {
    const outPath = path.join(root, '.unused-report.json')
    fs.writeFileSync(outPath, JSON.stringify(output, null, 2))
    process.stdout.write('\nWrote report: ' + outPath + '\n')
  } else {
    process.stdout.write('\nTip: run `node scripts/analyze-unused.js --write` to write .unused-report.json\n')
  }
}

main()
