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
    Player.objects.create(user=user, photo="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fblog%2F202107%2F09%2F20210709142454_dc8dc.thumb.1000_0.jpeg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1661779231&t=7fd32076") # 往后台数据库的player里创建新对象
    login(request, user)
    return JsonResponse({
        'result': "success",
    })
