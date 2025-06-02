
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';
import { Resend } from 'npm:resend@2.0.0';

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

    const resend = new Resend(Deno.env.get('RESEND_API_KEY') ?? '');

    const { email }: VerificationRequest = await req.json();

    // Generate verification code using database function
    const { data: code, error: codeError } = await supabase
      .rpc('generate_verification_code', { user_email: email });

    if (codeError) {
      throw codeError;
    }

    console.log(`Generated verification code ${code} for ${email}`);

    // Send actual email using Resend
    const emailResult = await resend.emails.send({
      from: 'Khare Construction <onboarding@resend.dev>',
      to: [email],
      subject: 'Your Verification Code - Khare Construction',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333; text-align: center;">Khare Construction</h1>
          <h2 style="color: #666;">Your Verification Code</h2>
          <p>Hello,</p>
          <p>Your verification code is:</p>
          <div style="background-color: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; color: #333; letter-spacing: 8px;">${code}</span>
          </div>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
          <p>Best regards,<br>Khare Construction Team</p>
        </div>
      `
    });

    if (emailResult.error) {
      console.error('Email sending failed:', emailResult.error);
      throw new Error('Failed to send email');
    }

    console.log('Email sent successfully:', emailResult.data);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Verification code sent to your email",
        // Remove code from response for security in production
        // code: code 
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
