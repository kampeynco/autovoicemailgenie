
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { handleCors, createErrorResponse, createSuccessResponse } from "./utils/cors.ts";
import { parseRequestBody } from "./utils/request.ts";
import { 
  initSupabaseClients, 
  authenticateUser, 
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
  // Handle CORS preflight requests
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    // Parse request body to get the location parameters
    const body = await parseRequestBody(req);
    const areaCode = body && (body as any).areaCode;
    const zipCode = body && (body as any).zipCode;
    
    // Get JWT token from the authorization header
    const authHeader = req.headers.get('Authorization');
    
    // Initialize Supabase clients
    const { supabaseAdmin, supabase, supabaseUrl } = initSupabaseClients(authHeader);
    
    // Authenticate user
    let user;
    try {
      user = await authenticateUser(supabase);
    } catch (error) {
      return createErrorResponse(error.message, 401);
    }
    
    // Check if the user already has a phone number
    const existingNumber = await checkExistingPhoneNumber(supabase, user.id);
    if (existingNumber) {
      return createErrorResponse('User already has a phone number', 400);
    }
    
    // Get Twilio credentials
    const credentials = getTwilioCredentials();
    
    // Get base URL for webhook endpoints
    const webhookBaseUrl = Deno.env.get('FUNCTION_BASE_URL') || 
      `https://${supabaseUrl.replace('https://', '')}/functions/v1`;
    
    // Search for available phone numbers with provided parameters
    let phoneNumber;
    try {
      phoneNumber = await searchAvailablePhoneNumbers(credentials, { areaCode, zipCode });
    } catch (error) {
      return createErrorResponse(error.message, 404);
    }
    
    // Purchase the phone number
    let phoneData;
    try {
      phoneData = await purchasePhoneNumber(credentials, phoneNumber, user.id, webhookBaseUrl);
    } catch (error) {
      return createErrorResponse(error.message, 500);
    }
    
    // Save the phone number to our database
    let phoneNumberData;
    try {
      phoneNumberData = await savePhoneNumber(supabaseAdmin, user.id, phoneData);
    } catch (error) {
      return createErrorResponse(error.message, 500);
    }
    
    // Return the purchased phone number
    return createSuccessResponse({ 
      success: true, 
      phoneNumber: phoneNumberData 
    });
    
  } catch (error) {
    console.error('Error purchasing phone number:', error);
    return createErrorResponse(error.message);
  }
});
