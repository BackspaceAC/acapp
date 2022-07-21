from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.

def index(request):
    line1 = '<h1 style="text-align: center">我是鲨鱼</h1>'
    line2 = '<a href="/play/" >进入游戏</a>'
    line3 = '<hr>'
    line4 = '<img src="https://img0.baidu.com/it/u=1099813148,3486583385&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500" width=800>'
    return HttpResponse(line1 + line2 + line3 + line4)


def play(request):
    line1 = '<h1 style="text-align: center">儿子闭嘴</h1>'
    line2 = '<br><hr>'
    line3 = '<a href="/">返回主界面</a>'
    return HttpResponse(line1 + line2 + line3)
