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
