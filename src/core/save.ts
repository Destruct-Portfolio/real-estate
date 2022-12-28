import fs from "fs";
import { Ad_Object } from "../types/index.js";
import Logger from "../misc/logger.js";


export class Save2 {
  private path = "../data/";
  private Logger = new Logger("Saver", "Saver");

  public async wrtieData(FileName: string, Ads: Ad_Object[]) {
    this.Logger.info(`Saving ${Ads.length} Ads to ${FileName} ... `);
    let Load_File: Ad_Object[] = await JSON.parse(
      fs.readFileSync(this.path + FileName + ".json").toString()
    );

    this.Logger.info(
      "Verifying if there is Duplicates Between the old and the new data ..."
    );

    for (let index = 0; index < Ads.length; index++) {
      if (
        !Load_File.some((item) => item.id === Ads[index].id)
      )
        Load_File.push(Ads[index]);
    }
    this.Logger.info("Saving the New Data into the File");
    fs.writeFileSync(this.path + FileName + ".json", JSON.stringify(Load_File));
    return;
  }
}
