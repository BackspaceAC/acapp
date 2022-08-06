# 用于申请code
# 先给前端链接 然后再重定向到ac网站
from django.http import JsonResponse
from urllib.parse import quote
from random import randint
from django.core.cache import cache


def get_state():
    res = ""
    for i in range(8): # 返回八位数的state
        res += str(randint(0, 9)) # 从0~9之间返回一个随机值 然后转成字符串
    return res



def apply_code(request):
    appid = "2776"
    # 加入quote函数将url中？等特殊字符转成非特殊字符 防止解析出问题
    redirect_uri = quote("https://app2776.acapp.acwing.com.cn/settings/acwing/web/receive_code/")
    scope = "userinfo"
    state = get_state()

    cache.set(state, True, 7200) # 有效期两小时

    apply_code_url = "https://www.acwing.com/third_party/api/oauth2/web/authorize/"
    return JsonResponse({
        'result': "success",
        'apply_code_url': apply_code_url + "?appid=%s&redirect_uri=%s&scope=%s&state=%s" % (appid, redirect_uri, scope, state) # 带着用户信息向acw发送授权请求
        })
