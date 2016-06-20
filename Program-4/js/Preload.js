var SpaceHipster = SpaceHipster || {};

//loading the game assets
SpaceHipster.Preload = function(){};

SpaceHipster.Preload.prototype = {
  preload: function() {
  	//show loading screen
  	this.splash = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
    this.splash.anchor.setTo(0.5);

    this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY + 128, 'preloadbar');
    this.preloadBar.anchor.setTo(0.5);

    this.load.setPreloadSprite(this.preloadBar);

  	//load game assets
  	this.load.image('space', 'assets/images/space.png');
  	this.load.image('rock', 'assets/images/rock.png');
    this.load.image('playership', 'assets/images/space_ship1.png');
    this.load.spritesheet('power', 'assets/images/power.png', 12, 12);
  	this.load.image('playerParticle', 'assets/images/player-particle.png');
    this.load.audio('collect', 'assets/audio/collect.ogg');
    this.load.audio('explosion', 'assets/audio/explosion.ogg');
	  this.load.audio('asteriodexplosion', 'assets/audio/asteriod_explosion.ogg');
	  this.load.audio('fire', 'assets/audio/fire.ogg');
	  this.load.image('bullet', 'assets/images/bullet.png')
    this.load.image('easy', 'assets/images/easy.png');
    this.load.image('medium', 'assets/images/medium.png');
    this.load.image('hard', 'assets/images/hard.png');
  },
  create: function() {
  	this.state.start('MainMenu');
  }
};