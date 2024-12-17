declare global {
	interface Array<T> {
		readonly last: T;
	}
}

// LEARN: This is how to add the property to the
Object.defineProperty(Array.prototype, "last", {
	get: function <T>() {
		return this[this.length - 1];
	},
});

export { };
