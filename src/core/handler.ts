import halou_updated from "../componants/halooglasi_updated.js"
import Nekretinine_updated from "../componants/nekretinine_updated.js"
import Sasomange from "../componants/sasomange.js"
import Zida from "../componants/zida2.js"
import sas_updated from "src/componants/sas_updated.js"

export default class Handler {
  private static scrapers = [
    /*    halou_updated,
       Nekretinine_updated, */
    sas_updated,
    Zida
  ]

  public static async exec() {
    for (const scraper of Handler.scrapers) {
      await new scraper().exec()
    }
  }
}