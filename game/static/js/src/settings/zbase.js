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
