// utilities 
var throttle = function(func, throttle){
   var lastTime = Date.now();
   var throttle = throttle;
   return function(){
      var currentTime = Date.now();
      if(currentTime - lastTime > throttle){
         var val = func.apply(this, Array.prototype.slice.call(arguments,0));
         lastTime = currentTime;
         return val;
      }
   }
}

var fireBullet = function(x, y, velx, vely, color){
   var bullet = new Bullet(x, y, 5, 5, color || Color.Red);
   bullet.dx = velx;
   bullet.dy = vely;
   game.addChild(bullet);
   return bullet;
};

var fireMissile = function(x, y){
   var missile = new Missile(x, y);
   missile.dy = Config.missileSpeed;
   game.addChild(missile);
   return missile;
};

var flipBarrel = false;

var flipFire = throttle(function() {
   var bulletFunction = fireBullet.apply(this, Array.prototype.slice.call(arguments,0));
   flipBarrel = !flipBarrel;
   laserSound.play();
   return bulletFunction;
}, Config.playerFireThrottle);

var getEnemyBulletAnim = function(){
   var anim = gameSheet.getAnimationByIndices(game, [3, 4, 5, 6, 7, 8, 7, 6, 5, 4], 100);
   anim.setScale(2);
   anim.loop = true;   
   return anim;
};

var enemyFire = function(x, y, velx, vely){
   var bullet = new Bullet(x, y, 5, 5);
   bullet.color = Color.White;
   bullet.dx = velx;
   bullet.dy = vely;
   bullet.addDrawing("default", getEnemyBulletAnim());
   bullet.setCenterDrawing(true);
   game.addChild(bullet);
   return bullet;
};