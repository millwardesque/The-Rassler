class Log {
	static logHelper(log_type, id, message, data) {
		if (!(log_type in console)) {
			throw new Error(`[${id}] Unable to write log message: Log type ${log_type} isn't supported. Message: ${message}. Data: ${JSON.stringify(data)}`);
		}

		message = `[${id}]: ${message}`;
		if (data) {
			console[log_type](message, data);
		}
		else {
			console[log_type](message);
		}
	}

	static log(id, message, data) {
		Log.logHelper('log', id, message, data);
	}

	static debug(id, message, data) {
		Log.logHelper('debug', id, message, data);
	}
}