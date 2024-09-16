import { createClient } from "@supabase/supabase-js";

Deno.serve(async (_req) => {
  try {
    // Get environment variables from the request context
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing environment variables");
    }

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Update all tasks, setting is_completed to false
    const { data, error } = await supabase
      .from("tasks")
      .update({ is_completed: false })
      .neq("is_completed", false);

    if (error) throw error;

    return new Response(
      JSON.stringify({
        message: "Daily tasks reset successfully",
        data: data,
      }),
      {
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
});
