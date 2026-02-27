import { Scene } from 'phaser';

export class UIScene extends Scene {

    constructor()
    {
        super ({ key: 'UIScene' });
    }
    
    create(){
        this.doughCounter = this.add.text(0, 0, `Dough Bucket: 0`, {
            fontSize: '48px',
            fill: '#ffffff' 
        });

        const gameScene = this.scene.get('Game');

        gameScene.events.on('addDough', (score) => {
            this.doughCounter.setText(`Dough Bucket: ${score}`);
        }, this);

    }
}