from django.conf.urls import url, include
from rest_framework.urlpatterns import format_suffix_patterns
from shopdata import views

urlpatterns = [
    url(r'^accounts/profile/$', views.ProfileView.as_view()),
    url(r'^accounts/signup/$', views.SignupView.as_view()),
    url(r'^accounts/login/', include('rest_social_auth.urls_jwt')),
    url(r'^accounts/login/$', 'rest_framework_jwt.views.obtain_jwt_token'),
    url(r'^accounts/verify/$', 'rest_framework_jwt.views.verify_jwt_token'),

    url(r'^vendors/$', views.VendorListView.as_view()),
    url(r'^vendors/(?P<pk>[0-9]+)/$', views.VendorDetailView.as_view()),
    url(r'^parts/locations/$', views.PartLocationListView.as_view()),
    url(r'^parts/locations/(?P<pk>[0-9]+)/$', views.PartLocationDetailView.as_view()),
    url(r'^parts/$', views.PartListView.as_view()),
    url(r'^parts/(?P<pk>[0-9]+)/$', views.PartDetailView.as_view()),
    url(r'^partlists/$', views.PartListListView.as_view()),
    url(r'^onOrders/$', views.OnOrderListView.as_view()),
    url(r'^onOrders/(?P<pk>[0-9]+)/$', views.OnOrderDetailView.as_view()),
    url(r'^vehicles/$', views.VehicleListView.as_view()),
    url(r'^vehicles/(?P<pk>[0-9]+)/$', views.VehicleDetailView.as_view()),
    url(r'^uploads/$', views.UploadListView.as_view()),
    url(r'^uploads/(?P<pk>[0-9]+)/$', views.UploadDetailView.as_view()),
    url(r'^blog/$', views.BlogListView.as_view()),
    url(r'^blog/(?P<pk>[0-9]+)/$', views.BlogDetailView.as_view()),
    url(r'^departments/$', views.DepartmentListView.as_view()),
    url(r'^departments/(?P<pk>[0-9]+)/$', views.DepartmentDetailView.as_view()),
    url(r'^workOrders/$', views.WorkOrderListView.as_view()),
    url(r'^workOrders/(?P<pk>[0-9]+)/$', views.WorkOrderDetailView.as_view()),
    url(r'^users/(?P<pk>[0-9]+)/$', views.UserDetailView.as_view()),

]

urlpatterns = format_suffix_patterns(urlpatterns)