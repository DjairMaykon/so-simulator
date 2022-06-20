import { useState } from "react";
import { Process } from "./utils/types";

import "./app.css";
import { useCpu } from "./hooks/useCpu";

export function App() {
  const [processNumber, setProcessNumber] = useState<number>(1);
  const [escalonatorProcess, setEscalonatorProcess] = useState<string>("fifo");
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
    editaProcesso,
    adicionaProcesso,
    ram,
  ] = useCpu(escalonatorProcess, quantum, sobrecarga);

  function processExecutionColor(
    process: Process,
    indexProcessInTime: number
  ): string {
    if (process.id != processRunning[indexProcessInTime].process) return "";
    if (processRunning[indexProcessInTime].sobrecarga > 0) {
      return "bg-red-800";
    }
    if (
      escalonatorProcess == "edf" &&
      processRunning[indexProcessInTime].time >=
        process.entryTime + process.deadline
    ) {
      return "bg-gray-500";
    }
    return "bg-green-800";
  }

  function validaPositiveNumber(n: string) {
    return !isNaN(parseInt(n)) && parseInt(n) >= 0;
  }
  function validaNumberGreaterThan0(n: string) {
    return !isNaN(parseInt(n)) && parseInt(n) > 0;
  }

  return (
    <>
      <div className="flex">
        <div className="border-2 h-fit">
          <div className="flex gap-5 p-2">
            <button
              disabled={processList.length == 0}
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
            <label className="flex gap-2">
              Quantum:
              <input
                disabled={runCpu}
                className="border-gray-700 border-2 w-24 rounded"
                type="number"
                value={quantum}
                onChange={(e) =>
                  validaNumberGreaterThan0(e.target.value) &&
                  setQuantum(parseInt(e.target.value))
                }
              />
            </label>
            <label className="flex gap-2">
              Sobrecarga
              <input
                disabled={runCpu}
                className="border-gray-700 border-2 w-24 rounded"
                type="number"
                value={sobrecarga}
                onChange={(e) =>
                  validaNumberGreaterThan0(e.target.value) &&
                  setSobrecarga(parseInt(e.target.value))
                }
              />
            </label>
          </div>
          <hr />
          <div className="flex gap-5 p-2">
            <label className="flex gap-0.5">
              Fifo
              <input
                disabled={runCpu}
                type="checkbox"
                checked={escalonatorProcess == "fifo"}
                onChange={(e) =>
                  e.target.checked && setEscalonatorProcess("fifo")
                }
              />
            </label>
            <label className="flex gap-0.5">
              SJF
              <input
                disabled={runCpu}
                type="checkbox"
                checked={escalonatorProcess == "sjf"}
                onChange={(e) =>
                  e.target.checked && setEscalonatorProcess("sjf")
                }
              />
            </label>
            <label className="flex gap-0.5">
              RR
              <input
                disabled={runCpu}
                type="checkbox"
                checked={escalonatorProcess == "rr"}
                onChange={(e) =>
                  e.target.checked && setEscalonatorProcess("rr")
                }
              />
            </label>
            <label className="flex gap-0.5">
              EDF
              <input
                disabled={runCpu}
                type="checkbox"
                checked={escalonatorProcess == "edf"}
                onChange={(e) =>
                  e.target.checked && setEscalonatorProcess("edf")
                }
              />
            </label>
          </div>
          <hr />
          <div className="flex gap-1 p-2">
            <h1>Timer: {timer > 0 && timer - 1}</h1>
          </div>
          <hr />
          <div className="flex gap-1 p-2">
            <h1>Fila:</h1>
            {processQueue.map((p, i) => (
              <h2 key={i}>{p}</h2>
            ))}
          </div>
        </div>
        <div>
          <h1>Memoria Ram</h1>
          <table className="table-ram flex flex-wrap">
            {[...Array(50)].map((n, i) => (
              <td>
                {i + 1}: {ram[i] != undefined && ram[i]}
              </td>
            ))}
          </table>
        </div>
      </div>
      <hr />
      <div className="flex flex-col gap-2 p-2">
        <button
          disabled={runCpu}
          className="w-fit rounded bg-amber-400 p-1"
          onClick={adicionaProcesso}
        >
          Adicionar Processo
        </button>
        <table className="table-process flex flex-col gap-0">
          <thead>
            <tr>
              <td className="process-info">Nº</td>
              <td className="process-info">TC</td>
              <td className="process-info">TE</td>
              <td className="process-info">D</td>
              <td className="process-info">P</td>
            </tr>
          </thead>
          <tbody>
            {processList
              .sort((a, b) => a.id - b.id)
              .map((process, i) => (
                <tr key={i}>
                  <td className="process-info">{process.id}</td>
                  <td className="process-info">
                    <input
                      type="number"
                      value={process.entryTime}
                      onChange={(e) =>
                        validaPositiveNumber(e.target.value) &&
                        editaProcesso(process.id, {
                          entryTime: parseInt(e.target.value),
                        })
                      }
                      className="w-full h-full text-center"
                    />
                  </td>
                  <td className="process-info">
                    <input
                      type="number"
                      value={process.executionTime}
                      onChange={(e) =>
                        validaPositiveNumber(e.target.value) &&
                        editaProcesso(process.id, {
                          executionTime: parseInt(e.target.value),
                        })
                      }
                      className="w-full h-full text-center"
                    />
                  </td>
                  <td className="process-info">
                    <input
                      type="number"
                      value={process.deadline}
                      onChange={(e) =>
                        validaPositiveNumber(e.target.value) &&
                        editaProcesso(process.id, {
                          deadline: parseInt(e.target.value),
                        })
                      }
                      className="w-full h-full text-center"
                    />
                  </td>
                  <td className="process-info">
                    <input
                      type="number"
                      value={process.pagesQuantity}
                      onChange={(e) =>
                        validaPositiveNumber(e.target.value) &&
                        editaProcesso(process.id, {
                          pagesQuantity: parseInt(e.target.value),
                        })
                      }
                      className="w-full h-full text-center"
                    />
                  </td>
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
      </div>
    </>
  );
}
