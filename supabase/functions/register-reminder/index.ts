import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const { expoPushToken, reminderHour, reminderMinute } = await req.json();

  if (!expoPushToken?.startsWith("ExponentPushToken[")) {
    return new Response(JSON.stringify({ error: "Invalid token" }), { status: 400 });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { error } = await supabase.from("reminders").upsert(
    {
      expo_push_token: expoPushToken,
      reminder_hour: reminderHour,
      reminder_minute: reminderMinute,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "expo_push_token" }
  );

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
});
