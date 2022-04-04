const { join } = require('path');
const { tmpdir } = require('os');

class Task {
  id;
  title;
  worker;
  department;
  timestamp;

  valid;

  constructor(body) {
    const { id, title, worker, department, timestamp } = body;
    if (!id || !title || !worker || !department || !department.DepartmenName || !timestamp) {
      this.valid = false;
      return;
    } else {
      this.id = id;
      this.title = title;
      this.worker = worker;
      this.department = department;
      this.timestamp = timestamp;

      this.valid = true;
    }
  }

  getFileName() {
    return join(tmpdir(), 'print', `${this.id}.txt`);
  }

  buildContent() {
    return `${formatTime(this.timestamp)}\n` +
      `${this.title}\n` +
      `עובד: ${this.worker} ${this.department.DepartmenName}`;
  }

}

function formatTime(timestamp) {
  const t = new Date(timestamp);
  return `${t.getHours()}:${('0' + t.getMinutes()).slice(-2)}`;
}

module.exports = Task;