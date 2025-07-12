import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dxxjjpfmtiugzlvlbvqk.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Simple transformation function
function transformRawApartmentResponse(raw, id) {
  const extractInnerText = (arr) => arr.length > 0 ? arr[0].innerText : '';
  const extractSrcValue = (arr) => arr.map(item => item.src.value);

  const parsePrice = (priceStr) => {
    const cleaned = priceStr.replace(/[\$,]/g, '');
    return parseInt(cleaned) || 0;
  };

  const parseBedrooms = (bedStr) => {
    const match = bedStr.match(/(\d+)\s*bed/i);
    return match ? parseInt(match[1]) : 0;
  };

  const parseBathrooms = (bathStr) => {
    const match = bathStr.match(/(\d+(?:\.\d+)?)\s*bath/i);
    return match ? parseFloat(match[1]) : 0;
  };

  return {
    id,
    title: null,
    description: null,
    price: parsePrice(extractInnerText(raw.price)),
    bedrooms: parseBedrooms(extractInnerText(raw.beds)),
    bathrooms: parseBathrooms(extractInnerText(raw.baths)),
    location: extractInnerText(raw.boro),
    address: raw.general.length > 0 ? raw.general[0].address : '',
    images: extractSrcValue(raw.imageUrls),
    isAvailable: true,
    listingUrl: raw.general.length > 0 ? raw.general[0].listingUrl.value : null,
    listedBy: extractInnerText(raw.listedBy) || null,
  };
}

async function testSupabaseEndpoint() {
  try {
    console.log("🔍 Testing Supabase endpoint logic...");
    
    const { data, error } = await supabase
      .from('listings')
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return;
    }

    console.log(`🔍 Retrieved ${data?.length || 0} records`);

    if (!data || data.length === 0) {
      console.log('No data found');
      return;
    }

    const allApartments = [];
    let apartmentIdCounter = 1000;

    data.forEach((record) => {
      if (record.data && record.data.data && record.data.data.listings) {
        const listings = record.data.data.listings;
        console.log(`🔍 Found ${listings.length} apartments in record ${record.id}`);
        
        listings.forEach((listing) => {
          try {
            const transformedApartment = transformRawApartmentResponse(listing, apartmentIdCounter++);
            allApartments.push(transformedApartment);
          } catch (transformError) {
            console.error('Error transforming apartment:', transformError);
          }
        });
      }
    });

    console.log(`🔍 Total transformed apartments: ${allApartments.length}`);
    
    if (allApartments.length > 0) {
      console.log('\nFirst apartment:');
      console.log(JSON.stringify(allApartments[0], null, 2));
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

testSupabaseEndpoint();