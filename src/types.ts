export interface iTask {
  id: string
  title: string
  worker: string
  department: {
    DepartmenName: string
    id: string
  }
  timestamp: number
}
