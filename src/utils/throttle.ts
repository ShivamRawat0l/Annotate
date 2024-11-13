export const throttle = (fn: () => void, delay: number) => {
  let lastCall = 0;
  return () => {
    const now = new Date().getTime();
    if (now - lastCall < delay) return;
    lastCall = now;
    fn();
  };
};
