import { useState } from "react";
import { Process } from "./utils/types";

import "./app.css";
import { useCpu } from "./hooks/useCpu";

export function App() {
  const [processNumber, setProcessNumber] = useState<number>(1);
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
  const [quantum, setQuantum] = useState<number>(1);
  const [sobrecarga, setSobrecarga] = useState<number>(1);
  const [processQueue, timer, processRunning, clearCpu, runCpu, setRunCpu] =
    useCpu(escalonator, quantum, sobrecarga, processList, executeProcess);

  function executeProcess(processId: number) {
    setProcessList(
      processList.map((p) =>
        p.id === processId
          ? Object.assign(p, { executedTimes: p.executedTimes + 1 })
          : p
      )
    );
  }

  function processExecutionColor(
    process: Process,
    indexProcessInTime: number
  ): string {
    if (process.id != processRunning[indexProcessInTime].process) return "";
    if (processRunning[indexProcessInTime].sobrecarga > 0) {
      return "bg-red-800";
    }
    return "bg-green-800";
  }

  return (
    <>
      <div className="flex gap-5">
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
        <label>
          RR
          <input
            type="checkbox"
            checked={escalonator == "rr"}
            onChange={(e) => e.target.checked && setEscalonator("rr")}
          />
        </label>
        <label>
          EDF
          <input
            type="checkbox"
            checked={escalonator == "edf"}
            onChange={(e) => e.target.checked && setEscalonator("edf")}
          />
        </label>
        <button
          className="px-2 bg-green-400 rounded border border-green-500"
          onClick={() => setRunCpu(!runCpu)}
        >
          {!runCpu ? "Play" : "Pause"}
        </button>
        <button
          className="px-2 bg-red-400 rounded border border-red-500"
          onClick={() => clearCpu()}
        >
          Clear
        </button>
      </div>
      <hr />
      <div>
        <h1>Timer: {timer > 0 && timer - 1}</h1>
      </div>
      <hr />
      <div className="flex gap-1">
        <h1>Fila:</h1>
        {processQueue.map((p, i) => (
          <h2 key={i}>{p}</h2>
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
                {processRunning.map((processInTime, indexProcessInTime) => (
                  <td
                    key={`${i}-${indexProcessInTime}`}
                    className={`${processExecutionColor(
                      process,
                      indexProcessInTime
                    )}`}
                  ></td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
      <div className="flex flex-col">
        <input
          type="number"
          value={processNumber}
          onChange={(e) =>
            e.target.value &&
            !isNaN(parseInt(e.target.value)) &&
            parseInt(e.target.value) > 0 &&
            setProcessNumber(parseInt(e.target.value))
          }
        />
        {processNumber &&
          [...Array(processNumber)].map(() => (
            <div>
              <label>
                TC
                <input type="text" />
              </label>

              <label>
                TC
                <input type="text" />
              </label>

              <label>
                TC
                <input type="text" />
              </label>

              <label>
                TC
                <input type="text" />
              </label>
            </div>
          ))}
      </div>
    </>
  );
}
