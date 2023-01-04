//@ts-nocheck
import fs from "fs";
import { Ad_Object } from "../types/index.js";
import Logger from "../misc/logger.js";
import { diff } from "deep-object-diff"

/* export default class Save2 {
  private path = "../data/";
  private Logger = new Logger("Saver", "Saver");

  public async wrtieData(FileName: string, Ads: Ad_Object[]) {
    this.Logger.info(`Saving ${Ads.length} Ads to ${FileName} ... `);

    let Load_File: Ad_Object[] = await JSON.parse(
      fs.readFileSync(this.path + FileName + ".json").toString()
    );

    const result: Ad_Object[] = [...Load_File, ...Ads]
    const T = Array.from(new Set(result))

    console.log(Load_File.length)

    this.Logger.info(
      "Verifying if there is Duplicates Between the old and the new data ..."
    );

    for (let index = 0; index < Ads.length; index++) {
      if (
        !Load_File.some((item) => item.id === Ads[index].id)
      )
        Load_File.push(Ads[index]);
    }

    const result5 = T.reduce((finnalArray, current) => {
      let obj = finnalArray.find((item) => { item.id === current.id })


      if (obj) {
        return finnalArray
      } else {
        return finnalArray.concat([current])
      }
    }, [])

    console.log(result5.length)

    console.log(T.length)

    const withLodash = lodash.uniq(T, "id")

    this.Logger.info("Saving the New Data into the File");

    console.log(withLodash.length)
    console.log(Load_File.length)

    fs.writeFileSync(this.path + FileName + ".json", JSON.stringify(result5));

    return;

  }

}
 */

export default class Save2 {
  private path = "../data/";

  public async wrtieData(FileName: string, Ads: Ad_Object[]) {
    // read The File 
    let Load_File: Ad_Object[] = await JSON.parse(
      fs.readFileSync(this.path + FileName + ".json").toString()
    );

    console.log(Load_File)

    let results: Ad_Object[] = []
    // we start Comparing Here 
    Ads.map((item) => {
      let t = Load_File.some((ID) => { ID.id === item.id })
      if (!t) {
        results.push(item)
      }
    })

    console.log(results)

    results.map((item) => {
      Load_File.push(item)
    })

    console.log(Load_File)
    fs.writeFileSync(this.path + FileName + ".json", JSON.stringify(Load_File))

    return
  }
}