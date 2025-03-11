
// Get Twilio credentials based on environment
export function getTwilioCredentials() {
  return {
    accountSid: Deno.env.get('TWILIO_API_SID')!,
    authToken: Deno.env.get('TWILIO_API_SECRET')!
  };
}

// Search for available phone numbers with location parameters
export async function searchAvailablePhoneNumbers(credentials: { accountSid: string, authToken: string }, 
                                       params: { areaCode?: string, zipCode?: string }) {
  const { accountSid, authToken } = credentials;
  const { areaCode, zipCode } = params;
  
  // Prepare search URL
  let searchUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/AvailablePhoneNumbers/US/Local.json?Limit=1&VoiceEnabled=true`;
  
  // Add area code to search if provided
  if (areaCode) {
    searchUrl += `&AreaCode=${areaCode}`;
    console.log(`Searching for phone numbers with area code: ${areaCode}`);
  }
  
  // Add zip code to search if provided
  if (zipCode) {
    searchUrl += `&InPostalCode=${zipCode}`;
    console.log(`Searching for phone numbers with postal code: ${zipCode}`);
  }
  
  // Search for available phone numbers
  const searchResponse = await fetch(
    searchUrl,
    {
      headers: {
        'Authorization': `Basic ${btoa(`${accountSid}:${authToken}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  
  if (!searchResponse.ok) {
    const searchError = await searchResponse.json();
    console.error('Error searching for phone numbers:', searchError);
    throw new Error('Failed to find available phone numbers');
  }
  
  const searchData = await searchResponse.json();
  
  if (!searchData.available_phone_numbers || searchData.available_phone_numbers.length === 0) {
    let errorMessage = 'No phone numbers available';
    if (areaCode) {
      errorMessage = `No phone numbers available with area code ${areaCode}`;
    } else if (zipCode) {
      errorMessage = `No phone numbers available with zip code ${zipCode}`;
    }
    throw new Error(errorMessage);
  }
  
  return searchData.available_phone_numbers[0].phone_number;
}

// Purchase a phone number from Twilio
export async function purchasePhoneNumber(credentials: { accountSid: string, authToken: string }, 
                              phoneNumber: string, 
                              userId: string, 
                              webhookBaseUrl: string) {
  const { accountSid, authToken } = credentials;
  
  // Purchase the phone number
  const purchaseParams = new URLSearchParams({
    PhoneNumber: phoneNumber,
    FriendlyName: `Campaign Finance - ${userId}`,
    VoiceUrl: `${webhookBaseUrl}/twilio-voice-webhook`,
    VoiceMethod: 'POST',
    StatusCallbackUrl: `${webhookBaseUrl}/twilio-recording-status`,
    StatusCallbackMethod: 'POST',
  });
  
  const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/IncomingPhoneNumbers.json`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${btoa(`${accountSid}:${authToken}`)}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: purchaseParams.toString(),
  });
  
  if (!response.ok) {
    const twilioError = await response.json();
    console.error('Error purchasing phone number:', twilioError);
    throw new Error('Failed to purchase phone number');
  }
  
  return await response.json();
}
