import fs from "fs";
import { Ad_Object } from "../types/index.js";
import lodash from "lodash";
import Logger from "../misc/logger.js";

export class Saver {
  private logger: Logger;

  private path: string;

  private payload: Ad_Object[];

  private old_data: Ad_Object[];

  constructor(payload: Ad_Object[], FileName: string) {
    this.path = "../data/" + FileName + ".json";

    this.payload = payload;

    this.old_data = [];

    this.logger = new Logger("Saver", "saver");
  }

  private async pull_Data(): Promise<void> {
    this.logger.info("Pulling the Old Data . . .");
    try {
      const data = await fs.readFileSync(this.path).toString();
      this.old_data = JSON.parse(data);
    } catch (error) {
      this.logger.info("Failed To Read File ads.json . . .");
      this.old_data = [];
    }
  }

  private async compareData() {
    this.logger.info("Comparing News ads with old ads . . .");
    let diff = lodash.isEqual(this.old_data, this.payload);
    return diff;
  }

  private async WriteData() {
    this.logger.info("Writing The New Ads in JSON . . . ");
    try {
      fs.writeFileSync(this.path, JSON.stringify(this.payload));
    } catch (error) {
      this.logger.error("Failed To write News ADS :: ==>");
      console.log(error);
    }
  }

  public async exec() {
    this.logger.info("Saving Data Process Starting ...");
    await this.pull_Data();
    let diff = await this.compareData();
    if (diff === true) {
      this.logger.info("No New ADS . . .");
      console.log("there is no Diff");
    } else {
      this.logger.info("Found New Ads . . .");
      await this.WriteData();
    }
  }
}

/* let Payload: Ad_Object[] = [
  {
    Number_Of_Rooms: "string",
    square_meters: "stringggg",
    property_location: "string",
    property_price: "string",
    article_url: "string",
    website_source: "string",
    property_pictures: ["string", "feahjfl"],
    PhoneNumber: "string",
  },
];

console.log(await new Saver(Payload, "neko").exec());
 */
