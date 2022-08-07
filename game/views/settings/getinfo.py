# 直接地址栏输入该文件是直接访问一个静态文件 都是true的状态

from django.http import JsonResponse
from game.models.player.player import Player



def getinfo_Acapp(request):
    player = Player.objects.all()[0] # 取第一名玩家
    return JsonResponse({
        'result': "success",
        'username': player.user.username,
        "photo": player.photo,
    })




def getinfo_Web(request):
    user = request.user
    if not user.is_authenticated: # 判断用户是否登陆
        return JsonResponse({
            'result': "未登录"
            })
    else:
        player = Player.objects.get(user=user) # 取玩家
        return JsonResponse({
            'result': "success",
            'username': player.user.username,
            "photo": player.photo,
            })



def getinfo(request):
    platform = request.GET.get('platform')
    if platform == 'ACAPP':
        return getinfo_Acapp(request)
    elif platform == 'WEB':
        return getinfo_Web(request)
