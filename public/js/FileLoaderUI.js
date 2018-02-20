class FileLoaderUI extends GameObject {
	constructor(id, container) {
		super(id);

		if (container == null) {
			throw new Error("Null container passed to constructor.");
		}

		this.container = container;
		engine.eventDispatcher.addListener(GameEvents.LoadFile, this);
		engine.eventDispatcher.addListener(GameEvents.OnFileLoaded, this);

		let form = container.querySelector('form');
		form.addEventListener('click', function(clickEvent) {
			clickEvent.preventDefault();

			let filename = form.querySelector('#file-url').value;
			engine.eventDispatcher.dispatchEvent(new GameEvent('Load File', filename));			
		});
	}

	handleEvent(event) {
		let self = this;
		if (event.id == GameEvents.LoadFile) {
			return new Promise(async function (resolve, reject) {
				try {
					let name = event.data;
					let content = await Storage.getStorageEngine().getItem(name);
					
					engine.eventDispatcher.dispatchEvent(new GameEvent(GameEvents.OnFileLoaded, { name, content }))

					resolve();
				}
				catch(err) {
					reject(err);
				}
			});
		}
		else if (event.id == GameEvents.OnFileLoaded) {
			return new Promise(async function (resolve, reject) {
				await (new LocalStorage()).setItem(event.data.name, event.data.content);
			});
		}
	}
}
