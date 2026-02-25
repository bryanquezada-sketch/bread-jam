import { Scene } from 'phaser';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        //  We loaded this image in our Boot Scene, so we can display it here
        this.add.image(512, 384, 'background');

        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(512-230, 384, 4, 28, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress) => {

            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + (460 * progress);

        });
    }

    preload ()
    {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath('assets');

        this.load.image('logo', 'logo.png');

        this.load.image('bg', 'breadVoid.jpg');
        this.load.image('bakery', 'bakery.png');
        this.load.image('water', 'water.png');

        this.load.image('player', 'viking-toast.png');

        this.load.image('b1', 'Building-1.png');
        this.load.image('b2', 'Building-2.png');
        this.load.image('b3', 'Building-3.png');
        this.load.image('b4', 'Building-4.png');
        this.load.image('b5', 'Building-5.png');
        this.load.image('b6', 'Building-6.png');
        this.load.image('b7', 'Building-7.png');

        this.load.spritesheet('buildings', 'Building_SpriteSheet.png', {
            frameWidth: 128,
            frameHeight: 128
        });
    }

    create ()
    {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.scene.start('Game');
    }
}
