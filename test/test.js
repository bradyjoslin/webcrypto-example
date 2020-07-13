const test = require("ava");

const withPage = require("./_withPage");

const url = "http://localhost:5000";

test("page encrypts data", withPage, async (t, page) => {
  await page.goto(url);
  await page.$eval("#data", (el) => (el.value = "this is a secret"));
  page.on("dialog", async (dialog) => {
    dialog.accept("password");
    console.log(
      await page.evaluate(() => document.getElementById("encryptedData").value)
    );
  });
  await page.click("body > div:nth-child(1) > button");
  await page.waitFor(500);
  let encryptedVal = await page.evaluate(
    () => document.getElementById("encryptedData").value
  );
  t.true(encryptedVal != "");
});

test("page decrypts basic text", withPage, async (t, page) => {
  await page.goto(url);
  await page.$eval("#data", (el) => (el.value = "this is a secret"));
  page.on("dialog", async (dialog) => {
    dialog.accept("password");
  });
  await page.click("#encrypt");
  await page.waitFor(500);
  await page.click("#decrypt");
  await page.waitFor(500);
  let decryptedVal = await page.evaluate(
    () => document.getElementById("decrypted").value
  );
  t.true(decryptedVal == "this is a secret");
});

test("page decrypts text", withPage, async (t, page) => {
  await page.goto(url);
  await page.$eval(
    "#data",
    (el) =>
      (el.value =
        "this is a secret with emojis 🏂 and urls https://example.com")
  );
  page.on("dialog", async (dialog) => {
    dialog.accept("password");
  });
  await page.click("#encrypt");
  await page.waitFor(500);
  await page.click("#decrypt");
  await page.waitFor(500);
  let decryptedVal = await page.evaluate(
    () => document.getElementById("decrypted").value
  );
  t.true(
    decryptedVal ==
      "this is a secret with emojis 🏂 and urls https://example.com"
  );
});
