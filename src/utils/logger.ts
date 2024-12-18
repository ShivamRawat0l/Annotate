class Logger {
	info = (msg: string) => {
		console.log("[Info] ", msg)
	}
	error = (msg: string) => {
		console.error("[Error] ", msg)
	}
	warn = (msg: string) => {
		console.warn("[Warn] ", msg)
	}
}

export const logger = new Logger()
