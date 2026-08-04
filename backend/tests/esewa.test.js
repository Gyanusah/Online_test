const test = require("node:test");
const assert = require("node:assert/strict");
const { buildEsewaCheckoutUrl } = require("../utils/esewa");

test("buildEsewaCheckoutUrl includes merchant and callback params", () => {
  const url = buildEsewaCheckoutUrl({
    amount: 800,
    transactionId: "ESW-123",
    successUrl: "http://localhost:5173/student/subscription?payment=success",
    failureUrl: "http://localhost:5173/student/subscription?payment=failed",
    merchantCode: "EPAYTEST",
    mode: "sandbox",
  });

  assert.match(url, /scd=EPAYTEST/);
  assert.match(url, /amt=800/);
  assert.match(url, /pid=ESW-123/);
  assert.match(
    url,
    /su=http%3A%2F%2Flocalhost%3A5173%2Fstudent%2Fsubscription%3Fpayment%3Dsuccess/,
  );
  assert.match(
    url,
    /fu=http%3A%2F%2Flocalhost%3A5173%2Fstudent%2Fsubscription%3Fpayment%3Dfailed/,
  );
});
