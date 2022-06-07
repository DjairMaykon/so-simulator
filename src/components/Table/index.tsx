import { useEffect, useState } from "react";
import { Process } from "../../utils/types";

export function Table() {
  const [processList, setProcessList] = useState<Process[]>([
    {
      id: 0,
      entryTime: 0,
      executionTime: 4,
      deadline: 7,
      priority: 0,
      executedTimes: 0,
    },
    {
      id: 1,
      entryTime: 2,
      executionTime: 2,
      deadline: 5,
      priority: 1,
      executedTimes: 0,
    },
    {
      id: 2,
      entryTime: 4,
      executionTime: 1,
      deadline: 8,
      priority: 2,
      executedTimes: 0,
    },
    {
      id: 3,
      entryTime: 6,
      executionTime: 3,
      deadline: 10,
      priority: 3,
      executedTimes: 0,
    },
  ]);
  const [processQueue, setProcessQueue] = useState<number[]>([]);
  const [timer, setTimer] = useState<number>(0);
  const [processRunning, setProcessRunning] = useState<number[]>([]);
  const quantum = 2;

  function processExecutionColor(
    process: Process,
    processInTime: number
  ): string {
    if (process.id == processInTime) {
      return "bg-green-800";
    }
    return "";
  }

  function escalonator() {
    if (processQueue.length == 0) return;
    setProcessRunning([...processRunning, processQueue[0]]);
    processList[processQueue[0]].executedTimes++;
    let processChange = processList.find(
      (process) => process.id == processQueue[0]
    );
    setProcessList([
      ...processList.filter((process, i) => process.id != processQueue[0]),
    ]);
  }

  useEffect(() => {
    if (timer < 20) {
      let interval = setInterval(() => {
        setTimer((oldTimer) => oldTimer + 1);
        setProcessQueue([
          ...processQueue,
          ...processList
            .filter((process) => process.entryTime == timer)
            .map((process, i) => process.id),
        ]);
        escalonator();
      }, 1000);
      return () => clearInterval(interval);
    }
  });
  return (
    <table className="table-process flex flex-col gap-0">
      <thead>
        <tr>
          <td>Nº</td>
          <td>TC</td>
          <td>TE</td>
          <td>D</td>
        </tr>
      </thead>
      <tbody>
        {processList.map((process, i) => (
          <tr key={i}>
            <td className="process-info">{i + 1}</td>
            <td className="process-info">{process.entryTime}</td>
            <td className="process-info">{process.executionTime}</td>
            <td className="process-info">{process.deadline}</td>
            {processRunning.map((processInTime, index) => (
              <td
                className={`process-info ${processExecutionColor(
                  process,
                  processInTime
                )}`}
              ></td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
