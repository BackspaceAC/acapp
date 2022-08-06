from django.urls import path, include
from game.views.settings.getinfo import getinfo
from game.views.settings.login import signin
from game.views.settings.logout import signout
from game.views.settings.register import register

urlpatterns = [
    path("getinfo/", getinfo, name="settings_getinfo"), # 第一个参数是展示在前端的url
    path("login/",  signin, name="settings_login"),
    path("logout/", signout, name="settings_logout"),
    path("register/", register, name="settings_register"),
    path("acwing/", include("game.urls.settings.ac.index")), # 调用到目录下的index文件来路由
]
