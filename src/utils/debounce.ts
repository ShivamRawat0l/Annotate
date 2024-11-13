export const debounce = (fn: () => void, delay: number) => {
  let timeout: NodeJS.Timeout | Timer;
  return () => {
    clearTimeout(timeout);
    timeout = setTimeout(fn, delay);
  };
};
