declare global {
  interface Array<T> {
    readonly last: T;
  }
}

Object.defineProperty(Array.prototype, "last", {
  get: function <T>() {
    return this[this.length - 1];
  },
});

export {};
