abstract class UniversalTool {
	abstract render(): void;
}

class Wheel extends UniversalTool {
	private data = [];
	render() {
		console.log("Wheel");
	}
}
