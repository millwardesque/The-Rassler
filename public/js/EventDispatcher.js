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

        if (typeof (newListener.handleEvent) !== "function") {
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
        let listenerId = "<unknown>";
        if ('id' in listener) {
            listenerId = listener.id;
        }

        let newListeners = null;
        for (let eventId in this.listeners) {
            if (this.listeners[eventId].length == 0) {
                continue;
            }

            // @TODO Optimize if possible by checking to see if this element is in the array?
            newListeners = this.listeners[eventId].filter(el => el != listener);
            if (newListeners.length != this.listeners[eventId].length) {
                console.debug(`Removed listener ${listenerId} from event ${eventId}`);
            }
            this.listeners[eventId] = newListeners;
        }
    }
}