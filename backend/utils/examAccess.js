const shouldAllowUnlimitedAttempts = (student, maxAttempts, attemptCount) => {
  const hasActiveSubscription =
    student?.role === "student" &&
    student.subscriptionStatus === "active" &&
    (!student.subscriptionExpiresAt ||
      new Date(student.subscriptionExpiresAt) > new Date());

  if (hasActiveSubscription) {
    return true;
  }

  return attemptCount < maxAttempts;
};

module.exports = {
  shouldAllowUnlimitedAttempts,
};
