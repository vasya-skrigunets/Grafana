from tenant_users.tenants.utils import create_public_tenant
from tenant_users.tenants.tasks import provision_tenant
from users.models import User
from shipments.models import ShipmentAddress
from amazon_mws.constants import SKU_DROP_WAREHOUSE_ADDRESS

create_public_tenant("dev.skudrop.com", "admin@example.com")

admin_user = User.objects.get(email='admin@example.com')

admin_user.set_password('admin')
admin_user.is_active = True
admin_user.is_verified = True
admin_user.is_superuser = True
admin_user.is_admin = True
admin_user.is_staff = True
admin_user.role = 'ADMINISTRATOR'
admin_user.save()


user = User.objects.create_user(email="test@example.com", first_name="test_first_name", last_name="test_last_name")
user.set_password('test')
user.is_active = True
user.is_verified = True
user.save()

fqdn = provision_tenant("Test", "test", "test@example.com")

default_address = ShipmentAddress.objects.create(**SKU_DROP_WAREHOUSE_ADDRESS)