import * as ex from "excalibur";

const fighterFile = require('../res/fighter.png');
const enemyFile = require('../res/enemy.png');
const spriteexplosionFile = require('../res/spriteexplosion.png');
const gameSheetFile = require('../res/gameSheet.png');

const Images: { [key: string]: ex.Texture } = {
    fighter: new ex.Texture(fighterFile),
    enemyPink: new ex.Texture(enemyFile),
    explosion: new ex.Texture(spriteexplosionFile),
    sheet: new ex.Texture(gameSheetFile),
};

const explosionSpriteSheet = new ex.SpriteSheet(Images.explosion, 5, 5, 45, 45);
const gameSheet = new ex.SpriteSheet(Images.sheet, 10.0, 10.0, 32.0, 32.0);
const loader = new ex.Loader();

const allResources = {...Images};
for (const resource in allResources) {
    loader.addResource(allResources[resource]);
}

export { Images, loader, explosionSpriteSheet, gameSheet };