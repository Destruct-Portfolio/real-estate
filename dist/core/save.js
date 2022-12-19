import fs from "fs";
import Logger from "../misc/logger.js";
export class Save2 {
    path = "../data/";
    Logger = new Logger("Saver", "Saver");
    async wrtieData(FileName, Ads) {
        this.Logger.info(`Saving ${Ads.length} Ads to ${FileName} ... `);
        let Load_File = await JSON.parse(fs.readFileSync(this.path + FileName + ".json").toString());
        this.Logger.info("Verifying if there is Duplicates Between the old and the new data ...");
        for (let index = 0; index < Ads.length; index++) {
            if (!Load_File.some((item) => item.article_url === Ads[index].article_url))
                Load_File.push(Ads[index]);
        }
        this.Logger.info("Saving the New Data into the File");
        fs.writeFileSync(this.path + FileName + ".json", JSON.stringify(Load_File));
        return;
    }
}
