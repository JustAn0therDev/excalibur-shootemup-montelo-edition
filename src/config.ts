import * as ex from 'excalibur';

export const gameConfig = {
   gameBackgroundColor: ex.Color.Azure,
   gameWidth: window.screen.width,
   gameHeight: window.screen.height,
   scoreLabelColor: ex.Color.Black
}

export default {
   playerBulletVelocity: -375,
   playerSpeed: 700,
   playerFireThrottle: 100,
   missileSpeed: -400,
   enemyBulletVelocity: 400,
   enemySpeed: 300,
   enemyFireIntervalInMilisseconds: 700,
   bossFireIntervalInMilisseconds: 200,
   enemyDamage: 1,
   bulletSize: 5,
   spawnTimeInMilisseconds: 2000,
   totalHp: 1, 
   baddieHp: 3,
   bossHp: 15,
   scoreGainedFromKillingBaddie: 100,
   scoreGainedFromKillingBoss: 500,
   chancesOfGeneratingBoss: 10,
   limitOfEnemiesOnScreen: 3,
   intervalToMakeTimerRepeatForever: -1
}
