class GameUI extends GameObject {
    constructor(id, container) {
        super(id);

        if (container == null) {
            throw new Error("Null container passed to constructor.");
        }

        this.uiData = {
        	description: "",
        	gameClock: new GameClock(),
        	inventory: [],
        };

        this.vue = new Vue({
          el: container,
          components: this.getComponents(),
          data: this.uiData
        });

		engine.eventDispatcher.addListener(GameEvents.OnGameTimeChange, this);
		engine.eventDispatcher.addListener(CustomGameEvents.OnInventoryChange, this);
        engine.eventDispatcher.addListener(GameEvents.OnSceneNodeChange, this);
        engine.eventDispatcher.addListener(GameEvents.UpdateDescription, this);
    }

    getComponents() {
    	let components = {};

    	components['description'] = {
    		props: ['description'],
    		methods: {
    			cleanAndProcessText: GameUtils.cleanAndProcessText,
    		},
		    template: `
		        <div class="game-description" v-html="cleanAndProcessText(description)"></div>
		    `,
		};

		components['game-clock'] = {
			props: ['gameClock'],
			methods: {
				padNumber: webUtils.padNumber,
			},
			template: `
				<div class="game-clock">
	                Day {{ gameClock.day }} - {{ padNumber(gameClock.hour, 2) }}:{{ padNumber(gameClock.minute, 2) }}
	            </div>
			`,
		};

		components['inventory-item'] = {
			props: ['name', 'quantity'],
			template: `
				<li class="inventory-item list-group-item">
                	<span class="name">{{ name }}</span> <span class="quantity">{{ quantity }}</span>
	            </li>
            `,
		}

		return components;
    }

    handleEvent(event) {
        if (event.id == GameEvents.OnSceneNodeChange) {
        	this.uiData.description = event.data.description;
        }
        else if (event.id == GameEvents.UpdateDescription) {
            this.uiData.description = event.data;
        }
        else if (event.id == GameEvents.OnGameTimeChange) {
			this.uiData.gameClock = event.data.current;
		}
		else if (event.id == CustomGameEvents.OnInventoryChange) {
			this.uiData.inventory = event.data.items;
        }
    }
}
