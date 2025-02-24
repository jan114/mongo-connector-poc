import process from "node:process";

type ExitCallback = () => Promise<void> | void;
type ExitSignal = "beforeExit" | "exit" | "uncaughtException" | "SIGINT" | "SIGTERM";

function exitHandler(signals: ExitSignal[], callback: ExitCallback): void {
  const exit = async (signal: unknown): Promise<void> => {
    console.log(`Received signal: ${signal}`);
    try {
      const result = callback();
      if (result instanceof Promise) await result;
    } catch (e) {
      console.log(e);
    }
    console.log("Exit handler completed");
    if (signal instanceof Error) {
      console.log("Exiting with error");
      process.exit(1);
    } else {
      process.exit();
    }
  };
  signals.forEach((signal: string): unknown => process.on(signal, exit));
}

export {ExitSignal, ExitCallback};
export default exitHandler;