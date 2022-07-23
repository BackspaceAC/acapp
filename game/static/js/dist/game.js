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
class AcGame{
    constructor(id) {
        this.id = id;
        // id前加上# 类前加上.
        this.$ac_game = $('#' + id); // 存下网页中的div体作为自己的属性方便后续添加html对象
        this.menu = new AcGameMenu(this); //创建菜单类 菜单类的声明在menu文件夹里
        this.playground = new AcGamePlayground(this); // 创建游戏界面的对象 声明在playground文件夹


        this.start();
    }

    start(){
    }


}
