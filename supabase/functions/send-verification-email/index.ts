
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface VerificationRequest {
  email: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { email }: VerificationRequest = await req.json();

    // Generate verification code using database function
    const { data: code, error: codeError } = await supabase
      .rpc('generate_verification_code', { user_email: email });

    if (codeError) {
      throw codeError;
    }

    console.log(`Generated verification code ${code} for ${email}`);

    // For demo purposes, we'll just log the code
    // In production, you would integrate with an email service like Resend
    console.log(`Verification code for ${email}: ${code}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Verification code sent",
        // In production, remove this line for security
        code: code 
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-verification-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
