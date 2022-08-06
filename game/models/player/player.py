from django.db import models
from django.contrib.auth.models import User


class Player(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE) # user删除时 将一一对应的player一起删除
    photo = models.URLField(max_length=256, blank=True) # 头像的链接设置
    openid = models.CharField(default="", max_length=50, blank=True, null=True) # 添加用户唯一标识openid

    def __str__(self): # 在数据库中展示的名字
        return str(self.user)
