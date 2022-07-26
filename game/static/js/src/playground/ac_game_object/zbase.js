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
