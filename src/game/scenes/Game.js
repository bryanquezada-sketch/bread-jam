import { GameObjects, Scene } from 'phaser';

export class Game extends Scene
{
    constructor ()
    {
        super('Game');
    }

    create ()
    {
        this.player = this.physics.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY, 'player').setOrigin(0.5);
        this.cameras.main.setBackgroundColor(0x404040);
        this.cameras.main.setBounds(0, 0, 640, 640 );
        this.cameras.main.setZoom(2, 2);
        this.cameras.main.startFollow(this.player, true, 1, 1, 0, 0);
        this.physics.world.setBounds(0,0, 640, 640);

        this.cursors = this.input.keyboard.createCursorKeys();

        this.wasd = this.input.keyboard.addKeys ({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
        });


//        this.add.image(512, 384, 'background').setAlpha(0.5);

        const tileSize = 128;

        const lot = [
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
        ];

        for (let y = 0; y < lot.length; y++) {
            for (let x = 0; x < lot.length; x++) {

                let screenX = x * tileSize;
                let screenY = y * tileSize;

                if (lot[y][x] === 0) {
                    this.add.zone(screenX, screenY, 128, 128).setInteractive().setData({
                        id: `${x}_${y}`,
                        isOccupied: false
                    });
                }
            }
        }

        // NOTE TO SELF: MAKE THIS APPEAR (CTRL+D or something) WHEN EDIT MODE IS ACTIVATED, 
        // USE debugGraphics.clear() REMOVE PREVIOUS FRAMES DRAWN

        const debugGraphics = this.add.graphics();

        this.children.list.forEach(child => {
            if (child.type === 'Zone') {
                debugGraphics.lineStyle(2, 0x00ff00).strokeRectShape(child.getBounds());
            }
        });

        this.input.on('gameobjectdown', (pointer, gameObject) => {
            if (gameObject.type === 'Zone' ) {
                if (gameObject.getData('isOccupied') === false) {
                    console.log(`${gameObject.getData('id')} is UnOccupied`);
                    this.add.image(gameObject.x, gameObject.y, 'b1');
                    gameObject.setData('isOccupied', true)
                } else {
                    console.log('This zone is already occupied.');
                };
            }
        });

        /// --- END OF CREATE ---
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

        if (x !== 0 || y !== 0) {
            this.player.body.velocity.normalize().scale(playerSpeed);
        }

        

    }

}

/* NOTES:
    LOOK INTO: `dropZone: true`
} else {
            console.log('This zone is already occupied.');
        }
});
*/