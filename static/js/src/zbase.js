export class AcGame{
    constructor(id, AcWingOS) { // 只要有第二个参数 一定是在acapp里执行 没有则是在web端执行
        this.id = id;
        // id前加上# 类前加上.
        this.$ac_game = $('#' + id); // 存下网页中的div体作为自己的属性方便后续添加html对象
        this.AcWingOS = AcWingOS; // 确定在哪个端打开的

        this.menu = new AcGameMenu(this); //创建菜单类 菜单类的声明在menu文件夹里
        this.settings = new Settings(this); // 创建settings界面 登陆注册界面
        this.playground = new AcGamePlayground(this); // 创建游戏界面的对象 声明在playground文件夹


        this.start();
    }

    start(){
    }


}
