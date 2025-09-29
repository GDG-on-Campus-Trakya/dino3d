// THREE.js is loaded from CDN in HTML, no need to import

async function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

async function initGame() {
    try {
        // First load the config file
        await loadScript('/js/config-low.js');

        // Load all modules in the correct order
        await loadScript('/js/src/log_manager.js');

        // Initialize logs
        window.logs = new LogManager();
        if(typeof config !== 'undefined' && config.logs) {
            logs.enable();
        }

        await loadScript('/js/src/input_manager.js');
        await loadScript('/js/src/audio_manager.js');
        await loadScript('/js/src/enemy_manager.js');
        await loadScript('/js/src/score_manager.js');
        await loadScript('/js/src/init.js');
        await loadScript('/js/src/camera_controls.js');
        await loadScript('/js/src/camera.js');
        await loadScript('/js/src/light.js');
        await loadScript('/js/src/particles.js');
        await loadScript('/js/src/player_manager.js');

        // Initialize player
        window.player = new PlayerManager();

        await loadScript('/js/src/nature_manager.js');

        // Initialize nature
        window.nature = new NatureManager();

        await loadScript('/js/src/load_manager.js');

        // Initialize load manager
        window.load_manager = new LoadManager(); // start loading assets ASAP

        // Load geometry files
        await loadScript('/js/src/geometry/ground.js');
        await loadScript('/js/src/geometry/ground_bg.js');
        await loadScript('/js/src/geometry/dyno.js');
        await loadScript('/js/src/geometry/dyno_band.js');
        await loadScript('/js/src/geometry/dyno_wow.js');
        await loadScript('/js/src/geometry/cactus.js');
        await loadScript('/js/src/geometry/ptero.js');
        await loadScript('/js/src/geometry/rocks.js');
        await loadScript('/js/src/geometry/flowers.js');
        await loadScript('/js/src/geometry/misc.js');

        // Load texture files
        await loadScript('/js/src/textures/ground.js');

        await loadScript('/js/src/assets.js');
        await loadScript('/js/src/_loop.js');
        await loadScript('/js/src/effects_manager.js');

        // Initialize effects
        window.effects = new EffectsManager();

        await loadScript('/js/src/game_manager.js');
        await loadScript('/js/src/interface_manager.js');

        // Initialize game
        window.game = new GameManager(new InterfaceManager());
        game.init(); // init game & interface ASAP

    } catch (error) {
        console.error('Failed to load game scripts:', error);
    }
}

// Start loading the game
initGame();