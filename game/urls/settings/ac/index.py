from django.urls import path
# 注意下面起别名防止重复命名
from game.views.settings.ac.web.apply_code import apply_code as web_apply_code
from game.views.settings.ac.web.receive_code import receive_code as web_receive_code
from game.views.settings.ac.acapp.apply_code import apply_code as acapp_apply_code
from game.views.settings.ac.acapp.receive_code import receive_code as acapp_receive_code

urlpatterns = [
        path("web/apply_code/", web_apply_code, name="settings_ac_web_apply_code"),
        path("web/receive_code/", web_receive_code, name="settings_ac_web_receive_code"),
        path("acapp/receive_code/", acapp_receive_code, name="settings_ac_acapp_receive_code"),
        path("acapp/apply_code/", acapp_apply_code, name="settings_ac_acapp_apply_code"),
]
