class AcGamePlayground {
    constructor(root) {
        this.root = root;
        this.$playground = $(`
<div>
    游戏界面
</div>
        `);
        this.hide(); // 加入之前先隐藏界面

        this.root.$ac_game.append(this.$playground);
        this.start();
    }

    start(){
    }

    show(){
        this.$playground.show();
    }

    hide(){
        this.$playground.hide();
    }
}
