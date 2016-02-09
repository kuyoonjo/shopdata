from django.contrib import admin

from shopdata.models import *

@admin.register(Human)
class HumanAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'is_staff')

@admin.register(Vendor)
class VendorAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'url')

@admin.register(PartLocation)
class PartLocationAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'description')

@admin.register(Part)
class PartAdmin(admin.ModelAdmin):
    list_display = ('id', 'number', 'qty_to_stock', 'qty_on_hand', 'qty_on_order')
    list_filter = ('vendor', 'location')

@admin.register(OnOrder)
class OnOrder(admin.ModelAdmin):
    list_display = ('id', 'part', 'qty')

@admin.register(Vehicle)
class VehicleAdmin(admin.ModelAdmin):
    list_display = ('id', 'make', 'model', 'active')
    list_filter = ('make', 'active')

@admin.register(WorkOrder)
class WorkOrderAdmin(admin.ModelAdmin):
    list_display = ('vehicle', 'hours', 'datetime', 'active')
    list_filter = ('vehicle', 'active')

@admin.register(WhoWorked)
class WhoWorkedAdmin(admin.ModelAdmin):
    list_display = ('work_order', 'human')

@admin.register(PartsUsed)
class PartsUsedAdmin(admin.ModelAdmin):
    list_display = ('work_order', 'part', 'qty')
