export class AcGame{
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
