const express = require("express");

const USERNAME = ""; // Username provided by Nemuru
const PASSWORD = ""; // Password provided by Nemuru
const YOUR_DOMAIN = "http://localhost:4000";
const NEMURU_API_URL = "https://api.stg.nemuru.io/api/v2";

if (!USERNAME || !PASSWORD) {
  console.error("Please provide a username and password");
  process.exit(1);
}

const app = express();
app.use(express.static("public"));

app.post("/create-order", async (req, res) => {
  const auth = await fetch(`${NEMURU_API_URL}/auth/login/`, {
    method: "POST",
    body: JSON.stringify({ username: USERNAME, password: PASSWORD }),
  });
  const { access_token } = await auth.json();

  const order = await fetch(`${NEMURU_API_URL}/order/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
    },
    body: JSON.stringify({
      product: "instalments",
      merchant: {
        order_reference_1: "7QuHQ5WVQQqyWVPW",
        notification_url: `${YOUR_DOMAIN}/notification`,
      },
      customer: {
        first_name: "Ramon",
        last_name: "Borras Pinilla",
        locale: "es-ES",
        ip_address: "192.0.2.146",
        user_agent:
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36",
      },
      cart: {
        total_price_with_tax: 875,
        currency: "EUR",
        items: [
          {
            article: {
              name: "KIVIK 3-seat sofa",
              type: "product",
              category: "physical",
              reference: "4912345678904",
              unit_price_with_tax: 875,
            },
            units: 1,
            total_price_with_tax: 875,
          },
        ],
      },
    }),
  });

  const order_id = order.headers.get("Id");

  res.json({ access_token, order_id });
});

app.listen(4000, () => console.log("Running on port 4000"));
