import app from "./app";

const PORT = process.env.PAYMENT_GATEWAY_PORT || 4000;

app.listen(PORT, () => {
  console.log(`Fake Payment Gateway running on port ${PORT}`);
});
