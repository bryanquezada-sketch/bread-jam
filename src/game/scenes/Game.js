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
    }
}
