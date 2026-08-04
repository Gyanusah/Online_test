const test = require("node:test");
const assert = require("node:assert/strict");
const { shouldAllowUnlimitedAttempts } = require("../utils/examAccess");

test("active subscription allows unlimited attempts during validity", () => {
  const result = shouldAllowUnlimitedAttempts(
    {
      subscriptionStatus: "active",
      subscriptionExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    999,
    3,
  );

  assert.equal(result, true);
});

test("expired subscription does not bypass attempt limits", () => {
  const result = shouldAllowUnlimitedAttempts(
    {
      role: "student",
      subscriptionStatus: "active",
      subscriptionExpiresAt: new Date(Date.now() - 1000),
    },
    3,
    3,
  );

  assert.equal(result, false);
});

test("inactive subscription still respects attempt limits", () => {
  const result = shouldAllowUnlimitedAttempts(
    {
      role: "student",
      subscriptionStatus: "pending",
      subscriptionExpiresAt: null,
    },
    3,
    3,
  );

  assert.equal(result, false);
});
