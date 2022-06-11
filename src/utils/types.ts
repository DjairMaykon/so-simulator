export type Process = {
  id: number;
  entryTime: number;
  deadline: number;
  executionTime: number;
  priority: number;
  executedTimes: number;
  paginas?: {
    index: number;
    ram: boolean;
  }[];
};
