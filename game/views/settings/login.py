from django.contrib.auth import authenticate, login
from django.http import JsonResponse

def signin(request):
    data = request.GET # 取出数据
    username = data.get('username')
    password = data.get('password')
    user = authenticate(username=username, password=password) # 用于判断是否成功登录

    if not user:
        return JsonResponse({
            'result': "用户名或密码不正确"
        })
    login(request, user) # 用户名密码正确则执行登录操作
    return JsonResponse({
        'result': "success"
    })
