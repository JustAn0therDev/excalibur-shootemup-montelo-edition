import * as ex from 'excalibur';
import { gameConfig } from './config';
import Game from './game';
import { loader } from './resources';

const engine: ex.Engine = new ex.Engine({
    backgroundColor: gameConfig.gameBackgroundColor,
    width: gameConfig.gameWidth,
    height: gameConfig.gameHeight,
    displayMode: ex.DisplayMode.FullScreen
});

engine.add('game', new Game(engine));
engine.goToScene('game');

engine.on('visible', () => {
    engine.start();
});

engine.start(loader);