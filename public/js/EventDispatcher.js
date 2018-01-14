class EventDispatcher {
	constructor() {
		this.queue = new Array();
		this.listeners = {};
	}

	dispatchEvent(event) {
		if (this.listeners.hasOwnProperty(event.name)) {
			console.log(event.name, this.listeners[event.name].length);
			for (let listener of this.listeners[event.name]) {
				listener.handleEvent(event);
			}
		}
		else {
			console.debug(`Event dispatched without a listener: ${event.name}`);
		}
	}

	enqueue(event) {
		this.queue.append(event);
	}

	dequeue(event) {
		return this.shift();
	}

	dispatchEvents() {
		while(this.queue.length > 0) {
			let event = this.dequeue();
			dispatchEvent(event);
		}
	}

	addListener(eventName, newListener) {
		if (typeof (newListener.handleEvent) !== "function") {
			throw new Error(`Listener for event ${eventName} has no 'handleEvent' function`);
		}

		if (!this.listeners.hasOwnProperty(eventName)) {
			this.listeners[eventName] = new Array();
			this.listeners[eventName].push(newListener);
		}
		else {
			for (let listener of this.listeners[eventName]) {
				if (listener == newListener) {
					return;
				}
			}

			this.listeners[eventName].push(newListener);
		}
	}

	removeListener(listener) {
		throw new Error("Stop being lazy and implement this");
	}
}