type AsynchonousTaskEngine<TResult> = {
  untilTime: (dateStamp: Date) => Promise<TResult>;
};

export function performAsynchronousTask<TResult>(
  task: () => TResult
): AsynchonousTaskEngine<TResult> {
  function untilTime(dateStamp: Date) {
    return new Promise((resolve, reject) => {});
  }

  return {
    untilTime
  };
}
