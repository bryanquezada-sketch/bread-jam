import { GameObjects, Scene } from 'phaser';

export class Game extends Scene
{
    constructor ()
    {
        super('Game');
    }

    create ()
    {
        this.scene.launch('UIScene');
        this.scene.bringToTop('UIScene'); 
        this.add.image(0, 0, 'bg').setAlpha(0.5).setOrigin(0).setDisplaySize(1792, 1500).setOrigin(0, 0.25);
        this.cameras.main.setBackgroundColor(0x404040);
        this.physics.world.setBounds(0, 0, 1792, 1024);
        this.cameras.main.setBounds(0, 0, 1792, 1024);
    //    this.cameras.main.setZoom(1.75);
        
        this.player = this.physics.add.sprite(this.physics.world.bounds.centerX, this.physics.world.bounds.centerY + 32, 'player').setDepth(100);

        this.player.setCollideWorldBounds(true);

        this.doughCount = 10;
        this.breadBaked = 0;

        this.breadAssets = ['b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7', 'b8', 'b9', 'b10', 'b11', 'b12', 'b13', 'b14', 'b15', 'b16', 'b17', 'b18', 'b19'];

        //this.vacuum = new Phaser.Geom.Circle(this.player.x, this.player.y, 64);
        //What's the difference between .world.enable and .add.existing?
        //Why is it easier to use a sprite rather than just use a circle zone?
        //CONSIDER MAKING PLAYER A CIRCLE INSTEAD...IF YOU CAN"T ADD FIRE!
        this.vacuum = this.add.zone(this.player.x, this.player.y, 128, 128);
        this.physics.add.existing(this.vacuum);
        this.vacuum.body.setCircle(64);

        //const vacuumCircle = this.add.graphics({ lineStyle: { width: 2, color: 0x00ff00 } });
        //vacuumCircle.strokeCircleShape(this.vacuum);

        this.cameras.main.startFollow(this.player, true, 1, 1, 0, 0);

        this.cursors = this.input.keyboard.createCursorKeys();

        this.wasd = this.input.keyboard.addKeys ({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
        })

        const tileSize = 256;

        const lot = [
            [1, 1, 2, 1, 1, 1, 1],
            [2, 1, 1, 0, 1, 1, 2],
            [1, 1, 1, 1, 2, 1, 1],
            [1, 2, 1, 1, 1, 1, 2]
        ];

        for (let y = 0; y < lot.length; y++) {
            for (let x = 0; x < lot[y].length; x++) {

                let screenX = x * tileSize;
                let screenY = y * tileSize;

                if (lot[y][x] === 0) {
                    this.add.image(screenX, screenY, 'bakery').setOrigin(0);
                    this.shop = this.add.zone(screenX, screenY, 256, 256).setOrigin(0);
                    this.physics.add.existing(this.shop, true);
                    this.physics.add.overlap(this.player, this.shop, this.buildMode, null, this);
                }

                if(lot[y][x] === 1) {
                    let id = `tile ${x},${y}`;
                    let zone = this.add.zone(screenX, screenY, 256, 256).setInteractive().setOrigin(0).setData({
                        id: id,
                        isOccupied: false,
                        income: 'oneCoin'
                    });
                }

                if(lot[y][x] === 2) {
                    this.add.image(screenX, screenY, 'water').setOrigin(0);
                    let id = `tile ${x},${y}`;
                    let zone = this.add.zone(screenX, screenY, 256, 256).setInteractive().setOrigin(0).setData({
                        id: id,
                        isOccupied: true
                    });
                    this.physics.add.existing(zone, true);
                    this.physics.add.collider(this.player, zone, (obj1, obj2) => {
                    });
                }
            }
        }

        this.incomeGeneration = 0;

        this.cameraZoomActive = false;
        this.debugGraphics = this.add.graphics();

        this.doughs = this.physics.add.group({
            defaultKey: 'dough',
            maxSize: 150
        });
        
        this.breads = this.physics.add.group();

        this.bullets = this.physics.add.group({
            defaultKey: 'fire'
        });

        this.spawnCircleLocatorX = 0;
        this.spawnCircleLocatorY = 0;

        this.physics.add.overlap(this.player, this.doughs, this.collectDough, false, this);

        //Change 20 to test wall hugging bullets distance. Or just fucking make a sprite to show where 20 is you hack. Or learn math you pleb.
        this.bulletSpawn = Phaser.Math.Between(0, this.scale.width - 20);

        /// --- END OF CREATE ---
    }
    buildMode () {
        //console.log('BUILD MODE: ACTIVE')

        if (this.cameraZoomActive === false) {
            const zoom = Math.max(this.scale.width / 1792, this.scale.height / 1024);
            this.cameras.main.zoomTo(zoom, 1000, 'Expo.easeOut', true);

            this.children.list.forEach(child => {
                if (child.type === 'Zone' && child !== this.vacuum) {
                    this.debugGraphics.lineStyle(2, 0x00ff00).strokeRectShape(child.getBounds());
                }
            });

            this.cameraZoomActive = true;

            this.input.on('gameobjectdown', this.construction, this);

        }
    }

    
    construction = (pointer, gameObject) => {

        //CHARGES YOU FOR BREAD, THE FUCKING CAPITALIST PIG 
        /*
        if (gameObject.type === 'Zone' ) {
            if (gameObject.getData('isOccupied') === false) {
                if (this.doughCount >= 10) {
                    this.doughCount -= 10;
                    this.events.emit('addDough', this.doughCount);
                    console.log(`${gameObject.getData('id')} is UnOccupied`);
                    gameObject.setData('isOccupied', true);
                    const bread = this.breads.create(gameObject.x, gameObject.y, Phaser.Math.RND.pick(this.breadAssets)).setOrigin(0);
                    this.spawnCircleLocatorX = gameObject.x;
                    this.spawnCircleLocatorY = gameObject.y;
                    this.createSpawner();
                } else {
                console.log('This zone is already occupied.');
                };
            }
        }
        */

        /**/
        //MAKES SHOP FAKE FOR TESTING, LETS YOU SPAWN BREAD TILES ON CLICK

            if (gameObject.type === 'Zone' ) {
            if (gameObject.getData('isOccupied') === false) {
                console.log(`${gameObject.getData('id')} is UnOccupied`);
                gameObject.setData('isOccupied', true);
                const bread = this.breads.create(gameObject.x, gameObject.y, Phaser.Math.RND.pick(this.breadAssets)).setOrigin(0);
                this.spawnCircleLocatorX = gameObject.x;
                this.spawnCircleLocatorY = gameObject.y;
                this.createSpawner();
                this.breadBaked += 1;
                console.log(this.breadBaked);
                if (this.breadBaked === 21) {
                    console.log('YOU WIN!');
                    this.events.emit('playerWon');
                }
            } else {
                console.log('This zone is already occupied.');
            };
        }
        
    }

    createSpawner() {
        this.spawnCircle = new Phaser.Geom.Circle(this.spawnCircleLocatorX + 128, this.spawnCircleLocatorY + 128, 128);
        const drawCircle = this.add.graphics({ lineStyle: { width: 2, color: 0x00ff00 } });
        drawCircle.strokeCircleShape(this.spawnCircle);

        this.time.addEvent({
            delay: 2000,
            callback: this.spawnDough,
            callbackScope: this,
            loop: true
        })
    }

    spawnDough() {
        const rdm = this.spawnCircle.getRandomPoint();

        const dough = this.doughs.get(rdm.x, rdm.y);


        if (!dough) return;

        dough.body.reset(rdm.x, rdm.y);
        dough.setActive(true);
        dough.setVisible(true);
        dough.setAlpha(1);
        dough.body.enable = true;
    

        //bounce
        this.tweens.add({
            targets: dough,
            y: dough.y -30,
            duration: 250,
            //try cubic
            ease: 'Quad.easeOut',
            yoyo: true,
            //easeYoyo: 'Quad.easeIn',
            onComplete: () => {
                console.log('ADD SOUND FX HERE');
            }
        });

        // flicker
        dough.flickerTimer = this.time.delayedCall(2000, () => {
            dough.flickerTween = this.tweens.add({
                targets: dough,
                alpha: 0.2,
                duration: 100,
                ease: 'Linear',
                yoyo: true,
                repeat: -1
            });

        });

        dough.despawnTimer = this.time.delayedCall(7000, () => {
            this.despawnDough(dough)
        });
        


    }

    despawnDough(dough) {
        if (dough.flickerTimer) {
            dough.flickerTimer.remove();
        }

        if (dough.despawnTimer) {
            dough.despawnTimer.remove();
        }

        this.tweens.killTweensOf(dough);
        this.doughs.killAndHide(dough);
        dough.body.enable = false;
    }

    collectDough(player, dough) {
        this.despawnDough(dough)
        this.doughCount += 1;
        this.events.emit('addDough', this.doughCount);
    }

    update()
    {
        const playerSpeed = 160;

        let x = 0;
        let y = 0


        if (this.cursors.up.isDown || this.wasd.up.isDown ) {
            y -= playerSpeed;
        }
        if (this.cursors.down.isDown || this.wasd.down.isDown ) {
            y += playerSpeed;
        }
        if (this.cursors.left.isDown || this.wasd.left.isDown ) {
            x -= playerSpeed;
        }
        if (this.cursors.right.isDown || this.wasd.right.isDown ) {
            x += playerSpeed;
        }

        this.player.setVelocity(x, y);
        this.vacuum.body.setVelocity(x, y);

        if (x !== 0 || y !== 0) {
            this.player.body.velocity.normalize().scale(playerSpeed);

            this.vacuum.x = this.player.x;
            this.vacuum.y = this.player.y;


            if (this.cursors.shift.isDown) {
                this.player.body.velocity.normalize().scale(playerSpeed * 1.5);
            }
        }


        const playerIsShopping = this.physics.overlap(this.player, this.shop);

        if (this.cameraZoomActive && !playerIsShopping) {
            this.cameraZoomActive = false;
            this.cameras.main.zoomTo(1, 500, 'Expo.easeIn', true);
            this.debugGraphics.clear()
            this.input.off('gameobjectdown', this.construction, this);
            //console.log("Player stopped shopping");
        }
        //console.log('Current Income: ' + this.incomeGeneration);
    }
}

/* NOTES:
    LOOK INTO: `dropZone: true`
    IF YOU HAVE TIME: ADD FIRE SHOOTING RANDOMLY FROM OUTSIDE THE EDGES OF THE SCREEN, INCREASE INTENSITY WITH EACH BUILDING BUILT. HP = 3, 3 HITS AND YOU'RE TOAST!
*/