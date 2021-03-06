from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.forms import ReadOnlyPasswordHashField
from django import forms

from shopdata.models import *

@admin.register(Human)
class HumanAdmin(UserAdmin):
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
    readonly_fields = ('qty_on_order',)

    fieldsets = [
        ('General', {'fields': ['number', 'alternate_number', 'vendor', 'price', 'location', 'date']}),
        ('Quantity', {'fields': ['qty_to_stock', 'qty_on_hand', 'qty_on_order']}),
        ('Details', {'fields': ['description', 'used_on', 'image', 'note']}),
        ('Book', {'fields': ['book', 'book_page', 'book_item']})
    ]


class PartListItemInline(admin.TabularInline):
    model = PartListItem
    extra = 0

@admin.register(PartList)
class PartListAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'note')
    inlines = [PartListItemInline]

@admin.register(OnOrder)
class OnOrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'part', 'qty', 'vendor', 'user', 'datetime')
    list_filter = ('vendor', 'part', 'user')

@admin.register(Vehicle)
class VehicleAdmin(admin.ModelAdmin):
    list_display = ('id', 'make', 'model', 'active', 'department')
    list_filter = ('make', 'active', 'department')


@admin.register(WorkOrder)
class WorkOrderAdmin(admin.ModelAdmin):
    list_display = ('number', 'vehicle', 'hours', 'datetime', 'active')
    list_filter = ('vehicle', 'active')
    readonly_fields = ('number',)
    fieldsets = [
        (None, {'fields': ['number', 'vehicle', 'hours', 'datetime', 'active', 'close_date']}),
        ('Details', {'fields': ['problem', 'solution', 'parts_used']}),
        ('Who Worked', {'fields': ['who_worked']}),
    ]

@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'number')
    list_filter = ('name', 'number')

@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'number')
    list_filter = ('name', 'number')

@admin.register(Upload)
class UploadAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'file', 'datetime')
    list_filter = ('user', 'file_type')

@admin.register(Blog)
class BlogAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'user', 'datetime')
    list_filter = ('user',)