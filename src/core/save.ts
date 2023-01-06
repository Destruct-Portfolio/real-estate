//@ts-nocheck
import fs from "fs";
import { Ad_Object } from "../types/index.js";
import Logger from "../misc/logger.js";


export default class Save2 {
  private path = "../data/";

  public wrtieData(FileName: string, Ads: Ad_Object[]) {
    // read The File 
    console.log(`From The Save Class ${Ads.length}`)

    let Load_File: Ad_Object[] = JSON.parse(
      fs.readFileSync(this.path + FileName + ".json").toString()
    );

    console.log(Load_File.length)

    if (Load_File.length === 0) {
      fs.writeFileSync(this.path + FileName + ".json", JSON.stringify(Ads))
    } else {
      for (const Ad of Ads) {
        if (Load_File.some((ID) => { ID.id === Ad.id })) {
          Load_File = [
            ...Load_File,
            Ad
          ]
        }
      }

      //console.log(Load_File)
      fs.writeFileSync(this.path + FileName + ".json", JSON.stringify(Load_File))
    }
    return 'Done'
  }
}

//console.log(new Save2().wrtieData("zida_updated", [])) // To See the Length of the File
