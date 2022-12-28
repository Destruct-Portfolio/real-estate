/* 
export class Handler {
  private halo: halooglasi;
  private Nekret: Nekretinine;
  private Sasomange: Sasomange;
  private Zida: Zida;

  constructor() {
    this.halo = new halooglasi();
    this.Nekret = new Nekretinine();
    this.Sasomange = new Sasomange();
    this.Zida = new Zida();
  }

  public async exec() {
    try {
      let halo = await this.halo.exec();
      //      await new Saver(halo, "HALO").exec();

      let nerker = await this.Nekret.exec();
      //      await new Saver(nerker, "Nerkretinine").exec();

      let Sas = await this.Sasomange.exec();
      //      await new Saver(Sas, "sassmonage").exec();

      let Zidan = await this.Zida.exec();
      //     await new Saver(Zidan, "Zida").exec();

      return;
    } catch (error) {
      console.log(error);
      return;
    }
  }
}
 */
import halou_updated from "src/componants/halooglasi_updated"
import Nekretinine_updated from "src/componants/nekretinine_updated"
import Sasomange from "src/componants/sasomange"
import Zida from "src/componants/zida2"

export default class Handler {
  private static scrapers = [
    halou_updated,
    Nekretinine_updated,
    Sasomange,
    Zida
  ]

  public static async exec() {
    for (const scraper of Handler.scrapers) {
      await new scraper().exec()
    }
  }
}