var playState = {

    create: function() { 
        //Change the background color of the game
        game.stage.backgroundColor = '#3498db';
        //Tell phaser we are going to use arcade physics for this game
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.renderer.renderSession.roundPixels = true;
		//boolean variable to set the play start and stop
		this.play = true;
		//Enabbling keyboard events
        this.cursor = game.input.keyboard.createCursorKeys();
		this.restartKey = this.game.input.keyboard.addKey(Phaser.Keyboard.R)
        //Create a local variable with 'var player'
        this.player = game.add.sprite(game.width/2, game.height/2, 'player');
        //set the anchor point to the  player
        this.player.anchor.setTo(0.5, 0.5);
        game.physics.arcade.enable(this.player);
        this.player.body.gravity.y = 500;
        

        this.createWorld();
        //// Add the coin
        this.coin = game.add.sprite(60, 150, 'coin');
        //Add Arcade physics to the coin
        game.physics.arcade.enable(this.coin); 
        this.coin.anchor.setTo(0.5, 0.5);
        //// Display the score
        this.scoreLabel = game.add.text(30, 30, 'score: 0', { font: '18px Arial', fill: '#ffffff' });
        this.score = 0;
		//Display death lable
		this.deathLabel = game.add.text(350, 300, 'Death: 0', { font: '18px Arial', fill: '#ff0000' });
        this.Death = 0;
		//start the timer of the game
		this.startTime = game.time.now;
        //add the lable to the game
		this.timeLabel = game.add.text(350, 30, 'Time: 120', { font: '18px Arial', fill: '#ffffff' });
		this.Time;
		//addd the group of enemies
        this.enemies = game.add.group();
        this.enemies.enableBody = true;
        this.enemies.createMultiple(10, 'enemy');
        game.time.events.loop(2200, this.addEnemy, this);
        this.jumpSound = game.add.audio('jump');
        this.coinSound = game.add.audio('coin');
        this.deadSound = game.add.audio('dead');
        this.music = game.add.audio('music'); // Add the music
        this.music.loop = true; // Make it loop
        this.music.play(); // Start the music

        // And don't forget to stop the music in the 'playerDie' function
        // Otherwise the music would keep playing
        this.music.stop();
    },


    update: function() {
		//update function for the cursor keys and to start and stop the game
		if ( this.play == true ) {
			game.physics.arcade.collide(this.player, this.walls);
        	game.physics.arcade.collide(this.enemies, this.walls);
            //call the player die and take coin functions when the player,coin,enemies  overlaps
        	game.physics.arcade.overlap(this.player, this.coin, this.takeCoin, null, this);
        	game.physics.arcade.overlap(this.player, this.enemies, this.playerDie, null, this);

        	this.movePlayer(); 
			this.startTimer();
			this.restart();
            //when the player falls in the holes just spawn the player at random position
        	if (!this.player.inWorld) {
            	this.playerPositions();
        	}	
		} else {
			if( this.restartKey.isDown ){
                //to restart the game
                //game.state.start('main');
                this.restart();
            }
				
		}
        
    },
	
	restart: function(e) {
		if( this.e == 'r' )	{
			this.play = true;
			this.game.start('main');
		}
			
	},
        
    movePlayer: function() {
        if (this.cursor.left.isDown) {
            this.player.body.velocity.x = -200;
        }
        else if (this.cursor.right.isDown) {
            this.player.body.velocity.x = 200;
        }
        else {
            this.player.body.velocity.x = 0;
        }

        if (this.cursor.up.isDown && this.player.body.touching.down) {
            this.player.body.velocity.y = -320;
        }      
    },

    takeCoin: function(player, coin) {
        game.global.score += 5;
        this.scoreLabel.text = 'score: ' + game.global.score;

        this.updateCoinPosition();
    },

    updateCoinPosition: function() {
        var coinPosition = [
            {x: 140, y: 60}, {x: 360, y: 60}, 
            {x: 60, y: 140}, {x: 440, y: 140}, 
            {x: 130, y: 300}, {x: 370, y: 300} 
        ];

        for (var i = 0; i < coinPosition.length; i++) {
            if (coinPosition[i].x == this.coin.x) {
                coinPosition.splice(i, 1);
            }
        }

        var newPosition = game.rnd.pick(coinPosition);
        this.coin.reset(newPosition.x, newPosition.y);
    },
        
        	playerPositions: function() {
        //adding some random player postions to respawn them when player dies
		var pos =[  {x: 140, y: 90}, {x: 140, y: 270}, {x: 250, y: 90}, {x: 360, y: 90}, {x: 60, y: 180}, {x: 370, y: 300}, {x: 440, y: 180}, 
			 {x: 250, y: 270}, {x: 360, y: 270}, {x: 60, y: 140}, {x: 40, y: 360}, {x: 320, y: 360}, {x: 180, y: 360}, {x: 450, y: 360} ,
			{x: 140, y: 60}, {x: 360, y: 60}, {x: 440, y: 140}, {x: 130, y: 300} ];
		
		var playerpos = game.rnd.pick(pos);
		this.player.reset( playerpos.x, playerpos.y );
	
	},
        
        	startTimer: function() {
        //adding the timer to the game and starting it for 120 seconds
		var t = game.time.now;
		this.run = (Math.floor((t - this.startTime) / 1000) % 121) + 1;
		this.Time = 120 - this.run;
		this.timeLabel.text = 'Time: ' + this.Time;
		if( this.Time == 0 ) {
			game.add.text(220, 130, 'Game Over', { font: '18px Arial', fill: '#ff0000' } );
			game.add.text(180, 160, 'Press R restart the Game', { font: '18px Arial', fill: '#ff0000' } );
			console.log('Game Over');
			this.play = false;
		}	
	},

    addEnemy: function() {
        var enemy = this.enemies.getFirstDead();

        if (!enemy) {
            return;
        }

        enemy.anchor.setTo(0.5, 1);
        enemy.reset(game.width/2, 0);
        enemy.body.gravity.y = 500;
        enemy.body.velocity.x = 100 * game.rnd.pick([-1, 1]);
        enemy.body.bounce.x = 1;
        enemy.checkWorldBounds = true;
        enemy.outOfBoundsKill = true;
    },

    createWorld: function() {
        this.walls = game.add.group();
        this.walls.enableBody = true;

        game.add.sprite(0, 0, 'wallV', 0, this.walls); 
        game.add.sprite(480, 0, 'wallV', 0, this.walls); 
        game.add.sprite(0, 0, 'wallH', 0, this.walls); 
        game.add.sprite(300, 0, 'wallH', 0, this.walls);
        game.add.sprite(0, 320, 'wallH', 0, this.walls); 
        game.add.sprite(300, 320, 'wallH', 0, this.walls); 
        game.add.sprite(-100, 160, 'wallH', 0, this.walls); 
        game.add.sprite(400, 160, 'wallH', 0, this.walls); 
        var middleTop = game.add.sprite(100, 80, 'wallH', 0, this.walls);
        middleTop.scale.setTo(1.5, 1);
        var middleBottom = game.add.sprite(100, 240, 'wallH', 0, this.walls);
        middleBottom.scale.setTo(1.5, 1);

        this.walls.setAll('body.immovable', true);
    },

    playerDie: function() {
        console.info('Player Die');
		this.playerPositions();
		this.Death += 1;
		this.deathLabel.text = 'Death: ' + this.Death;
        //game.state.start('menu');
        // Add this inside the 'movePlayer' function, in the 'if(player jumps)'
        this.jumpSound.play();
        // Put this in the 'takeCoin' function
        this.coinSound.play();
        // And this in the 'playerDie' function
        this.deadSound.play();
    },
};
