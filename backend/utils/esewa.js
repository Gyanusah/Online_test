const buildEsewaCheckoutUrl = ({
  amount,
  transactionId,
  successUrl,
  failureUrl,
  merchantCode,
  mode = "sandbox",
}) => {
  const baseUrl =
    mode === "production"
      ? "https://esewa.com.np/epay/main"
      : "https://uat.esewa.com.np/epay/main";

  const params = new URLSearchParams({
    amt: String(amount),
    psc: "0",
    pdc: "0",
    txAmt: String(amount),
    tAmt: String(amount),
    pid: transactionId,
    scd: merchantCode,
    su: successUrl,
    fu: failureUrl,
  });

  return `${baseUrl}?${params.toString()}`;
};

module.exports = {
  buildEsewaCheckoutUrl,
};
