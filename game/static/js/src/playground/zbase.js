class AcGamePlayground {
    constructor(root) {
        this.root = root;
        this.$playground = $(`
<div class="ac-game-playground">

</div>
        `);
        // this.hide(); // 加入之前先隐藏界面

        this.root.$ac_game.append(this.$playground);

        this.width = this.$playground.width();
        this.height = this.$playground.height();
        this.game_map = new GameMap(this);
        this.players = []; // 存所有的玩家
        // 先将自己加入
        this.players.push(new Player(this, this.width / 2, this.height / 2, this.height * 0.05, "white", this.height * 0.15, true));

        for (let i = 0; i < 5; i ++) { // 创建六个人机
            this.players.push(new Player(this, this.width / 2, this.height / 2, this.height * 0.05, this.get_random_color(), this.height * 0.15, false));
        }

        this.start();
    }

    start(){
    }

    get_random_color() {
        let colors = ["blue", "orange", "green", "pink", "grey"];
        return colors[Math.floor(Math.random() * 5)];
    }

    show(){
        this.$playground.show();
    }

    hide(){
        this.$playground.hide();
    }
}
