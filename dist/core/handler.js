import Sasomange from "../componants/sasomange.js";
import Zida from "../componants/zida2.js";
export default class Handler {
    static scrapers = [
        /*    halou_updated,
           Nekretinine_updated, */
        Sasomange,
        Zida
    ];
    static async exec() {
        for (const scraper of Handler.scrapers) {
            await new scraper().exec();
        }
    }
}
