import Zida from "../componants/zida2.js";
import sas_updated from "../componants/sas_updated.js";
export default class Handler {
    static scrapers = [
        /*    halou_updated,
           Nekretinine_updated, */
        sas_updated,
        Zida
    ];
    static async exec() {
        for (const scraper of Handler.scrapers) {
            await new scraper().exec();
        }
    }
}
