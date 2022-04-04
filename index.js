const { execFile } = require('child_process');
const { writeFile } = require('fs');
const printer = 'printer.exe';
const cors = require('cors');
const Express = require('express');
const Task = require("./task.class");

const server = Express()
  .use(Express.json())
  .use(cors())
  .use((req, res, next) => { console.log(req.method, req.url); next(); });

server.get('/ping', (req, res) => {
  res.send({ ok: true });
});

server.post('/print', (req, res) => {
  const task = new Task(req.body);
  if (!task.valid) return res.status(400).send({ error: 'missing details' });

  try {
    const file = task.getFileName();
    writeFile(file, task.buildContent(), (err) => {
      if (err) return res.status(500).send({ error: err.message });

      execFile(printer, [file]);
      return res.send({ ok: true });
    });
  } catch (err) {
    return res.status(500).send({ error: err.message || 'error while trying to process the print request' });
  }
});

server.listen(8215, () => console.log('listening on port 8215...'));
