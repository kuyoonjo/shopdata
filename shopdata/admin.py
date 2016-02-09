from django.contrib import admin

from shopdata.models import Human, Vendor, PartLocation, Part

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
