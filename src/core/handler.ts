import halou_updated from "../componants/halooglasi_updated.js"
import Nekretinine_updated from "../componants/nekretinine_updated.js"
import sas_updated from "../componants/sas_updated.js"
import { Ad_Object } from "src/types/index.js"
import Zida from "../componants/zida2.js"

export default class Handler {
  private static scrapers = [
    halou_updated,
    sas_updated,
    Nekretinine_updated,
    Zida
  ]

  public static async exec() {
    let results: Ad_Object[][] = []
    for (const scraper of Handler.scrapers) {
      results.push(await new scraper().exec())
    }
    return results
  }
}