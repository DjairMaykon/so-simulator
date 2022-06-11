import { useEffect, useState } from "react";
import { Process } from "./utils/types";

import "./app.css";
import { mergeSort } from "./utils/funcoes";

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
  const [processRunning, setProcessRunning] = useState<
    { process: number; sobrecarga: number }[]
  >([]);
  const [quantum, setQuantum] = useState<number>(1);
  const [sobrecarga, setSobrecarga] = useState<number>(1);

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

  function sjf() {
    const newQueue =
      (mergeSort(processQueue, (a, b) => {
        return (
          (processList.find((p) => p.id == a)?.executionTime ?? 0) -
          (processList.find((p) => p.id == a)?.executedTimes ?? 0) -
          ((processList.find((p) => p.id == b)?.executionTime ?? 0) -
            (processList.find((p) => p.id == b)?.executedTimes ?? 0))
        );
      }) as number[]) ?? processQueue;
    setProcessQueue(newQueue);
    console.log(newQueue);
    console.log(processQueue);

    // Diz qual processo deve rodar agora
    setProcessRunning([
      ...processRunning,
      { process: newQueue[0], sobrecarga: 0 },
    ]);

    // Tira o processo que já executou
    setProcessList(
      processList.map((p) =>
        p.id === newQueue[0]
          ? Object.assign(p, { executedTimes: p.executedTimes + 1 })
          : p
      )
    );
    const processAtual = processList.find((p) => p.id === newQueue[0]);
    if (
      processAtual &&
      processAtual.executedTimes == processAtual.executionTime
    )
      setProcessQueue(newQueue.slice(1));
  }
  function fifo() {
    // Diz qual processo deve rodar agora
    setProcessRunning([
      ...processRunning,
      { process: processQueue[0], sobrecarga: 0 },
    ]);

    // Tira o processo que já executou
    setProcessList(
      processList.map((p) =>
        p.id === processQueue[0]
          ? Object.assign(p, { executedTimes: p.executedTimes + 1 })
          : p
      )
    );
    const processAtual = processList.find((p) => p.id === processQueue[0]);
    if (
      processAtual &&
      processAtual.executedTimes == processAtual.executionTime
    )
      setProcessQueue(processQueue.slice(1));
  }
  function rr() {
    // se nenhum processo rodou ainda bota o primeiro da fila pra rodar
    if (processRunning.length < quantum) {
      setProcessRunning([
        ...processRunning,
        {
          process: processQueue[0],
          sobrecarga: 0,
        },
      ]);
      setProcessList(
        processList.map((p) =>
          p.id === processQueue[0]
            ? Object.assign(p, { executedTimes: p.executedTimes + 1 })
            : p
        )
      );
      const processAtual = processList.find((p) => p.id === processQueue[0]);
      if (
        processAtual &&
        processAtual.executedTimes == processAtual.executionTime
      )
        setProcessQueue(processQueue.slice(1));
    } else {
      // eu tava rodando a sobrecarga?
      if (processRunning.slice(-1)[0].sobrecarga > 0) {
        if (processRunning.slice(-1)[0].sobrecarga < sobrecarga) {
          setProcessRunning([
            ...processRunning,
            {
              process: processQueue[0],
              sobrecarga: processRunning.slice(-1)[0].sobrecarga + 1,
            },
          ]);
        } else {
          const processToRun = processQueue.slice(1)[0];
          setProcessQueue([...processQueue.slice(1), processQueue[0]]);
          setProcessRunning([
            ...processRunning,
            {
              process: processToRun,
              sobrecarga: 0,
            },
          ]);
          setProcessList(
            processList.map((p) =>
              p.id === processToRun
                ? Object.assign(p, { executedTimes: p.executedTimes + 1 })
                : p
            )
          );
        }
      } else if (
        processRunning
          .slice(-1 * quantum)
          .every((p) => p.process == processQueue[0])
      ) {
        const processAtual = processList.find((p) => p.id === processQueue[0]);
        console.log("aqui");
        if (
          processAtual &&
          processAtual.executedTimes == processAtual.executionTime
        ) {
          const nextProcess = processQueue[1];
          setProcessQueue(processQueue.slice(1));
          if (nextProcess) {
            setProcessRunning([
              ...processRunning,
              {
                process: nextProcess,
                sobrecarga: 0,
              },
            ]);

            setProcessList(
              processList.map((p) =>
                p.id === nextProcess
                  ? Object.assign(p, { executedTimes: p.executedTimes + 1 })
                  : p
              )
            );
          }
        } else {
          setProcessRunning([
            ...processRunning,
            {
              process: processQueue[0],
              sobrecarga: 1,
            },
          ]);
        }
      }
    }
    // ver ultimo se o processo que ta rodando ja passou do quantum
    // caso sim verificar se ele ja terminou
    // se nao terminou começar a sobrecarga
    // no fim da sobrecarga jogar ele para o fim da fila
  }
  function edf() {
    // se nenhum processo rodou ainda bota o primeiro da fila pra rodar
    if (processRunning.length < quantum) {
      setProcessRunning([
        ...processRunning,
        {
          process: processQueue[0],
          sobrecarga: 0,
        },
      ]);
      setProcessList(
        processList.map((p) =>
          p.id === processQueue[0]
            ? Object.assign(p, { executedTimes: p.executedTimes + 1 })
            : p
        )
      );
      const processAtual = processList.find((p) => p.id === processQueue[0]);
      if (
        processAtual &&
        processAtual.executedTimes == processAtual.executionTime
      )
        setProcessQueue(processQueue.slice(1));
    } else {
      // eu tava rodando a sobrecarga?
      if (processRunning.slice(-1)[0].sobrecarga > 0) {
        if (processRunning.slice(-1)[0].sobrecarga < sobrecarga) {
          setProcessRunning([
            ...processRunning,
            {
              process: processQueue[0],
              sobrecarga: processRunning.slice(-1)[0].sobrecarga + 1,
            },
          ]);
        } else {
          const processToRun = processQueue.slice(1)[0];
          setProcessQueue([...processQueue.slice(1), processQueue[0]]);
          setProcessRunning([
            ...processRunning,
            {
              process: processToRun,
              sobrecarga: 0,
            },
          ]);
          setProcessList(
            processList.map((p) =>
              p.id === processToRun
                ? Object.assign(p, { executedTimes: p.executedTimes + 1 })
                : p
            )
          );
        }
      } else if (
        processRunning
          .slice(-1 * quantum)
          .every((p) => p.process == processQueue[0])
      ) {
        const processAtual = processList.find((p) => p.id === processQueue[0]);
        console.log("aqui");
        if (
          processAtual &&
          processAtual.executedTimes == processAtual.executionTime
        ) {
          const nextProcess = processQueue[1];
          setProcessQueue(processQueue.slice(1));
          if (nextProcess) {
            setProcessRunning([
              ...processRunning,
              {
                process: nextProcess,
                sobrecarga: 0,
              },
            ]);

            setProcessList(
              processList.map((p) =>
                p.id === nextProcess
                  ? Object.assign(p, { executedTimes: p.executedTimes + 1 })
                  : p
              )
            );
          }
        } else {
          setProcessRunning([
            ...processRunning,
            {
              process: processQueue[0],
              sobrecarga: 1,
            },
          ]);
        }
      }
    }
    // ver ultimo se o processo que ta rodando ja passou do quantum
    // caso sim verificar se ele ja terminou
    // se nao terminou começar a sobrecarga
    // no fim da sobrecarga jogar ele para o fim da fila
  }

  function escalonar() {
    if (processQueue.length == 0) return;

    if (escalonator == "fifo") fifo();
    if (escalonator == "sjf") sjf();
    if (escalonator == "rr") rr();
    if (escalonator == "edf") edf();
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
      }, 1000);
      return () => clearInterval(interval);
    }
  });

  function clearCpu() {
    setRunCpu(false);
    setProcessList([
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
    setProcessQueue([]);
    setTimer(0);
    setProcessRunning([]);
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
