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

engine.add('game', new Game(engine));
engine.goToScene('game');

engine.on('hidden', () => {
    engine.stop();
});

engine.on('visible', () => {
    engine.start();
});

engine.start(loader);