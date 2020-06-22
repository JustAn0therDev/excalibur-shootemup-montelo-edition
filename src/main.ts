import * as ex from 'excalibur';
import Game from './game';
import { loader } from './resources';

const engine: ex.Engine = new ex.Engine({
    backgroundColor: ex.Color.Black,
    width: 1366,
    height: 768
});
engine.backgroundColor = ex.Color.Black;
engine.setAntialiasing(false);

const game = new Game(engine);

engine.add('game', game);
engine.goToScene('game');

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