import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";

Deno.serve(async (req) => {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${Deno.env.get("CRON_SECRET")}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const now = new Date();
  const hour = now.getUTCHours();
  const minute = now.getUTCMinutes();

  const { data: reminders, error } = await supabase
    .from("reminders")
    .select("expo_push_token")
    .eq("reminder_hour", hour)
    .eq("reminder_minute", minute);

  if (error || !reminders?.length) {
    return new Response(JSON.stringify({ sent: 0 }), { status: 200 });
  }

  const messages = reminders.map((r) => ({
    to: r.expo_push_token,
    title: "Pill reminder",
    body: "Did you take your pill today?",
    sound: "default",
  }));

  // Send in chunks of 100
  let totalSent = 0;
  for (let i = 0; i < messages.length; i += 100) {
    const chunk = messages.slice(i, i + 100);
    const res = await fetch(EXPO_PUSH_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(chunk),
    });
    if (res.ok) totalSent += chunk.length;
  }

  await supabase
    .from("reminders")
    .update({ last_sent_at: new Date().toISOString() })
    .eq("reminder_hour", hour)
    .eq("reminder_minute", minute);

  return new Response(JSON.stringify({ sent: totalSent }), { status: 200 });
});
