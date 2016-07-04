from __future__ import unicode_literals

from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from datetime import datetime
import time
import os

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

    class Meta:
        ordering = ['name']

class Part(models.Model):
    number = models.CharField(max_length=254, unique=True)
    alternate_number = models.CharField(max_length=254, blank=True)
    vendor = models.ForeignKey(Vendor)
    description = models.CharField(max_length=254, blank=True)
    used_on = models.CharField(max_length=254, blank=True)
    price = models.FloatField()
    qty_to_stock = models.IntegerField()
    qty_on_hand = models.IntegerField()
    #qty_on_order = models.IntegerField()
    location = models.ForeignKey(PartLocation)
    image = models.ImageField(upload_to='parts/images', null=True, blank=True)
    note = models.TextField(blank=True)
    date = models.DateField()
    book = models.ForeignKey('Book', null=True, blank=True)
    book_page = models.CharField(max_length=50, null=True, blank=True)
    book_item = models.CharField(max_length=50, null=True, blank=True)

    def __unicode__(self):
        return str(self.id) + ' - ' + self.number

    @property
    def qty_on_order(self):
        orders = OnOrder.objects.filter(part=self)
        count = 0
        for order in orders:
            count += order.qty
        return count

class PartList(models.Model):
    name = models.CharField(max_length=254)
    note = models.TextField(blank=True)

class PartListItem(models.Model):
    part = models.ForeignKey(Part)
    quantity = models.IntegerField()
    part_list = models.ForeignKey(PartList, related_name='part_list_items')


class OnOrder(models.Model):
    part = models.ForeignKey(Part, related_name='on_orders')
    vendor = models.ForeignKey(Vendor, related_name='on_orders')
    qty = models.IntegerField()
    datetime = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(Human, related_name='on_orders', null=True, blank=True)

class Department(models.Model):
    name = models.CharField(max_length=50)
    number = models.CharField(max_length=50, blank=True)
    note = models.TextField()

    def __unicode__(self):
        if(self.number):
            return self.name + ' - ' + self.number
        return self.name

class Vehicle(models.Model):
    make = models.CharField(max_length=50)
    model = models.CharField(max_length=50)
    year = models.IntegerField()
    serial = models.CharField(max_length=50)
    hours = models.FloatField()
    next_interval = models.CharField(max_length=10, choices=[
        ('250', '250'),
        ('500', '500'),
        ('750', '750'),
        ('1000', '1000'),
        ('1250', '1250'),
        ('1500', '1500'),
        ('1750', '1750'),
        ('2000', '2000'),
        ('Seasonal', 'Seasonal'),
    ])
    active = models.BooleanField()
    note = models.TextField()
    interval_hours_due = models.FloatField()
    engine_make  = models.CharField(max_length=50)
    engine_model = models.CharField(max_length=50)
    engine_serial = models.CharField(max_length=50)
    engine_note = models.CharField(max_length=50)
    dashboard = models.BooleanField()
    department = models.ForeignKey(Department, blank=True, null=True)

    def __unicode__(self):
        return str(self.id) + ' - ' + self.make + ' - ' + self.model

class WorkOrder(models.Model):
    number = models.IntegerField()
    problem = models.TextField()
    solution = models.TextField()
    vehicle = models.ForeignKey(Vehicle, related_name='work_orders')
    hours = models.FloatField()
    datetime = models.DateTimeField()
    active = models.BooleanField()
    who_worked = models.ManyToManyField(Human)
    close_date = models.DateTimeField(null=True, blank=True)
    parts_used = models.TextField(blank=True)

    def save(self, *args, **kwargs):
        if not self.id:
            number = int(time.strftime("%m%d%Y") + '001')
            while WorkOrder.objects.filter(number=number).count() > 0:
                number += 1;
            self.number=number
        super(WorkOrder, self).save(*args,**kwargs)

class Book(models.Model):
    number = models.CharField(max_length=50)
    name = models.CharField(max_length=200)

    def __unicode__(self):
        return str(self.number) + ' - ' + self.name

def get_upload_path(instance, filename):
    return os.path.join(
            'uploads', str(instance.user.id), instance.file_type, "{:%Y%m%d%H%M%S}_{}".format(datetime.now(), filename))

class Upload(models.Model):
    user = models.ForeignKey(Human, related_name='uploads')
    file = models.FileField(upload_to=get_upload_path)
    file_type = models.CharField(max_length=10)
    datetime = models.DateTimeField(auto_now=True)

class Blog(models.Model):
    user = models.ForeignKey(Human, related_name='blog')
    title = models.CharField(max_length=200)
    html = models.TextField(blank=True)
    datetime = models.DateTimeField(auto_now=True)





