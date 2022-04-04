import { join } from 'path';
import { tmpdir } from 'os';
import { iTask } from './types';

export class Task implements iTask {
  constructor(body) {
    const { id, title, worker, department, timestamp } = body;
    if (!id || !title || !worker || !department || !department.DepartmenName || !timestamp) return;

    this.id = id;
    this.title = title;
    this.worker = worker;
    this.department = department;
    this.timestamp = timestamp;

    this.isValid = true;
  }


  id: iTask["id"]
  title: iTask["title"]
  worker: iTask["worker"]
  department: iTask["department"]
  timestamp: iTask["timestamp"]

  isValid: boolean = false


  get fileName() {
    return join(tmpdir(), 'print', `${this.id}.txt`);
  }

  get content() {
    return `${this.formatTime(this.timestamp)}\n` +
      `${this.title}\n` +
      `עובד: ${this.worker} ${this.department.DepartmenName}`;
  }

  private formatTime(timestamp) {
    const t = new Date(timestamp);
    return `${t.getHours()}:${('0' + t.getMinutes()).slice(-2)}`;
  }
}