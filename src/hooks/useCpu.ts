import { useEffect, useState } from "react";
import { mergeSort } from "../utils/funcoes";
import { Process } from "../utils/types";

export function useCpu(
  escalonator: string,
  quantum: number,
  sobrecarga: number,
  processList: Process[],
  executeProcess: (processId: number) => void
): [
  processQueue: number[],
  timer: number,
  processRunning: { process: number; sobrecarga: number }[],
  clearCpu: () => void,
  runCpu: boolean,
  setRunCpu: (run: boolean) => void
] {
  const [runCpu, setRunCpu] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(0);
  const [processQueue, setProcessQueue] = useState<number[]>([]);
  const [processRunning, setProcessRunning] = useState<
    { process: number; sobrecarga: number }[]
  >([]);

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

    // Diz qual processo deve rodar agora
    setProcessRunning([
      ...processRunning,
      { process: newQueue[0], sobrecarga: 0 },
    ]);

    // Tira o processo que já executou
    executeProcess(newQueue[0]);
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
    executeProcess(processQueue[0]);
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
      executeProcess(processQueue[0]);
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
          executeProcess(processToRun);
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

            executeProcess(nextProcess);
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
      executeProcess(processQueue[0]);
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
          executeProcess(processToRun);
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

            executeProcess(nextProcess);
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

  function clearCpu() {
    setProcessQueue([]);
    setTimer(0);
    setProcessRunning([]);
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
  return [processQueue, timer, processRunning, clearCpu, runCpu, setRunCpu];
}
