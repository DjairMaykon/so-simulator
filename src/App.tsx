import { useState } from "react";
import { Process } from "./utils/types";

import "./app.css";
import { useCpu } from "./hooks/useCpu";

export function App() {
  const [processNumber, setProcessNumber] = useState<number>(1);
  const [escalonator, setEscalonator] = useState<string>("fifo");
  const [quantum, setQuantum] = useState<number>(1);
  const [sobrecarga, setSobrecarga] = useState<number>(1);
  const [
    processQueue,
    timer,
    processRunning,
    processList,
    clearCpu,
    runCpu,
    setRunCpu,
  ] = useCpu(escalonator, quantum, sobrecarga);

  function processExecutionColor(
    process: Process,
    indexProcessInTime: number
  ): string {
    if (process.id != processRunning[indexProcessInTime].process) return "";
    if (processRunning[indexProcessInTime].sobrecarga > 0) {
      return "bg-red-800";
    }
    if (
      escalonator == "edf" &&
      processRunning[indexProcessInTime].time >=
        process.entryTime + process.deadline
    ) {
      return "bg-gray-800";
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
    </>
  );
}
