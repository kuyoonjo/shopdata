from shopdata.models import Part, PartLocation, Vendor
import datetime, random

def createSampleData():
    v = Vendor(
            name = 'Sample Vendor',
            address1 = "...",
            city = '...',
            state = '...',
            zip = '...',
            phone = '...',
            email = 'sample@sample.com',
            url = 'http://sample.com',
            poc = '...',
            note = '...'
    )
    v.save()

    for x in xrange(100, 110):
        pl = PartLocation(name=str(x), description="...")
        pl.save()
        for y in xrange(1, 10):
            s = str(x) + str(y)
            Part.objects.create(
                    number=s,
                    vendor = v,
                    price = random.randint(1, 10),
                    qty_to_stock = random.randint(1,5),
                    qty_on_hand = random.randint(1,5),
                    qty_on_order = random.randint(1,5),
                    location = pl,
                    date = datetime.datetime.now()
            )