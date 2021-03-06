class SceneSelector extends GameObject {
    constructor(id) {
        super(id);

        engine.eventDispatcher.addListener(GameEvents.SelectNextScene, this);
        engine.eventDispatcher.addListener(GameEvents.ActivateScene, this);
    }

    handleEvent(event) {
        if (event.id == GameEvents.SelectNextScene) {
            this.selectScene(event.data);
        }
        else if (event.id == GameEvents.ActivateScene) {
            this.activateScene(event.data);
        }
    }

    activateScene(sceneId) {
        let scenes = engine.registry.findValue('scenes');
        for (let scene of scenes) {
            if (scene.id == sceneId) {
                engine.eventDispatcher.dispatchEvent(new GameEvent('Set Scene', scene));
                return;
            }
        }

        throw new Error(`Unable to load scene '${sceneId}': No matching scene exists.`);
    }

    selectScene(availableScenes) {
        let possibleScenes = [];

        if (availableScenes.length == 0) {
            throw new Error("Unable to select a scene. No scenes were provided.");
        }

        // Produce a list of possible scenes to choose from
        for (let scene of availableScenes) {
            if (scene == engine.activeScene) {
                continue;
            }

            // Make sure all prerequisites are present and satisfied.
            let arePrerequisitesSatisified = true;
            for (let prereq of scene.prerequisites) {
                try {
                    let value = engine.registry.findValue(prereq.key);
                    if (value != prereq.value) {
                        arePrerequisitesSatisified = false;
                        break;
                    }
                }
                catch (err) {
                    this.log(err);
                    arePrerequisitesSatisified = false;
                    break;
                }
            }

            if (!arePrerequisitesSatisified) {
                continue;
            }

            possibleScenes.push(scene);
        }

        if (possibleScenes.length > 0) {
            let index = Math.floor(Math.random() * possibleScenes.length);
            engine.eventDispatcher.dispatchEvent(new GameEvent('Set Scene', possibleScenes[index]));
        }
        else {
            throw new Error("Unable to select a scene. No scenes meet all criteria.");
        }
    }
}
