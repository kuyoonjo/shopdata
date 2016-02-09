from django.contrib.auth import get_user_model
from rest_framework.permissions import IsAuthenticated
from shopdata.serializers import UserSerializer, SignupSerializer
from shopdata.serializers import VendorSerializer, PartLocationSerializer, PartSerializer
from shopdata.models import Vendor, PartLocation, Part
from rest_framework import generics
from rest_social_auth.views import JWTAuthMixin


class ProfileView(JWTAuthMixin, generics.RetrieveAPIView):
    permission_classes = IsAuthenticated,
    serializer_class = UserSerializer
    model = get_user_model()

    def get_object(self, queryset=None):
        return self.request.user

class SignupView(generics.CreateAPIView):
    serializer_class = SignupSerializer

class VendorDetailView(generics.RetrieveAPIView):
    queryset = Vendor.objects.all()
    serializer_class = VendorSerializer

class VendorListView(generics.ListAPIView):
    queryset = Vendor.objects.all()
    serializer_class = VendorSerializer

class PartLocationDetailView(generics.RetrieveAPIView):
    queryset = PartLocation.objects.all()
    serializer_class = PartLocationSerializer

class PartLocationListView(generics.ListAPIView):
    queryset = PartLocation.objects.all()
    serializer_class = PartLocationSerializer

class PartDetailView(generics.RetrieveAPIView):
    queryset = Part.objects.all()
    serializer_class = PartSerializer

class PartListView(generics.ListAPIView):
    queryset = Part.objects.all()
    serializer_class = PartSerializer
