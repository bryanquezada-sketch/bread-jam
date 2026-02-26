import { GameObjects, Scene } from 'phaser';

export class Game extends Scene
{
    constructor ()
    {
        super('Game');
    }

    create ()
    {
        this.add.image(0, 0, 'bg').setAlpha(0.5).setOrigin(0).setDisplaySize(1792, 724);
        this.cameras.main.setBackgroundColor(0x404040);
        this.physics.world.setBounds(0, 0, 1792, 1024);
        this.cameras.main.setBounds(0, 0, 1792, 1024);
        this.cameras.main.setZoom(1.75);
        
        this.player = this.physics.add.sprite(this.physics.world.bounds.centerX, this.physics.world.bounds.centerY + 32, 'player').setDepth(100);

        this.cameras.main.startFollow(this.player, true, 1, 1, 0, 0);

        this.cursors = this.input.keyboard.createCursorKeys();

        this.wasd = this.input.keyboard.addKeys ({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
        });


        const tileSize = 256;

        this.incomeZones = this.add.group();

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
                    this.incomeZones.add(zone);
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

        this.construction = (pointer, gameObject) => {
            if (gameObject.type === 'Zone' ) {
                if (gameObject.getData('isOccupied') === false) {
                    console.log(`${gameObject.getData('id')} is UnOccupied`);
                    this.add.image(gameObject.x, gameObject.y, 'b2').setOrigin(0).setScale(2);
                    gameObject.setData('isOccupied', true)
                } else {
                    console.log('This zone is already occupied.');
                };
            }
        }

        this.cameraZoomActive = false;
        this.debugGraphics = this.add.graphics();


        /// --- END OF CREATE ---
    }

    buildMode () {
        console.log('BUILD MODE: ACTIVE')

        if (this.cameraZoomActive === false) {
            const zoom = Math.max(this.scale.width / 1792, this.scale.height / 1024);
            this.cameras.main.zoomTo(zoom, 1000, 'Expo.easeOut', true);

            this.children.list.forEach(child => {
                if (child.type === 'Zone') {
                    this.debugGraphics.lineStyle(2, 0x00ff00).strokeRectShape(child.getBounds());
                }
            });

            this.cameraZoomActive = true;

            this.input.on('gameobjectdown', this.construction, this);

        }

        // NOTE TO SELF: MAKE THIS APPEAR (CTRL+D or something) WHEN EDIT MODE IS ACTIVATED, 
        // USE debugGraphics.clear() REMOVE PREVIOUS FRAMES DRAWN

        
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

        this.player.setVelocity(x, y)

        if (x !== 0 || y !== 0) {
            this.player.body.velocity.normalize().scale(playerSpeed);

            if (this.cursors.shift.isDown) {
                this.player.body.velocity.normalize().scale(playerSpeed * 1.5);

            }
        }

        const playerIsShopping = this.physics.overlap(this.player, this.shop)

        if (this.cameraZoomActive && !playerIsShopping) {
            this.cameraZoomActive = false;
            this.cameras.main.zoomTo(1, 500, 'Expo.easeIn', true);
            this.debugGraphics.clear()
            this.input.off('gameobjectdown', this.construction, this);
            console.log("Player stopped shopping")
        }

        /*
        if (child.type === 'Zone' && child.getData('income')) {
            console.log("Income ")
        }
        */
        

    }

}

/* NOTES:
    LOOK INTO: `dropZone: true`
*/