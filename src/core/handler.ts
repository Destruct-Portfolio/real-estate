import halou_updated from "../componants/halooglasi_updated.js"
import Nekretinine_updated from "../componants/nekretinine_updated.js"
import Zida_updated from "../componants/zida_updated.js"
import sas_updated from "../componants/sas_updated.js"

export default class Handler {
  private static scrapers = [
    /*    halou_updated,
    sas_updated,
    Nekretinine_updated, */
    Zida_updated
  ]

  public static async exec() {
    for (const scraper of Handler.scrapers) {
      await new scraper().exec()
    }
  }
}