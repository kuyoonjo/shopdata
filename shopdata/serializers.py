from rest_framework import serializers
from django.contrib.auth import get_user_model
from shopdata.models import *


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        exclude = ('is_active', 'date_joined', 'password', 'last_login', 'user_permissions', 'groups', 'is_superuser',)

class SignupSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        exclude = ('is_staff', 'is_active', 'date_joined', 'last_login', 'user_permissions', 'groups', 'is_superuser',)

    def create(self, validated_data):
        user = get_user_model().objects.create_user(**validated_data)
        return user

class VendorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vendor

class PartLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = PartLocation

class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book

class PartSerializer(serializers.ModelSerializer):
    vendor = VendorSerializer(read_only=True)
    location = PartLocationSerializer(read_only=True)
    book = BookSerializer(read_only=True)
    qty_on_order = serializers.IntegerField(read_only=True)
    image = serializers.ImageField(read_only=True)
    class Meta:
        model = Part

class OnOrderSerializer(serializers.ModelSerializer):
    part = PartSerializer()
    class Meta:
        model = OnOrder

class OnOrderCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = OnOrder

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department

class VehicleSerializer(serializers.ModelSerializer):
    work_orders = serializers.PrimaryKeyRelatedField(many=True, queryset=WorkOrder.objects.all())
    department = DepartmentSerializer(read_only=True)
    class Meta:
        model = Vehicle

class PartListItemPartSerializer(serializers.ModelSerializer):
    class Meta:
        model = Part
        fields = ('number', 'description', 'price')

class PartListItemSerializer(serializers.ModelSerializer):
    part = PartListItemPartSerializer(read_only=True)
    class Meta:
        model = PartListItem
        exclude = ('id', 'part_list')

class PartListSerializer(serializers.ModelSerializer):
    part_list_items = PartListItemSerializer(many=True, read_only=True)
    class Meta:
        model = PartList

