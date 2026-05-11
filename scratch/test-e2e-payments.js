const http = require('http');

async function request(path, method, body = null) {
  return new Promise((resolve, reject) => {
    // URL Encode path if needed
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: encodeURI(path),
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });
    
    req.on('error', error => reject(error));
    
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log("Starting E2E Tests for Orders & Payments on port 3001...");
  let orderId;

  // Test 1: 비정상 금액
  console.log("\\n[Test 1] 비정상 금액: 클라이언트가 금액을 변조해서 전송 시도");
  const t1 = await request('/api/orders', 'POST', {
    expertStyle: "Saju",
    dreamContent: "I dreamt of flying",
    includeImage: false,
    guestPhone: "01099998888",
    guestPassword: "testpassword",
    total_amount: 0 // Malicious
  });
  console.log(`Status: ${t1.status}, Calculated Amount: ${t1.data?.amount}`);
  if (t1.status === 200 && t1.data.amount === 1500) {
    console.log("=> Pass: Server ignored client amount and calculated 1500.");
  } else {
    console.log("=> Fail");
  }

  // Test 2: 비회원 인증 실패
  console.log("\\n[Test 2] 비회원 인증 실패: 기존에 가입한 번호로 틀린 비밀번호 전송 시도");
  const t2 = await request('/api/orders', 'POST', {
    expertStyle: "Tarot",
    dreamContent: "I dreamt of falling",
    includeImage: false,
    guestPhone: "01099998888", // From T1
    guestPassword: "wrongpassword"
  });
  console.log(`Status: ${t2.status}, Message: ${t2.data?.message}`);
  if (t2.status === 401) {
    console.log("=> Pass: Returned 401 Unauthorized.");
  } else {
    console.log("=> Fail");
  }

  // Test 3: 결제 검증 (Webhook / Confirm) - amount mismatch
  console.log("\\n[Test 3] 결제 검증: confirm API에 DB와 다른 금액 요청 시도");
  orderId = t1.data?.orderId;
  if (!orderId) {
    console.log("=> Skip Test 3, 4, 5 because Test 1 failed.");
    return;
  }
  const t3 = await request('/api/payments/toss/confirm', 'POST', {
    paymentKey: "fake_payment_key",
    orderId: orderId,
    amount: 1000 // DB has 1500
  });
  console.log(`Status: ${t3.status}, Message: ${t3.data?.message}`);
  if (t3.status === 400 && t3.data.message.includes("Amount mismatch")) {
    console.log("=> Pass: Amount mismatch caught.");
  } else {
    console.log("=> Fail");
  }

  // Test 4: 결제 실패 업데이트
  console.log("\\n[Test 4] 결제 실패 업데이트: fail 라우트 호출 시 DB 상태 FAILED로 변경");
  const t4 = await request(`/api/payments/toss/fail?code=USER_CANCEL&message=취소&orderId=${orderId}`, 'GET');
  console.log(`Status: ${t4.status}`);
  
  // Test 5: 가주문 유효성 검증
  console.log("\\n[Test 5] 가주문 유효성 검증: FAILED 상태의 주문을 다시 confirm 시도");
  // We need to implement the 'FAILED' check in confirm API to make this pass properly.
  // Wait, let's see what happens without it.
  const t5 = await request('/api/payments/toss/confirm', 'POST', {
    paymentKey: "fake_payment_key",
    orderId: orderId,
    amount: 1500 
  });
  console.log(`Status: ${t5.status}, Message: ${t5.data?.message}`);
}

runTests().catch(console.error);
