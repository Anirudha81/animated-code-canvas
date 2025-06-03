
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface InterestNotificationRequest {
  projectId: string;
  projectTitle: string;
  projectOwnerEmail: string;
  interestedUserEmail: string;
  interestedUserContact: string;
  interestedUserId?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      projectId,
      projectTitle, 
      projectOwnerEmail, 
      interestedUserEmail, 
      interestedUserContact 
    }: InterestNotificationRequest = await req.json();

    if (!projectOwnerEmail) {
      return new Response(
        JSON.stringify({ error: "Project owner email not found" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const emailResponse = await resend.emails.send({
      from: "Khare Construction <onboarding@resend.dev>",
      to: [projectOwnerEmail],
      subject: `New Interest in Your Project: ${projectTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Someone is Interested in Your Project!</h1>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #555; margin-top: 0;">Project: ${projectTitle}</h2>
            <p style="color: #666;">You have received a new inquiry for your construction project.</p>
          </div>
          
          <div style="background-color: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <h3 style="color: #333; margin-top: 0;">Contact Information:</h3>
            <p><strong>Email:</strong> ${interestedUserEmail}</p>
            <p><strong>Contact Number:</strong> ${interestedUserContact}</p>
          </div>
          
          <div style="margin: 20px 0; padding: 15px; background-color: #e8f4fd; border-radius: 8px;">
            <p style="margin: 0; color: #0066cc;">
              <strong>Next Steps:</strong> Please reach out to this potential client using the contact information provided above to discuss your project details.
            </p>
          </div>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="color: #888; font-size: 12px;">
            This notification was sent from your Khare Construction project listing. 
            If you have any questions, please contact our support team.
          </p>
        </div>
      `,
    });

    console.log("Interest notification sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-interest-notification function:", error);
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
