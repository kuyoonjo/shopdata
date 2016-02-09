from __future__ import unicode_literals

from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models

class Human(AbstractUser):
    phone_number = models.CharField(blank=True, max_length=50)
    note = models.TextField(blank=True)

class Vendor(models.Model):
    name = models.CharField(max_length=254)
    address1 = models.CharField(max_length=254)
    address2 = models.CharField(max_length=254, blank=True)
    city = models.CharField(max_length=50)
    state = models.CharField(max_length=50)
    zip = models.CharField(max_length=50)
    phone = models.CharField(max_length=50)
    email = models.EmailField()
    url = models.URLField()
    poc = models.CharField(max_length=254)
    note = models.TextField(blank=True)

    def __unicode__(self):
        return str(self.id) + ' - ' + self.name

class PartLocation(models.Model):
    name = models.CharField(max_length=254)
    description = models.TextField(blank=True)

    def __unicode__(self):
        return str(self.id) + ' - ' + self.name

class Part(models.Model):
    number = models.CharField(max_length=254)
    alternate_number = models.CharField(max_length=254, blank=True)
    vendor = models.ForeignKey(Vendor, related_name='vendor')
    description = models.TextField(blank=True)
    used_on = models.CharField(max_length=254, blank=True)
    price = models.FloatField()
    qty_to_stock = models.IntegerField()
    qty_on_hand = models.IntegerField()
    qty_on_order = models.IntegerField()
    location = models.ForeignKey(PartLocation, related_name='location')
    image = models.ImageField(upload_to='parts/images', null=True, blank=True)
    note = models.TextField(blank=True)
    date = models.DateField()

    def __unicode__(self):
        return str(self.id) + ' - ' + self.number



