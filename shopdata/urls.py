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

]

urlpatterns = format_suffix_patterns(urlpatterns)