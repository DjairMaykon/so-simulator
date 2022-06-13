import { useEffect, useState } from "react";
import { mergeSort } from "../utils/funcoes";
import { Process } from "../utils/types";

export function useCpu(
  // escalonador: EscalonadorProcessos,
  escalonator: string,
  quantumSitema: number,
  sobrecargaSistema: number
): [
  processQueue: number[],
  timer: number,
  processRunning: { process: number; sobrecarga: number; time: number }[],
  processList: Process[],
  clearCpu: () => void,
  runCpu: boolean,
  setRunCpu: (run: boolean) => void,
  editaProcesso: (processId: number, objectValue: any) => void,
  adicionaProcesso: () => void
] {
  const [runCpu, setRunCpu] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(0);
  const [processList, setProcessList] = useState<Process[]>([]);
  let [processQueue, setProcessQueue] = useState<number[]>([]);
  const [processRunning, setProcessRunning] = useState<
    { process: number; sobrecarga: number; time: number }[]
  >([]);

  function adicionaProcesso() {
    setProcessList([
      ...processList,
      {
        id: processList.length,
        entryTime: 0,
        deadline: 0,
        executionTime: 0,
        executedTimes: 0,
        priority: 0,
      },
    ]);
  }
  function editaProcesso(processId: number, objectValue: any) {
    setProcessList(
      processList.map((p) =>
        p.id == processId ? Object.assign(p, objectValue) : p
      )
    );
  }

  function executaProcessoAtualDaLista(sobrecarga: number = 0) {
    // const sobrecarga = isSobrecarga ? processRunning[processRunning.length - 1].sobrecarga + 1 : 0
    // Diz qual processo deve rodar agora
    setProcessRunning([
      ...processRunning,
      { process: processQueue[0], sobrecarga, time: timer },
    ]);

    if (sobrecarga == 0) {
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
  }

  function fifo() {
    executaProcessoAtualDaLista();
  }
  function sjf() {
    //Ordena a fila pelo tempo tempo de execução que falta para o processo
    processQueue =
      (mergeSort(processQueue, (a, b) => {
        return (
          (processList.find((p) => p.id == a)?.executionTime ?? 0) -
          (processList.find((p) => p.id == a)?.executedTimes ?? 0) -
          ((processList.find((p) => p.id == b)?.executionTime ?? 0) -
            (processList.find((p) => p.id == b)?.executedTimes ?? 0))
        );
      }) as number[]) ?? processQueue;
    setProcessQueue(processQueue);
    executaProcessoAtualDaLista();
  }
  function rr() {
    //ver qual processo que executou, caso o anterior
    if (processRunning.length >= quantumSitema) {
      if (processRunning[processRunning.length - 1].sobrecarga > 0) {
        if (
          processRunning[processRunning.length - 1].sobrecarga <
          sobrecargaSistema
        ) {
          executaProcessoAtualDaLista(
            processRunning[processRunning.length - 1].sobrecarga + 1
          );
        } else {
          processQueue = [...processQueue.slice(1), processQueue[0]];
          setProcessQueue(processQueue);
          executaProcessoAtualDaLista();
        }
      } else if (
        processRunning
          .slice(-1 * quantumSitema)
          .every((p) => p.process == processQueue[0])
      ) {
        executaProcessoAtualDaLista(1);
      } else {
        executaProcessoAtualDaLista();
      }
    } else {
      executaProcessoAtualDaLista();
    }
  }
  function edf() {
    //ver qual processo que executou, caso o anterior
    if (processRunning.length >= quantumSitema) {
      if (processRunning[processRunning.length - 1].sobrecarga > 0) {
        if (
          processRunning[processRunning.length - 1].sobrecarga <
          sobrecargaSistema
        ) {
          executaProcessoAtualDaLista(
            processRunning[processRunning.length - 1].sobrecarga + 1
          );
        } else {
          const newQueue =
            (mergeSort(processQueue, (a, b) => {
              return (
                (processList.find((p) => p.id == a)?.entryTime ?? 0) +
                (processList.find((p) => p.id == a)?.deadline ?? 0) -
                ((processList.find((p) => p.id == b)?.entryTime ?? 0) +
                  (processList.find((p) => p.id == b)?.deadline ?? 0))
              );
            }) as number[]) ?? processQueue;
          processQueue = newQueue;
          setProcessQueue(processQueue);
          executaProcessoAtualDaLista();
        }
      } else if (
        processRunning
          .slice(-1 * quantumSitema)
          .every((p) => p.process == processQueue[0])
      ) {
        executaProcessoAtualDaLista(1);
      } else {
        executaProcessoAtualDaLista();
      }
    } else {
      executaProcessoAtualDaLista();
    }
  }

  function escalonar() {
    if (processQueue.length == 0) return;

    if (escalonator == "fifo") fifo();
    if (escalonator == "sjf") sjf();
    if (escalonator == "rr") rr();
    if (escalonator == "edf") edf();
  }

  function clearCpu() {
    setRunCpu(false);
    setProcessQueue([]);
    setTimer(0);
    setProcessRunning([]);
    setProcessList(
      processList.map((p) => Object.assign(p, { executedTimes: 0 }))
    );
  }

  useEffect(() => {
    if (runCpu) {
      let interval = setInterval(async () => {
        // Adiciono na fila o processo
        const timerAtual = timer;
        const result = processList
          .filter((p) => {
            return p.entryTime == timerAtual;
          })
          .map((p) => p.id);
        processQueue.push(...result);
        setProcessQueue(processQueue);

        // chamo o escalonador
        escalonar();

        setTimer(timerAtual + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  });
  return [
    processQueue,
    timer,
    processRunning,
    processList,
    clearCpu,
    runCpu,
    setRunCpu,
    editaProcesso,
    adicionaProcesso,
  ];
}
