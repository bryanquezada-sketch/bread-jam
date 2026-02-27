import { Scene } from 'phaser';

export class UIScene extends Scene {

    constructor()
    {
        super ({ key: 'UIScene' });
    }
    
    create(){
        this.doughCounter = this.add.text(0, 0, `Yo Dough: 10`, {
            fontSize: '32px',
            fill: '#ffffff' 
        });

        const gameScene = this.scene.get('Game');

        gameScene.events.on('addDough', (score) => {
            this.doughCounter.setText(`Yo Dough: ${score}`);
        }, this);

        this.gameScene = this.scene.get('Game');
        this.gameScene.events.on('playerWon', () => {
            this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 0.5).setOrigin(0);
            this.add.text(this.scale.width/2, this.scale.height/2, `YOU WIN!\nDID YOU KNOW BREAD MAKES YOU FAT?!`, {
                 fontSize: '64px',
                 wordWrap: { width: this.scale.width },
                 align: 'center'
                }).setOrigin(0.5);
        })

    }
}