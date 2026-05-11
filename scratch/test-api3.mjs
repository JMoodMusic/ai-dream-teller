import fetch from "node-fetch";

async function test() {
  const res = await fetch("http://localhost:3000/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      expertStyle: "freud",
      dreamContent: "테스트 꿈입니다.",
      includeImage: false,
      guestPhone: "010-9999-8888",
      guestPassword: "test"
    })
  });
  
  const text = await res.text();
  console.log("Status:", res.status);
  console.log("Body:", text);
}

test();
