export type Process = {
  id: number;
  entryTime: number;
  deadline: number;
  executionTime: number;
  priority: number;
  executedTimes: number;
  pagesQuantity: number;
  pages: ProcessPage[];
};

export type ProcessPage = {
  index: number;
  ram: boolean;
};
