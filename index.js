const exec = require('child_process').execFile
const path = require('path')
const os = require('os')
const fs = require('fs')
const printer = path.join(os.tmpdir(), 'print', 'printer.exe')
const cors = require('cors');
const Express = require('express')
const server = Express()
    .use(Express.json())
    .use(cors())
    .use((req, res, next) => {
        console.log(req.method, req.url)
        next()
    })

server.get('/check', (req, res) => { res.send('true') })

server.post('/print', (req, res) => {
    const { _id, title } = req.body
    if (!_id || !title) return res.status(400).send({ error: 'missing id or title' })
    try {
        const file = path.join(os.tmpdir(), 'print', `${_id}.txt`)
        fs.writeFile(file, title, (err) => {
            if (err) return res.status(500).send({ error: err.message })
            exec(printer, [file])
        })
    } catch (err) {
        if (err) return res.status(500).send({ error: err.message || 'unknown error' })
    }
    res.send({ ok: true })
})

server.listen(8215, () => console.log('listening on port 8215...'))