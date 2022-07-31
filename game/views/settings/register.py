from django.contrib.auth import login
from django.http import JsonResponse
from django.contrib.auth.models import User
from game.models.player.player import Player



def register(request):
    data = request.GET
    username = data.get('username', "").strip() # 将字符串前后空格去掉
    password = data.get('password', "").strip()
    password_confirm = data.get('password_confirm', "").strip()
    if not username or not password:
        return JsonResponse({
            'result': "用户名和密码不能为空！"
        })
    if password != password_confirm:
        return JsonResponse({
            'result': "两次密码不一致！"
        })
    if User.objects.filter(username=username).exists():
        return JsonResponse({
            'result': "用户名已存在！"
        })
    user = User(username=username)
    user.set_password(password) # 存下密码哈希值
    user.save() # 创建成功
    Player.objects.create(user=user, photo="https://i0.hdslb.com/bfs/album/6f1d4494c850ab3d693bb6e86a60f16fd92aec49.png") # 往后台数据库的player里创建新对象
    login(request, user)
    return JsonResponse({
        'result': "success",
    })
