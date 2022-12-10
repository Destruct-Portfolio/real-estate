import { Handler } from "./core/handler.js";
import schedule from "node-schedule";

//Igniter
class Index {
  public static async start() {
    let scraped_news = await new Handler().exec();
  }
}

//Time Config
const TimeConfig = new schedule.RecurrenceRule();

TimeConfig.dayOfWeek = [0, new schedule.Range(0, 6)];

TimeConfig.hour = 8;

TimeConfig.minute = 0;

console.log("STARTED ...");

await Index.start();

//lights
var job = schedule.scheduleJob(TimeConfig, async () => {
  await Index.start();
});
