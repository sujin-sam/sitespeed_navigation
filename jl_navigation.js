const fse = require("fs-extra");

module.exports = async function (context, commands) {
  const webdriver = context.selenium.webdriver;
  const driver = context.selenium.driver;
  const until = webdriver.until;
  const By = webdriver.By;
  const Key = webdriver.Key;

  //try{

  await commands.measure.start("Home");
  await driver.get("https://www.johnlewis.com");
  await driver.wait(
    until.elementLocated(By.xpath("//*[text()='Allow all']")),
    15000
  );
  await commands.measure.stop();

  await driver.findElement(By.xpath("//*[text()='Allow all']")).click();

  await commands.wait.byTime(5000);

  const keywords = await fse.readJson("search-term.json");

  await driver
    .findElement(By.name("search-term"))
    .sendKeys(keywords.term[Math.floor(Math.random() * keywords.term.length)]);

  await commands.measure.start("Search");
  await driver
    .findElement(By.xpath("//button[@type='submit']"))
    .sendKeys(Key.ENTER);
  await commands.wait.byTime(10000);
  await commands.measure.stop();

  let productEle = await driver.findElements(
    By.xpath("//a[starts-with(@class, 'image_imageLink')]")
  );

  var productArray = [],
    i = 0;

  for (let e of productEle) {
    productArray[i] = await e.getAttribute("href");
    i++;
  }

  const productUrl =
    productArray[Math.floor(Math.random() * productArray.length)];

  await commands.measure.start("Product");
  await driver.get(productUrl);
  await driver.wait(
    until.elementLocated(By.xpath("//*[text()='Add to your basket']")),
    15000
  );
  await commands.measure.stop();

  //}
  // catch(e){
  //   await commands.error(productEle[0]);
  // }

  return commands.wait.byTime(10000);
};
