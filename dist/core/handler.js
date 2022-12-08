"use strict";
/* import { halooglasi } from "../componants/halooglasi.js";
import { Nekretinine } from "../componants/nekretinine.js";
import { Sasomange } from "../componants/sasomange.js";
import { Zida } from "../componants/zida.js";
import { Saver } from "./save.js";

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
      await new Saver(halo, "HALO").exec();

      let nerker = await this.Nekret.exec();
      await new Saver(nerker, "Nerkretinine").exec();

      let Sas = await this.Sasomange.exec();
      await new Saver(Sas, "sassmonage").exec();

      let Zidan = await this.Zida.exec();
      await new Saver(Zidan, "Zida").exec();
      return;
    } catch (error) {
      console.log(error);
      return;
    }
  }
}
 */
