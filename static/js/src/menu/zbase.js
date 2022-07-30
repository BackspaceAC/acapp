class AcGameMenu{
    constructor(root) {
        this.root = root; // 存下对象
        // 声明并定义一个html对象menu
        this.$menu = $(`
<div class="ac-game-menu">
    <div class="ac-game-menu-field">
        <div class="ac-game-menu-field-item ac-game-menu-field-item-single-mode">
            单人模式
        </div>
        <br>
        <br>
        <br>
        <div class="ac-game-menu-field-item ac-game-menu-field-item-multi-mode">
            多人模式
        </div>
        <br>
        <br>
        <br>
        <div class="ac-game-menu-field-item ac-game-menu-field-item-settings">
            设置
        </div>
    </div>
</div>
        `);
        this.root.$ac_game.append(this.$menu); // 将该html对象menu加入到div体中 在前端的div体里展示出来
        
        this.$single_mode = this.$menu.find('.ac-game-menu-field-item-single-mode');
        this.$multi_mode = this.$menu.find('.ac-game-menu-field-item-multi-mode');
        this.$settings = this.$menu.find('.ac-game-menu-field-item-settings');

        this.start();
    }

    start() {
        this.listening();
    }
    
    listening() {
        let outer = this;
        this.$single_mode.click(function(){
            outer.hide(); // 将当前的对象--菜单界面关闭
            outer.root.playground.show(); // 索引回父类找playground对象 然后调用playground实例的show()函数

        });

        this.$multi_mode.click(function(){
            console.log("222");
        });

        this.$settings.click(function(){
            console.log("333");
        });
    }

    show() { // 显示菜单界面
        this.$menu.show();
    }

    hide() { // 关闭菜单界面
        this.$menu.hide();
    }
}

