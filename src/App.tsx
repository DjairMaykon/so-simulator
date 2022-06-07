import { useEffect, useState } from "react";
import { Process } from "./utils/types";

import "./app.css";

export function App() {
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
  const [escalonator, setEscalonator] = useState<string>("fifo");
  const [runCpu, setRunCpu] = useState<boolean>(false);
  const [processQueue, setProcessQueue] = useState<number[]>([]);
  const [timer, setTimer] = useState<number>(0);
  const [processRunning, setProcessRunning] = useState<number[]>([]);
  const [quantum, setQuantum] = useState<number>(2);

  function processExecutionColor(
    process: Process,
    processInTime: number
  ): string {
    if (process.id == processInTime) {
      return "bg-green-800";
    }
    return "";
  }

  function escalonar() {
    if (escalonator == "sjf")
      processQueue.sort(
        (a, b) =>
          (processList.find((p) => p.id == a)?.executionTime ?? 0) -
          (processList.find((p) => p.id == a)?.executedTimes ?? 0) -
          (processList.find((p) => p.id == b)?.executionTime ?? 0) -
          (processList.find((p) => p.id == b)?.executedTimes ?? 0)
      );

    // Diz qual processo deve rodar agora
    if (processQueue.length == 0) return;
    setProcessRunning([...processRunning, processQueue[0]]);

    // Tira o processo que já executou
    processList[processQueue[0]].executedTimes++;
    if (
      processList[processQueue[0]].executedTimes ==
      processList[processQueue[0]].executionTime
    )
      setProcessQueue(processQueue.slice(1));
  }

  useEffect(() => {
    if (runCpu) {
      let interval = setInterval(async () => {
        // Adiciono na fila o processo
        const result = processList
          .filter((p) => p.entryTime == timer)
          .map((p) => p.id);
        processQueue.push(...result);

        // chamo o escalonador
        escalonar();

        setTimer(timer + 1);
      }, 1000 * quantum);
      return () => clearInterval(interval);
    }
  });
  return (
    <>
      <div>
        <label>
          Fifo
          <input
            type="checkbox"
            checked={escalonator == "fifo"}
            onChange={(e) => e.target.checked && setEscalonator("fifo")}
          />
        </label>
        <label>
          SJF
          <input
            type="checkbox"
            checked={escalonator == "sjf"}
            onChange={(e) => e.target.checked && setEscalonator("sjf")}
          />
        </label>
        <button onClick={() => setRunCpu(!runCpu)}>Run</button>
      </div>
      <hr />
      <div>
        <h1>Timer: {timer > 0 && timer - 1}</h1>
      </div>
      <hr />
      <div className="flex gap-1">
        <h1>Fila:</h1>
        {processQueue.map((p, i) => (
          <h2>{p}</h2>
        ))}
      </div>
      <table className="table-process flex flex-col gap-0">
        <thead>
          <tr>
            <td className="process-info">Nº</td>
            <td className="process-info">TC</td>
            <td className="process-info">TE</td>
            <td className="process-info">D</td>
          </tr>
        </thead>
        <tbody>
          {processList
            .sort((a, b) => a.id - b.id)
            .map((process, i) => (
              <tr key={i}>
                <td className="process-info">{process.id}</td>
                <td className="process-info">{process.entryTime}</td>
                <td className="process-info">{process.executionTime}</td>
                <td className="process-info">{process.deadline}</td>
                {processRunning.map((processInTime, index) => (
                  <td
                    key={`${i}-${index}`}
                    className={`${processExecutionColor(
                      process,
                      processInTime
                    )}`}
                  ></td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
    </>
  );
}
