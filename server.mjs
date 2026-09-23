import http from 'node:http'
import https from 'node:https'
import { createReadStream, existsSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = path.dirname(fileURLToPath(import.meta.url))
const distDir = path.join(rootDir, 'dist')
const port = Number(process.env.PORT) || 4173
const backendUrl = process.env.VITE_BACKEND_URL || 'http://localhost:4000'

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.map': 'application/json',
}

const HOP_BY_HOP = new Set(['connection', 'keep-alive', 'transfer-encoding', 'upgrade', 'te', 'trailer'])

function sendFile(res, filePath, method) {
  const ext = path.extname(filePath).toLowerCase()
  const type = MIME[ext] || 'application/octet-stream'
  res.writeHead(200, {
    'Content-Type': type,
    'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable',
  })
  if (method === 'HEAD') {
    res.end()
    return
  }
  createReadStream(filePath).pipe(res)
}

function sendIndex(res, method) {
  sendFile(res, path.join(distDir, 'index.html'), method)
}

function proxyApi(req, res) {
  const target = new URL(backendUrl)
  const headers = {}
  for (const [key, value] of Object.entries(req.headers)) {
    if (!HOP_BY_HOP.has(key.toLowerCase())) headers[key] = value
  }
  headers.host = target.host
  headers['x-forwarded-host'] = req.headers.host || ''
  headers['x-forwarded-proto'] = 'https'

  const transport = target.protocol === 'https:' ? https : http
  const proxyReq = transport.request(
    {
      protocol: target.protocol,
      hostname: target.hostname,
      port: target.port || (target.protocol === 'https:' ? 443 : 80),
      path: req.url,
      method: req.method,
      headers,
    },
    (proxyRes) => {
      const outHeaders = { ...proxyRes.headers }
      delete outHeaders['transfer-encoding']
      res.writeHead(proxyRes.statusCode || 502, outHeaders)
      proxyRes.pipe(res)
    }
  )
  proxyReq.on('error', () => {
    res.writeHead(502, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ success: false, error: 'Unable to reach backend service.' }))
  })
  req.pipe(proxyReq)
}

const server = http.createServer((req, res) => {
  let pathname
  try {
    pathname = decodeURIComponent((req.url || '/').split('?')[0])
  } catch {
    res.writeHead(400)
    res.end()
    return
  }

  if (pathname === '/api' || pathname.startsWith('/api/')) {
    proxyApi(req, res)
    return
  }

  let filePath = path.normalize(path.join(distDir, pathname))
  if (!filePath.startsWith(distDir)) {
    res.writeHead(403)
    res.end()
    return
  }

  if (existsSync(filePath) && statSync(filePath).isFile()) {
    sendFile(res, filePath, req.method)
    return
  }

  const indexInDir = path.join(filePath, 'index.html')
  if (existsSync(indexInDir) && statSync(indexInDir).isFile()) {
    sendFile(res, indexInDir, req.method)
    return
  }

  sendIndex(res, req.method)
})

server.listen(port, '0.0.0.0', () => {
  console.log(`loft-frontend static server listening on http://0.0.0.0:${port}`)
  console.log(`proxying /api -> ${backendUrl}`)
})