from django.contrib.auth import get_user_model
from rest_framework.permissions import IsAuthenticated
from shopdata.serializers import *
from shopdata.models import *
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

class PartDetailView(generics.RetrieveUpdateAPIView):
    queryset = Part.objects.all()
    serializer_class = PartSerializer

class PartListView(generics.ListAPIView):
    queryset = Part.objects.all()
    serializer_class = PartSerializer

class OnOrderListView(generics.ListCreateAPIView):
    queryset = OnOrder.objects.all()

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return OnOrderSerializer
        if self.request.method == 'POST':
            return OnOrderCreateSerializer

class OnOrderDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = OnOrder.objects.all()
    serializer_class = OnOrderSerializer

class VehicleListView(generics.ListAPIView):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer

class PartListListView(generics.ListAPIView):
    queryset = PartList.objects.all()
    serializer_class = PartListSerializer

class UploadListView(generics.ListCreateAPIView):
    queryset = Upload.objects.all()
    serializer_class = UploadSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
        queryset = Upload.objects.all()
        file_type = self.request.query_params.get('file_type', None)

        if file_type is not None:
            queryset = queryset.filter(file_type=file_type)

        return queryset

class UploadDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Upload.objects.all()
    serializer_class = UploadSerializer
    def perform_update(self, serializer):
        serializer.save(user=self.request.user)

class BlogListView(generics.ListCreateAPIView):
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class BlogDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer
    def perform_update(self, serializer):
        serializer.save(user=self.request.user)

