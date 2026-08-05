const User = require("../models/User");

const isSubscriptionActive = (subscription) => {
  if (!subscription) return false;
  if (subscription.status !== "active") return false;
  if (!subscription.expiryDate) return false;
  return new Date(subscription.expiryDate) > new Date();
};

const getActiveSubscriptions = (user) => {
  if (!user || !Array.isArray(user.subscribedLanguages)) return [];
  return user.subscribedLanguages.filter(isSubscriptionActive);
};

const expireUserSubscriptions = async (user) => {
  if (!user) return false;
  const now = new Date();
  let changed = false;

  if (Array.isArray(user.subscribedLanguages)) {
    user.subscribedLanguages.forEach((sub) => {
      if (
        sub &&
        sub.status === "active" &&
        sub.expiryDate &&
        new Date(sub.expiryDate) <= now
      ) {
        sub.status = "expired";
        changed = true;
      }
    });
  }

  const hasAnyActive = getActiveSubscriptions(user).length > 0;
  if (!hasAnyActive && user.subscriptionStatus === "active") {
    user.subscriptionStatus = "expired";
    changed = true;
  }

  if (changed && typeof user.save === "function") {
    await user.save();
  }

  return changed;
};

const requireActiveSubscription = async (req, res, next) => {
  const user = req.user;
  const isActive = Array.isArray(user.subscribedLanguages)
    ? user.subscribedLanguages.some((sub) => isSubscriptionActive(sub))
    : false;

  if (!isActive) {
    return res.status(403).json({
      success: false,
      message:
        "An active subscription is required to access this resource. Please subscribe to a language.",
    });
  }

  next();
};

const requireLanguageSubscription = async (req, res, next) => {
  const user = req.user;
  const { languageId, language, testId } = req.body;
  const requestedLanguageId = languageId || req.params.languageId;

  const activeSubs = getActiveSubscriptions(user);
  if (activeSubs.length === 0) {
    return res.status(403).json({
      success: false,
      message:
        "You must have an active language subscription to access this resource.",
    });
  }

  if (!requestedLanguageId && !language && !testId) {
    req.activeSubscriptions = activeSubs;
    return next();
  }

  const matches = activeSubs.some((sub) => {
    if (requestedLanguageId && sub.languageId) {
      return sub.languageId.toString() === requestedLanguageId.toString();
    }
    if (language) {
      return (
        String(sub.languageName).trim().toLowerCase() ===
          String(language).trim().toLowerCase() ||
        String(sub.level).trim().toLowerCase() ===
          String(language).trim().toLowerCase()
      );
    }
    return false;
  });

  if (!matches) {
    return res.status(403).json({
      success: false,
      message:
        "Your active subscription does not include this language. Please subscribe to access it.",
    });
  }

  req.activeSubscriptions = activeSubs;
  next();
};

module.exports = {
  isSubscriptionActive,
  getActiveSubscriptions,
  expireUserSubscriptions,
  requireActiveSubscription,
  requireLanguageSubscription,
};
