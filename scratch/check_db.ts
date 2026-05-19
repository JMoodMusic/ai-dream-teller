import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

async function main() {
  const { data: order } = await supabase.rpc("get_order_by_number", { p_order_number: "ord_1779176092840_u1dw4qr" }).single();
  console.log("Order:", order);
  if (order && (order as any).id) {
    const { data: dream } = await supabase.from("dreams").select("*").eq("order_id", (order as any).id).single();
    console.log("Dream:", dream);
  }
}
main();
