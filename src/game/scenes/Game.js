import { Scene } from 'phaser';

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
        this.cameras.main.setBounds(0, 0, 640, 360 );
        this.cameras.main.startFollow(this.player, true, 1, 1, 0, 0);
        this.physics.world.setBounds(0,0, 640, 360);

//        this.add.image(512, 384, 'background').setAlpha(0.5);

        const tileSize = 128;

        const lot = [
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
        ];

        this.add.zone();

        for (let y = 0; y < lot.length; y++) {
            for (let x = 0; x < lot.length; x++) {

                let screenX = x * tileSize;
                let screenY = y * tileSize;

                if (lot[y][x] === 0) {
                    this.add.zone(screenX, screenY, 128, 128);
                    
                }
            }
        }
        
        const debugGraphics = this.add.graphics();
        this.children.list.forEach(child => {
            if (child.type === 'Zone') {
                debugGraphics.lineStyle(2, 0x00ff00).strokeRectShape(child.getBounds());
            }
        });

        /// --- END OF CREATE ---
    }

    update()
    {

    }

}
