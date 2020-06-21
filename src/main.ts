import * as ex from 'excalibur';
import { loader } from './resources';
import Game from './game';

const engine: ex.Engine = new ex.Engine({
    backgroundColor: ex.Color.Black,
    width: 1366,
    height: 768
});
engine.backgroundColor = ex.Color.Black;
engine.setAntialiasing(false);

const game = new Game(engine);

// Setup game scene
engine.add('game', game);
engine.goToScene('game');

// Game events to handle
engine.on('hidden', () => {
    engine.stop();
});
engine.on('visible', () => {
    engine.start();
});

engine.input.keyboard.on('press', (evt: ex.Input.KeyEvent) => {
    if (evt.key === ex.Input.Keys.Esc) {
        engine.removeScene(game);
        engine.addScene('game', game);
        engine.goToScene('game');
    }
})

engine.start(loader);