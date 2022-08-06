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
            退出
        </div>
    </div>
</div>
        `);

        this.$menu.hide(); // 先关闭来判断用户是否登录
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
            outer.root.settings.logout_on_remote(); // 调用退出函数
        });
    }

    show() { // 显示菜单界面
        this.$menu.show();
    }

    hide() { // 关闭菜单界面
        this.$menu.hide();
    }
}

let AC_GAME_OBJECTS = [];


class AcGameObject {
    constructor() {
        AC_GAME_OBJECTS.push(this);

        this.has_called_start = false; // 特判是否执行过start()
        this.timedelta = 0; // 当前帧距离上一帧的时间间隔 统一用时间间隔衡量移动 用帧数会不统一
    }

    start() { // 只会在第一帧执行
    }

    update() { // 每一帧都会执行
    }

    on_destroy() { // 在被销毁前执行一次
    }

    destroy() { // 删掉该物体
        this.on_destroy();

        for (let i = 0; i < AC_GAME_OBJECTS.length; i ++){
            if (AC_GAME_OBJECTS[i] === this) {
                AC_GAME_OBJECTS.splice(i, 1); // 从i开始删一个
                break;
            }
        }
    }
}


let last_timestamp;
// 保证连续每一帧都执行
let AC_GAME_ANIMATION = function(timestamp) {
    for (let i = 0; i < AC_GAME_OBJECTS.length; i ++) {
        let obj = AC_GAME_OBJECTS[i];
        if(!obj.has_called_start) { // 没初始化过
            obj.start();
            obj.has_called_start = true;
        }
        else{
            obj.timedelta = timestamp - last_timestamp;
            obj.update();
        }
    }

    last_timestamp = timestamp; // 更新时间戳

    requestAnimationFrame(AC_GAME_ANIMATION);
}

requestAnimationFrame(AC_GAME_ANIMATION); // 下一帧调用一次函数 并传好时间戳
class GameMap extends AcGameObject {
    constructor(playground) {
        super(); // 调用基类的构造函数
        this.playground = playground; // this.playground就是AcGamePlayground中创建的对象
        // 用画布操作
        this.$canvas = $(`<canvas></canvas>`);
        this.ctx = this.$canvas[0].getContext('2d');

        this.ctx.canvas.width = this.playground.width; // 宽度在基类定义的
        this.ctx.canvas.height = this.playground.height;

        // 将html对象canvas加入页面中
        this.playground.$playground.append(this.$canvas);
    }

    start(){
    }

    update() { // 只在update渲染
        this.render();
    }

    render() { // 渲染出地图
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.2)"; // 设置颜色白色和透明度20%形成渐变的过程
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height); // 设置为矩形
    }
}
// 实现粒子效果
class Particle extends AcGameObject {
    constructor(playground, x, y, radius, vx, vy, color, speed, move_length) {
        super();
        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.vx = vx;
        this.vy = vy;
        this.speed = speed;
        this.move_length = move_length;
        this.friction = 0.9;
        this.eps = 1;
    }

    start() {
    }

    update() {
        if (this.speed < this.eps || this.move_length < this.eps) {
            this.destroy();
            return false;
        }
        let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
        this.x += this.vx * moved;
        this.y += this.vy * moved;
        this.speed *= this.friction;
        this.move_length -= moved;
        this.render();
    }

    render() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }
}
class Player extends AcGameObject { // 一样要从AcGameObject扩展出来
    constructor(playground, x, y, radius, color, speed, is_me) { //传入各种player属性 每秒钟移动百分之几
        super(); // 调用基类 将player对象加入全局数组 每秒钟更新60次

        this.playground = playground;

        this.x = x;
        this.y = y;

        // 移动的x y方向
        this.vx = 0;
        this.vy = 0;

        // 定义收到伤害时的移动方向
        this.damage_x = 0;
        this.damage_y = 0;
        this.damage_speed = 0;

        this.move_length = 0; // 还需要移动多少距离
        this.ctx = this.playground.game_map.ctx; // 存下playground中的画布
        this.radius = radius;
        this.color = color;
        this.speed = speed; // 每秒钟移动speed的长度
        this.is_me = is_me;
        this.eps = 0.1; // 误差小于0.1都算0

        this.friction = 0.9; // 被击中后的摩擦力

        this.cur_skill = null; // 当前的技能是什么

        if (this.is_me) { // 渲染自己的头像
            this.img = new Image();
            this.img.src = this.playground.root.settings.photo;
        }

        this.start();
    }

    start() {
        if(this.is_me){
            this.listening();
        }
        else { // 人机随机移动AI
            let tx = Math.random() * this.playground.width;
            let ty = Math.random() * this.playground.height;
            this.move_to(tx, ty);
        }
    }

    listening() { // 监听函数 通过鼠标操作自己
        let outer = this; // 下面要用到function套function 所以先存下当前对象
        this.playground.game_map.$canvas.on("contextmenu", function() { // 将点击右键原有的效果去掉
            return false;
        });
        this.playground.game_map.$canvas.mousedown(function(e) {
            const rect = outer.ctx.canvas.getBoundingClientRect();
            if (e.which === 3) { // 3表示右键
                // 函数内的函数写this写的就是函数本身了 想要调用的是外部的对象的函数
                outer.move_to(e.clientX - rect.left, e.clientY - rect.top); // 要将画布坐标映射到全局坐标
            }
            else if (e.which === 1) { // 1表示左键
                if (outer.cur_skill == "fireball") {
                    outer.shoot_fireball(e.clientX - rect.left, e.clientY - rect.top); // clientXY是整个屏幕的绝对坐标
                }

                outer.cur_skill = null; // 执行完技能后清空
            }
        });

        // 用window获取键盘的事件
        $(window).keydown(function(e) { // 按键查询技巧: keycode
            if (e.which === 81) { // 按下Q键
                outer.cur_skill = "fireball";
                return false;
            }
        });
    }

    shoot_fireball(tx, ty) { // 发射火球
        let x = this.x, y = this.y; // 火球圆心和角色圆心重合
        let radius = this.playground.height * 0.01; // 火球半径为高度的0.01
        let angle = Math.atan2(ty - this.y, tx - this.x);
        let vx = Math.cos(angle), vy = Math.sin(angle);
        let color = "red";
        let speed = this.playground.height * 0.5; // 火球每秒钟移动的距离
        let move_length = this.playground.height * 0.5; // 射程是高度0.5
        new FireBall(this.playground, this, x, y, radius, vx, vy, color, speed, move_length, this.playground.height * 0.01);
    }

    get_dist(x1, y1, x2, y2) {
        let dx = x1 - x2;
        let dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }

    move_to(tx, ty) { // 鼠标点击得到目标坐标 进而得出方向 具体移动还得看速度
        this.move_length = this.get_dist(this.x, this.y, tx, ty); //随着移动move_length会跟着减少
        let angle = Math.atan2(ty - this.y, tx - this.x); // 求arctan角度
        // 在单位圆上表示速度方向
        this.vx = Math.cos(angle);
        this.vy = Math.sin(angle);
    }

    is_attacked(angle, damage) {
        for (let i = 0; i < 15 + Math.random() * 5; i ++) {
            let x = this.x;
            let y = this.y;
            let radius = this.radius * Math.random() * 0.1;
            let angle = Math.PI * 2 * Math.random(); // 角度随机
            let vx = Math.cos(angle), vy = Math.sin(angle);
            let color = this.color;
            let speed = this.speed * 10;
            let move_length = this.radius * Math.random() * 5;
            new Particle(this.playground, x, y, radius, vx, vy, color, speed, move_length);
        }

        this.radius -= damage;
        if (this.radius < 10) {
            this.destroy();
            return false;
        }
        this.damage_x = Math.cos(angle);
        this.damage_y = Math.sin(angle);
        this.damage_speed = damage * 100; // 被伤害时每秒移动多少距离
        this.speed *= 1.5; // 被击中后速度变快

    }

    update() { // 每一帧都要渲染一遍 否则不画园就会消失

        if (!this.is_me && Math.random() < 1 /180) { // 人机每三秒钟发射一枚炮弹
            let id = Math.floor(Math.random() * this.playground.players.length); // 随机对一个玩家攻击
            let player = this.playground.players[id]; // 朝玩家射击
            let tx = player.x + player.speed * this.vx * this.timedelta / 1000 * 1;
            let ty = player.y + player.speed * this.vy * this.timedelta / 1000 * 1;
            this.shoot_fireball(tx, ty);
        }


        if (this.damage_speed > 10){
            // 被伤害就不受控制
            this.vx = this.vy = 0;
            this.move_length = 0;

            // 用伤害的距离更新坐标
            this.x += this.damage_x * this.damage_speed * this.timedelta / 1000;
            this.y += this.damage_y * this.damage_speed * this.timedelta / 1000;
            this.damage_speed *= this.friction; // 乘上摩擦力 让受到伤害后的被移动速度逐渐变小
        }
        else{
            if (this.move_length < this.eps) { // 小于误差值 不需要再移动
                this.move_length = 0;
                this.vx = this.vy = 0;
                if (!this.is_me) { // 如果是AI 每次走到一个位置会接着走下一个随机位置
                    let tx = Math.random() * this.playground.width;
                    let ty = Math.random() * this.playground.height;
                    this.move_to(tx, ty);
                }
            }
            else{
                // 一秒钟移动speed timedelta是毫秒单位 换算成秒要/1000 ---> 得到一个时间间隔(每帧)移动多少
                let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000); // 真实的移动距离 = min(还需要移动多少距离, 每一帧能移动多少距离)
                // 速度方向 * 一帧能移动的元距离 = 各自在自己方向上移动的距离
                this.x += this.vx * moved;
                this.y += this.vy * moved;
                // 鼠标被点击时才会执行move_to()来更新move_length 所以每一帧要重新计算move_length 不能只靠鼠标点击来确认还要移动多少距离
                this.move_length -= moved;
            }
        }

        this.render();
    }

    render() { //每一帧渲染一次 重新画一次圆
        if (this.is_me) { // 如果是自己 将头像渲染上去
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            this.ctx.stroke();
            this.ctx.clip();
            this.ctx.drawImage(this.img, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2); 
            this.ctx.restore();
        }
        else { // 如果是人机 随机颜色画圆
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false); // 以xy为圆心radius为半径画角度为2Π的弧
            this.ctx.fillStyle = this.color;
            this.ctx.fill();
        }
    }

    on_destory() {
        for (let i = 0; i < this.playground.players.length; i ++){
            if (this.playground.players[i] === this) {
                this.playground.players.splice(i, 1);
            }
        }
    }
}
class FireBall extends AcGameObject{
    constructor(playground, player, x, y, radius, vx, vy, color, speed, move_length, damage) {
        super();

        this.playground = playground;
        this.player = player;
        this.ctx = this.player.ctx;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.radius = radius;
        this.speed = speed;
        this.move_length = move_length;
        this.damage = damage;
        this.eps = 0.1;
    }

    start() {
    }

    update() {
        if(this.move_length < this.eps) {
            this.destroy();
            return false; // 表示火球消失
        }

        for (let i = 0; i < this.playground.players.length; i ++) {
            let player = this.playground.players[i];
            if (this.player !== player && this.is_collision(player)) {
                this.attack(player);
            }
        }

        let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
        this.x += this.vx * moved;
        this.y += this.vy * moved;
        this.move_length -= moved;

        this.render();
    }

    get_dist(x1, y1, x2, y2) {
        let dx = x1 - x2;
        let dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }

    is_collision(obj) { // 碰撞检测
        let distance = this.get_dist(this.x, this.y, obj.x, obj.y);
        if (distance < this.radius + obj.radius) // 撞上了
            return true;
        return false;
    }

    attack(player) {
        let angle = Math.atan2(player.y - this.y, player.x - this.x);
        player.is_attacked(angle, this.damage); // 在angle方向上受了damage的伤害
        this.destroy();
    }

    render() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }
}
class AcGamePlayground {
    constructor(root) {
        this.root = root;
        this.$playground = $(`
<div class="ac-game-playground">

</div>
        `);
        this.hide(); // 加入之前先隐藏界面

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

        // 需要先show出来再初始化 否则是先初始化好了固定大小才展示 导致canvas大小不会改变
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

    }

    hide(){
        this.$playground.hide();
    }
}
class Settings{
    constructor(root){
        this.root = root;
        this.platform = "WEB";
        if (this.root.AcOS) {
            this.platform = "ACAPP"; // 如果有第二个参数 则一定是在acapp端运行
        }

        this.username = "";
        this.photo = "";

        this.$settings = $(`
<div class="ac-game-settings">
    <div class="ac-game-settings-login">

        <div class="ac-game-settings-title">
            登录
        </div>

        <div class= "ac-game-settings-username">
            <div class="ac-game-settings-item"> <!-- 反复使用到item类 -->
                <input type="text" placeholder="用户名">
            </div>
        </div>

        <div class="ac-game-settings-password">
            <div class="ac-game-settings-item">
                <input type="password" placeholder="密码"> <!-- 密码格式的输入框 -->
            </div>
        </div>

        <div class="ac-game-settings-submit">
            <div class="ac-game-settings-item">
                <button>登录</button>
            </div>
        </div>

        <div class="ac-game-settings-error-messages">
        </div>

        <div class="ac-game-settings-option">
            先注册
        </div>

        <br><br> <!-- inline可能会影响下一行 加回车 -->
        <div class="ac-game-settings-ac">
            <img width="30" src="https://app2776.acapp.acwing.com.cn/static/image/settings/jiaran.png">
            <br>
            <div>
                一键登录
            </div>
        </div>

    </div>



    <div class="ac-game-settings-register">

        <div class="ac-game-settings-title">
            注册
        </div>

        <div class= "ac-game-settings-username">
            <div class="ac-game-settings-item"> <!-- 反复使用到item类 -->
                <input type="text" placeholder="用户名">
            </div>
        </div>

        <div class="ac-game-settings-password ac-game-settings-password-first">
            <div class="ac-game-settings-item">
                <input type="password" placeholder="密码"> <!-- 密码格式的输入框 -->
            </div>
        </div>

        <div class="ac-game-settings-password ac-game-settings-password-second">
            <div class="ac-game-settings-item">
                <input type="password" placeholder="确认密码"> <!-- 密码格式的输入框 -->
            </div>
        </div>

        <div class="ac-game-settings-submit">
            <div class="ac-game-settings-item">
                <button>注册</button>
            </div>
        </div>

        <div class="ac-game-settings-error-messages"> <!-- 下面用html()展示出回调函数返回的错误信息 -->
        </div>

        <div class="ac-game-settings-option">
            去登录
        </div>

        <br><br> <!-- inline可能会影响下一行 加回车 -->
        <div class="ac-game-settings-ac">
            <img width="30" src="https://app2776.acapp.acwing.com.cn/static/image/settings/jiaran.png">
            <br>
            <div>
                一键登录
            </div>
        </div>

    </div>
</div>
`);
        // 先存好html对象 先隐藏起来 需要哪个再渲染
        // find函数用于将html对象索引出来方便操作
        this.$login = this.$settings.find(".ac-game-settings-login");

        // 相邻两级用 > 号 否则用空格
        this.$login_username = this.$login.find(".ac-game-settings-username input");
        this.$login_password = this.$login.find(".ac-game-settings-password input");
        this.$login_submit = this.$login.find(".ac-game-settings-submit button");
        this.$login_error_messages = this.$login.find(".ac-game-settings-error-messages");
        this.$login_register = this.$login.find(".ac-game-settings-option");

        this.$login.hide();


        this.$acwing_login = this.$settings.find('.ac-game-settings-ac img');


        this.$register = this.$settings.find(".ac-game-settings-register");

        this.$register_username = this.$register.find(".ac-game-settings-username input");
        this.$register_password = this.$register.find(".ac-game-settings-password-first input");
        this.$register_password_confirm = this.$register.find(".ac-game-settings-password-second input");
        this.$register_submit = this.$register.find(".ac-game-settings-submit button");
        this.$register_error_messages = this.$register.find(".ac-game-settings-error-messages");
        this.$register_login = this.$register.find(".ac-game-settings-option");

        this.$register.hide();



        this.root.$ac_game.append(this.$settings); // 将html界面加入到body中

        this.start();
    }

    start() {
        this.getinfo();
        this.listening();
    }

    listening() {
        let outer = this;
        // 注册界面和登陆界面的监听函数
        this.listening_login();
        this.listening_register();


        this.$acwing_login.click(function() {
            outer.acwing_login();
        });
    }

    listening_register() { // 注册界面的监听函数
        let outer = this;
        this.$register_login.click(function() { // 跳转到登录界面
            outer.login();
        });
        this.$register_submit.click(function() { // 提交注册
            outer.register_on_remote();
        });
    }

    listening_login() { // 登录界面的监听函数
        let outer = this;
        this.$login_register.click(function() { // 跳转到注册界面
            outer.register();
        });

        this.$login_submit.click(function() { // 提交登录
            outer.login_on_remote();
        });
    }

    acwing_login() { // 访问一键登录的链接 服务器生成了apply_code的链接 返回给前端后重定向到授权登录界面 其中的apply_code带着用户信息向acwing发送授权请求
        $.ajax({
            url: "https://app2776.acapp.acwing.com.cn/settings/acwing/web/apply_code/",
            type: "GET",
            success: function(resp) {
                console.log(resp);
                if (resp.result === "success") {
                    window.location.replace(resp.apply_code_url); // 重定向到授权登录页面
                }
            },
        });
    }


    login_on_remote() { // 在远程服务器上登录
        let outer = this;
        let username = this.$login_username.val(); // 取出input文本框的值
        let password = this.$login_password.val();
        this.$login_error_messages.empty(); // 清空error message

        $.ajax({
            url: "https://app2776.acapp.acwing.com.cn/settings/login/",
            type: "GET",
            data: {
                username: username,
                password: password,
            },
            success: function(resp) {
                console.log(resp);
                if (resp.result === "success") {
                    location.reload(); // 刷新一下 记录好登陆成功的信息
                }
                else {
                    outer.$login_error_messages.html(resp.result); // 显示出未成功登录的信息
                }
            }
        });
    }

    register_on_remote() { // 在远程服务器上注册
        let outer = this;
        let username = this.$register_username.val();
        let password = this.$register_password.val();
        let password_confirm = this.$register_password_confirm.val();
        this.$register_error_messages.empty();

        $.ajax({
            url: "https://app2776.acapp.acwing.com.cn/settings/register/",
            type: "GET",
            data: {
                username: username,
                password: password,
                password_confirm: password_confirm,
            },
            success: function(resp) {
                console.log(resp);
                if (resp.result === "success") {
                    location.reload(); // 刷新页面
                }
                else{
                    outer.$register_error_messages.html(resp.result);
                }
            }
        });

    }

    logout_on_remote() { // 在远程服务器上登出
        if (this.platform === "ACAPP") return false;

        $.ajax({
            url: "https://app2776.acapp.acwing.com.cn/settings/logout/",
            type: "GET",
            success: function(resp) {
                console.log(resp);
                if (resp.result === "success"){
                    location.reload(); // 刷新页面
                }
            },
        });
    }


    login() { // 打开登陆界面
        this.$register.hide();
        this.$login.show();
    }

    register() { // 打开注册界面
        this.$login.hide();
        this.$register.show();
    }

    getinfo() {
        let outer = this;

        $.ajax({ // 发送请求给后端 后端根据路由找urls文件夹 文件夹里对应文件找回views文件夹的函数
            url: "https://app2776.acapp.acwing.com.cn/settings/getinfo/",
            type: "GET",
            data: {
                platform: outer.platform,
            },
            success: function(resp) { // 接受后端传回的数据
                console.log(resp);
                if (resp.result === "success") {
                    outer.username = resp.username;
                    outer.photo = resp.photo;
                    console.log(outer.photo);
                    outer.hide();
                    outer.root.menu.show();
                }
                else {
                    outer.login(); // 若返回一个没成功登陆的信息 则显示登陆界面
                }
            }
        });
    }

    hide() {
        this.$settings.hide();
    }

    show() {
        this.$settings.show();
    }

}
export class AcGame{
    constructor(id, AcOS) { // 只要有第二个参数 一定是在acapp里执行 没有则是在web端执行
        this.id = id;
        // id前加上# 类前加上.
        this.$ac_game = $('#' + id); // 存下网页中的div体作为自己的属性方便后续添加html对象
        this.AcOS = AcOS; // 确定在哪个端打开的

        this.menu = new AcGameMenu(this); //创建菜单类 菜单类的声明在menu文件夹里
        this.settings = new Settings(this); // 创建settings界面 登陆注册界面
        this.playground = new AcGamePlayground(this); // 创建游戏界面的对象 声明在playground文件夹


        this.start();
    }

    start(){
    }


}
