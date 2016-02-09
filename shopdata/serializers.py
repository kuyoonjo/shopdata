from rest_framework import serializers
from django.contrib.auth import get_user_model
from shopdata.models import Vendor, PartLocation, Part


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

class PartSerializer(serializers.ModelSerializer):
    vendor = VendorSerializer()
    location = PartLocationSerializer()
    class Meta:
        model = Part
