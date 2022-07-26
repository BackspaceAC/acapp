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
            if (e.which === 3) { // 3表示右键
                // 函数内的函数写this写的就是函数本身了 想要调用的是外部的对象的函数
                outer.move_to(e.clientX, e.clientY);
            }
            else if (e.which === 1) { // 1表示左键
                if (outer.cur_skill == "fireball") {
                    outer.shoot_fireball(e.clientX, e.clientY);
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
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false); // 以xy为圆心radius为半径画角度为2Π的弧
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }

    on_destory() {
        for (let i = 0; i < this.playground.players.length; i ++){
            if (this.playground.players[i] === this) {
                this.playground.players.splice(i, 1);
            }
        }
    }
}
