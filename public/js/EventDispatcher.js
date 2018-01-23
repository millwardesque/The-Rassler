class EventDispatcher {
	constructor() {
		this.queue = new Array();
		this.listeners = {};
	}

	dispatchEvent(event) {
		if (this.listeners.hasOwnProperty(event.id)) {
			console.debug(`[EventDispatcher] Dispatching ${event.id} to ${this.listeners[event.id].length} listeners.`);
			for (let listener of this.listeners[event.id]) {
				if (listener.hasOwnProperty('isEnabled')) {
					if (listener.isEnabled) {
						listener.handleEvent(event);
					}
					else {
						console.debug(`[EventDispatcher] Listener ${listener.id} isn't enabled`);
					}
				}
				else {
					listener.handleEvent(event);
				}
			}
		}
		else {
			console.debug(`Event dispatched without a listener: ${event.id}`);
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

	addListener(eventId, newListener) {
		let listenerId = "<unknown>";
		if ('id' in newListener) {
			listenerId = newListener.id;
		}

		if (typeof (newListener.handleEvent) !== "function") {a
			throw new Error(`Listener ${listenerId} for event ${eventId} has no 'handleEvent' function`);
		}

		if (!this.listeners.hasOwnProperty(eventId)) {
			this.listeners[eventId] = new Array();
			this.listeners[eventId].push(newListener);
		}
		else {
			for (let listener of this.listeners[eventId]) {
				if (listener == newListener) {
					return;
				}
			}

			this.listeners[eventId].push(newListener);
		}
		console.debug(`[EventDispatcher] Added listener ${listenerId} to ${eventId}`);
	}

	removeListener(listener) {
		throw new Error("Stop being lazy and implement this");
	}
}