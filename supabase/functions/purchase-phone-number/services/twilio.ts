
// Get Twilio credentials based on environment
export function getTwilioCredentials() {
  const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
  const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
  
  if (!accountSid || !authToken) {
    console.error('Missing Twilio credentials in environment variables');
    throw new Error('Twilio credentials not configured');
  }
  
  return { accountSid, authToken };
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
  
  try {
    // Search for available phone numbers
    console.log(`Making API request to: ${searchUrl}`);
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
      const searchErrorText = await searchResponse.text();
      console.error('Error searching for phone numbers:', searchErrorText);
      try {
        const searchError = JSON.parse(searchErrorText);
        throw new Error(`Failed to find available phone numbers: ${searchError.message || searchErrorText}`);
      } catch (e) {
        throw new Error(`Failed to find available phone numbers: ${searchErrorText}`);
      }
    }
    
    const searchData = await searchResponse.json();
    console.log(`Search response status: ${searchResponse.status}`);
    
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
  } catch (error) {
    console.error('Error in searchAvailablePhoneNumbers:', error);
    throw error; // Re-throw to be handled by the caller
  }
}

// Purchase a phone number from Twilio
export async function purchasePhoneNumber(credentials: { accountSid: string, authToken: string }, 
                              phoneNumber: string, 
                              userId: string, 
                              webhookBaseUrl: string) {
  const { accountSid, authToken } = credentials;
  
  try {
    console.log(`Attempting to purchase phone number: ${phoneNumber}`);
    console.log(`Using webhook base URL: ${webhookBaseUrl}`);
    
    // Purchase the phone number
    const purchaseParams = new URLSearchParams({
      PhoneNumber: phoneNumber,
      FriendlyName: `Campaign Finance - ${userId}`,
      VoiceUrl: `${webhookBaseUrl}/twilio-voice-webhook`,
      VoiceMethod: 'POST',
      StatusCallbackUrl: `${webhookBaseUrl}/twilio-recording-status`,
      StatusCallbackMethod: 'POST',
    });
    
    console.log('Purchase parameters:', purchaseParams.toString());
    
    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/IncomingPhoneNumbers.json`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${accountSid}:${authToken}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: purchaseParams.toString(),
    });
    
    if (!response.ok) {
      const responseText = await response.text();
      console.error('Error purchasing phone number:', responseText);
      try {
        const twilioError = JSON.parse(responseText);
        throw new Error(`Failed to purchase phone number: ${twilioError.message || twilioError.error_message || responseText}`);
      } catch (e) {
        throw new Error(`Failed to purchase phone number: ${responseText}`);
      }
    }
    
    const data = await response.json();
    console.log('Successfully purchased phone number');
    return data;
  } catch (error) {
    console.error('Error in purchasePhoneNumber:', error);
    throw error; // Re-throw to be handled by the caller
  }
}
