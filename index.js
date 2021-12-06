const exec = require('child_process').execFile
const path = require('path')
const os = require('os')
const fs = require('fs')
const printer = 'printer.exe'
const cors = require('cors');
const Express = require('express')
const server = Express()
    .use(Express.json())
    .use(cors())
    .use((req, res, next) => { console.log(req.method, req.url); next() })

server.get('/check', (req, res) => { res.send('true') })

server.post('/print', (req, res) => {
    const { _id, title, worker, floor, timestamp } = req.body
    if (!_id || !title || !worker || !floor || !timestamp) {
        return res.status(400).send({ error: 'missing id or title' })
    }
    try {
        const file = path.join(os.tmpdir(), 'print', `${_id}.txt`)

        const content =
            `${formatTime(timestamp)}\n` +
            `${title}\n` +
            `עובד: ${worker} קומה ${floor}`
        fs.writeFile(file, content, (err) => {
            if (err) return res.status(500).send({ error: err.message })
            exec(printer, [file])
        })
    } catch (err) {
        if (err) return res.status(500).send({ error: err.message || 'unknown error' })
    }
    res.send({ ok: true })
})

server.listen(8215, () => console.log('listening on port 8215...'))


function formatTime(timestamp) {
    const t = new Date(timestamp)
    return `${t.getHours()}:${('0' + t.getMinutes()).slice(-2)}`
}