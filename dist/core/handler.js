import Zida_updated from "../componants/zida_updated.js";
export default class Handler {
    static scrapers = [
        /*    halou_updated,
        sas_updated,
        Nekretinine_updated, */
        Zida_updated
    ];
    static async exec() {
        for (const scraper of Handler.scrapers) {
            await new scraper().exec();
        }
    }
}
