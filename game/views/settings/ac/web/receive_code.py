# 用于接收返回来的code 并申请链接
from django.shortcuts import redirect
from django.core.cache import cache
import requests # 用于从某网址申请结果
# 检查用户是否登录过
from django.contrib.auth.models import User
from game.models.player.player import Player
from django.contrib.auth import login
from random import randint




def receive_code(request):
    data = request.GET # 获取从acw传回来的授权码等信息
    code = data.get('code')
    state = data.get('state')
    print(code, state) # 会在uwsgi后台print出来授权码和state

    if not cache.has_key(state): # state不存在 认定为攻击 直接忽视请求重定向回主页面
        return redirect("index")

    cache.delete(state) # 存在state 成功授权并删除state

    # 申请令牌
    apply_access_token_url = "https://www.acwing.com/third_party/api/oauth2/access_token/"
    params = {
            'appid': "2776",
            'secret': "d38b6c7d63f040539d5ae0b5b0624000",
            'code': code
            }
    access_token_response = requests.get(apply_access_token_url, params=params).json() # 带着参数从apply_access_token_url获取令牌并转为json字典格式

    access_token = access_token_response['access_token']
    openid = access_token_response['openid']

    # 用返回来的openid判断用户是否已存在 一个openid就可以判断 因为openid在网站内可以唯一标识用户
    players = Player.objects.filter(openid=openid)
    if players.exists():  # 如果该用户已存在 则无需重新获取信息 直接登录即可
        login(request, players[0].user)
        return redirect("index")

    # 申请用户信息
    get_userinfo_url = "https://www.acwing.com/third_party/api/meta/identity/getinfo/"
    params = {
            "access_token": access_token,
            "openid": openid
            }
    userinfo_response = requests.get(get_userinfo_url, params=params).json()

    username = userinfo_response['username']
    photo = userinfo_response['photo']


    # 在后台注册用户
    while User.objects.filter(username=username).exists(): # 找到一个新的用户名
        username += str(randint(0, 9)) # 若acw网站和当前网站存的用户名有冲突 则每次随机加上一位数字再存入后台

    # 创建user和对应的player对象并登录
    user = User.objects.create(username=username)
    player = Player.objects.create(user=user, photo=photo, openid=openid)
    login(request, user)


    return redirect("index") # 重定向到index 也就是在根目录下叫indx的页面(也即主页面)
