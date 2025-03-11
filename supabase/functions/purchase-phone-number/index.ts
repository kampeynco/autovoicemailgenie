
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { handleCors, createErrorResponse, createSuccessResponse } from "./utils/cors.ts";
import { parseRequestBody } from "./utils/request.ts";
import { 
  initSupabaseClients, 
  getUserFromAuth, 
  checkExistingPhoneNumber, 
  savePhoneNumber 
} from "./services/supabase.ts";
import { 
  getTwilioCredentials, 
  searchAvailablePhoneNumbers, 
  purchasePhoneNumber 
} from "./services/twilio.ts";

// Main handler function
serve(async (req: Request) => {
  console.log(`Received ${req.method} request to purchase-phone-number function`);
  
  // Handle CORS preflight requests
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    // Parse request body to get the location parameters
    const body = await parseRequestBody(req);
    const areaCode = body && (body as any).areaCode;
    const zipCode = body && (body as any).zipCode;
    
    console.log(`Request parameters - Area Code: ${areaCode || 'None'}, Zip Code: ${zipCode || 'None'}`);
    
    // Get JWT token from the authorization header
    const authHeader = req.headers.get('Authorization');
    
    console.log(`Got auth header: ${authHeader ? 'Yes' : 'No'}`);
    
    // Initialize Supabase clients
    const { supabaseAdmin, supabaseUrl } = initSupabaseClients(authHeader);
    
    // Authenticate user with admin client
    let user;
    try {
      user = await getUserFromAuth(supabaseAdmin, authHeader);
      console.log(`Authenticated user: ${user.id}`);
    } catch (error) {
      console.error('Authentication error:', error.message);
      return createErrorResponse(error.message, 401);
    }
    
    // Check if the user already has a phone number
    const existingNumber = await checkExistingPhoneNumber(supabaseAdmin, user.id);
    if (existingNumber) {
      console.log(`User already has phone number: ${existingNumber.phone_number}`);
      return createErrorResponse('User already has a phone number', 400);
    }
    
    // Get Twilio credentials
    let credentials;
    try {
      credentials = getTwilioCredentials();
      console.log('Got Twilio credentials');
    } catch (error) {
      console.error('Error getting Twilio credentials:', error);
      return createErrorResponse('Failed to get Twilio credentials', 500);
    }
    
    // Get base URL for webhook endpoints
    const webhookBaseUrl = Deno.env.get('FUNCTION_BASE_URL') || 
      `https://${supabaseUrl.replace('https://', '').split('.')[0]}.supabase.co/functions/v1`;
    
    console.log(`Using webhook base URL: ${webhookBaseUrl}`);
    
    // Search for available phone numbers with provided parameters
    let phoneNumber;
    try {
      console.log(`Searching for phone numbers with area code: ${areaCode} or zip code: ${zipCode}`);
      phoneNumber = await searchAvailablePhoneNumbers(credentials, { areaCode, zipCode });
      console.log(`Found available phone number: ${phoneNumber}`);
    } catch (error) {
      console.error('Error searching for phone numbers:', error);
      return createErrorResponse(error.message, 404);
    }
    
    // Purchase the phone number
    let phoneData;
    try {
      console.log(`Purchasing phone number: ${phoneNumber}`);
      phoneData = await purchasePhoneNumber(credentials, phoneNumber, user.id, webhookBaseUrl);
      console.log(`Successfully purchased phone number from Twilio`);
    } catch (error) {
      console.error('Error purchasing phone number:', error);
      return createErrorResponse(error.message, 500);
    }
    
    // Save the phone number to our database
    let phoneNumberData;
    try {
      console.log(`Saving phone number to database for user: ${user.id}`);
      phoneNumberData = await savePhoneNumber(supabaseAdmin, user.id, phoneData);
      console.log(`Successfully saved phone number to database`);
    } catch (error) {
      console.error('Error saving phone number:', error);
      return createErrorResponse(error.message, 500);
    }
    
    // Return the purchased phone number
    return createSuccessResponse({ 
      success: true, 
      phoneNumber: phoneNumberData 
    });
    
  } catch (error) {
    console.error('Error purchasing phone number:', error);
    return createErrorResponse(error.message || 'An unknown error occurred');
  }
});
