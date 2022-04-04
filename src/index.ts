import { execFile } from 'child_process';
import { writeFile } from 'fs';
import { join } from 'path';
import cors from 'cors';
import Express from "express"
import { Task } from "./task.class";

const server = Express()
  .use(Express.json())
  .use(cors())
  .use((req, res, next) => { console.log(req.method, req.url); next(); });

server.get('/ping', (req, res) => {
  res.send({ ok: true });
});

server.post('/print', (req, res) => {
  const task = new Task(req.body);
  if (!task.isValid) return res.status(400).send({ error: 'missing details' });

  try {
    writeFile(task.fileName, task.content, (err) => {
      if (err) return res.status(500).send({ error: err.message });

      const printer = join(__dirname, "../lib", 'printer.exe')
      execFile(printer, [task.fileName]);
      return res.send({ ok: true });
    });
  } catch (err) {
    return res.status(500).send({ error: err.message || 'error while trying to process the print request' });
  }
});

server.listen(8215, () => console.log('listening on port 8215...'));
