//@ts-nocheck
import fs from "fs";
import { Ad_Object } from "../types/index.js";
import Logger from "../misc/logger.js";


export default class Save2 {
  private path = "../data/";

  public async wrtieData(FileName: string, Ads: Ad_Object[]) {
    // read The File 
    let Load_File: Ad_Object[] = await JSON.parse(
      fs.readFileSync(this.path + FileName + ".json").toString()
    );

  
    // let results: Ad_Object[] = []
    // // we start Comparing Here 
    // Ads.map((item) => {
    //   let t = Load_File.some((ID) => { ID.id === item.id })
    //   if (!t) {
    //     results.push(item)
    //   }
    // })

    
    // results.map((item) => {
    //   Load_File.push(item)
    // })

    for(const Ad of Ads){
      if(Load_File.some((ID) => { ID.id === Ad.id })){
        Load_File = [
          ...Load_File,
          Ad
        ]
      }
    }

    console.log(Load_File)
    fs.writeFileSync(this.path + FileName + ".json", JSON.stringify(Load_File))

    return
  }
}