const { execFile } = require('child_process')
const { join } = require('path')
const { tmpdir } = require('os')
const { writeFile } = require('fs')
const printer = 'printer.exe'

const cors = require('cors');
const Express = require('express')
const server = Express()
    .use(Express.json())
    .use(cors())
    .use((req, res, next) => {
        console.log(req.method, req.url);
        next()
    })

server.get('/ping', (req, res) => {
    res.send({ ok: true })
})

server.post('/print', (req, res) => {
    const { _id, title, worker, floor, timestamp } = req.body
    if (!_id || !title || !worker || !floor || !timestamp)
        return res.status(400).send({ error: 'missing details' })

    try {
        const file = join(tmpdir(), 'print', `${_id}.txt`)
        const content =
            `${formatTime(timestamp)}\n` +
            `${title}\n` +
            `עובד: ${worker} קומה ${floor}`

        writeFile(file, content, (err) => {
            if (err) return res.status(500).send({ error: err.message })
            execFile(printer, [file])
        })
    } catch (err) {
        if (err) return res.status(500)
            .send({ error: err.message || 'error while trying to process the print request' })
    }
    res.send({ ok: true })
})

server.listen(8215, () => console.log('listening on port 8215...'))

function formatTime(timestamp) {
    const t = new Date(timestamp)
    return `${t.getHours()}:${('0' + t.getMinutes()).slice(-2)}`
}