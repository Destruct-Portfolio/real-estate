//@ts-nocheck
import fs from "fs";
import { Ad_Object } from "../types/index.js";

/* export default class Save2 {
  private path = "../data/";

  public wrtieData(FileName: string, Ads: Ad_Object[]) {
    // read The File
    console.log(`From The Save Class ${Ads.length}`)

    let Load_File: Ad_Object[] = JSON.parse(
      fs.readFileSync(this.path + FileName + ".json").toString()
    );

    console.log(Load_File.length)

    if (Load_File.length === 0) {
      fs.writeFileSync(this.path + FileName + ".json", JSON.stringify(Ads))
    } else {
      for (const Ad of Ads) {
        if (Load_File.some((ID) => { ID.id === Ad.id })) {
          Load_File = [
            ...Load_File,
            Ad
          ]
        }
      }

      //console.log(Load_File)
      fs.writeFileSync(this.path + FileName + ".json", JSON.stringify(Load_File))
    }
    return 'Done'
  }
} */


export default class Check_save {
  private path = '../data/'
  public Exists(FileName: string, AD: { id: string }) {
    let LoadFile2: Ad_Object[] = fs.readFileSync(`${this.path}/${FileName}.json`)
    let data = JSON.parse(LoadFile2)
    if (data.length === 0) return false
    let find = data.filter((i) => { if (i.id === AD.id) return i })
    if (find.length > 0) {
      return true
    } else {
      return false
    }
  }


  public async Write(FileName: string, AD: Ad_Object): void {
    try {
      let LoadFile = fs.readFileSync(`${this.path}/${FileName}.json`)
      let data = JSON.parse(LoadFile)
      fs.writeFileSync(`${this.path}/${FileName}.json`, JSON.stringify([...data, AD]))
      console.log(`New Object TO DB WITH ID :: ${AD.id} Added`)
    } catch (err) {
      console.log(err)
    }
  }
}

/* let t = {
  "property_location": "Vuka Karadžića 31 Mladenovac centar Mladenovac opština Beograd",
  "Number_Of_Rooms": "3 sobe",
  "square_meters": "80 m²",
  "property_price": "56000",
  "article_url": "https://www.4zida.rs/prodaja/stanovi/beograd/oglas/vuka-karadzica-31/5aee134aadb11459fc36e493",
  "website_source": "https://www.4zida.rs/prodaja-stanova/beograd?lista_fizickih_lica=&strana=",
  "property_pictures": [
    "https://resizer.4zida.rs/xdQqg7yYZeg8uzBs2HM8WUA3dtJ1-S19Fr4JJN9oM_A/fit/1920/1080/ce/0/bG9jYWw6Ly8vNWFlZTEzNGFhZGIxMTQ1OWZjMzZlNDkzL2VkMmYyZWIzMWM.jpeg",
    "https://resizer.4zida.rs/iM9Gv-tShkCCJbwm0TgxquCCC-g8tN_VU9ccu2CfKgg/fit/1920/1080/ce/0/bG9jYWw6Ly8vNWFlZTEzNGFhZGIxMTQ1OWZjMzZlNDkzL2Q2Y2NjNGRiNTk.jpeg",
    "https://resizer.4zida.rs/8bcjGnJ1RGhS-jAM2V9zUI8MeIatDyja6zb7LVUqjmY/fit/1920/1080/ce/0/bG9jYWw6Ly8vNWFlZTEzNGFhZGIxMTQ1OWZjMzZlNDkzLzYxOGRiOGQ5OWY.jpeg",
    "https://resizer.4zida.rs/QZnUpoV_SW-QQHeC9e4AT7JdO52dr7_NfgMmdTmQ16Y/fit/1920/1080/ce/0/bG9jYWw6Ly8vNWFlZTEzNGFhZGIxMTQ1OWZjMzZlNDkzLzkwOWY3ODE3MmU.jpeg",
    "https://resizer.4zida.rs/_UZHqmM_lH87BrtDqtSyJsMwC63xse-ulqhcU9RNClM/fit/1920/1080/ce/0/bG9jYWw6Ly8vNWFlZTEzNGFhZGIxMTQ1OWZjMzZlNDkzLzkxYjAwOWIwZDA.jpeg",
    "https://resizer.4zida.rs/1-_rhAZ1Ccret2QA9T2qiY4-KXkN7LF3pbU3xzLjk9g/fit/1920/1080/ce/0/bG9jYWw6Ly8vNWFlZTEzNGFhZGIxMTQ1OWZjMzZlNDkzLzJlZTA1MDQxMzk.jpeg",
    "https://resizer.4zida.rs/9zXIhuM5Qufb36LPqcMFGqaMaQAkEQSuyeU3x5jjjv8/fit/1920/1080/ce/0/bG9jYWw6Ly8vNWFlZTEzNGFhZGIxMTQ1OWZjMzZlNDkzLzk5Y2RhYmM0NjY.jpeg",
    "https://resizer.4zida.rs/tAQvYZnCtuB24cSSUdmsiyupm9fw5AkK13-hdFO_F50/fit/1920/1080/ce/0/bG9jYWw6Ly8vNWFlZTEzNGFhZGIxMTQ1OWZjMzZlNDkzLzEwNTBhZGE2N2Q.jpeg",
    "https://resizer.4zida.rs/uWHuFHqPugIj7MNQWxpLZ7o4ocKf5TVIWIwT-d3oyeg/fit/1920/1080/ce/0/bG9jYWw6Ly8vNWFlZTEzNGFhZGIxMTQ1OWZjMzZlNDkzLzAwZDEwYmMzZDc.jpeg",
    "https://resizer.4zida.rs/V-zl8wdvXksu11Jzjvi1CviMiZebyl8S8KvJ4yzuvdM/fit/1920/1080/ce/0/bG9jYWw6Ly8vNWFlZTEzNGFhZGIxMTQ1OWZjMzZlNDkzLzhjZmU2YzdkMjM.jpeg",
    "https://resizer.4zida.rs/NRtT-HdjwIzmkfTW4Rso_xo9VLJ0E4K7oGDaocq9rOI/fit/1920/1080/ce/0/bG9jYWw6Ly8vNWFlZTEzNGFhZGIxMTQ1OWZjMzZlNDkzLzRhN2Q0OWQwMjU.jpeg",
    "https://resizer.4zida.rs/KEeDB6ElXrRLufaBzccWOH79OG7Yr1ifNv1W2s0mFvc/fit/1920/1080/ce/0/bG9jYWw6Ly8vNWFlZTEzNGFhZGIxMTQ1OWZjMzZlNDkzLzYyYWE2YTE1YWE.jpeg",
    "https://resizer.4zida.rs/73uaRWgy83nk8vECwA4YQcEh2oqnfpy0XxqtMuDBmiE/fit/1920/1080/ce/0/bG9jYWw6Ly8vNWFlZTEzNGFhZGIxMTQ1OWZjMzZlNDkzLzA0OTEwMjE4MmI.jpeg",
    "https://resizer.4zida.rs/4Vd6GnnTTvZH_FpVdIrLpgizqGnvaoZkKjWmSCZGjRw/fit/1920/1080/ce/0/bG9jYWw6Ly8vNWFlZTEzNGFhZGIxMTQ1OWZjMzZlNDkzLzdkMjIyNmFkZjQ.jpeg",
    "https://resizer.4zida.rs/D05YraNM3hOv-mTEdzQ6Ypw-zt0yC-D-NNFEAxZossc/fit/1920/1080/ce/0/bG9jYWw6Ly8vNWFlZTEzNGFhZGIxMTQ1OWZjMzZlNDkzL2IwYmU2Zjg3MTc.jpeg",
    "https://resizer.4zida.rs/g7n1YZrq2hoSiAh4pCwVe5b6DQkfrT9BT8-U3PDeU4M/fit/1920/1080/ce/0/bG9jYWw6Ly8vNWFlZTEzNGFhZGIxMTQ1OWZjMzZlNDkzL2U4NzBjMzgxNjI.jpeg",
    "https://resizer.4zida.rs/bZrgs1MoCAsAPQJDq28dNC67vvBEIexyJcr4yEcZSAU/fit/1920/1080/ce/0/bG9jYWw6Ly8vNWFlZTEzNGFhZGIxMTQ1OWZjMzZlNDkzL2I2M2IxNmVkNTM.jpeg",
    "https://resizer.4zida.rs/yGHQ_plStpc4DlJc8vMYj7uZGnfxhO27FMj2-4gs9XI/fit/1920/1080/ce/0/bG9jYWw6Ly8vNWFlZTEzNGFhZGIxMTQ1OWZjMzZlNDkzLzA0MTNkN2ZmYmY.jpeg",
    "https://resizer.4zida.rs/LN41Of4U_TNd1U1DaxXUQn3p15v0JeXst1WAEB-Vxzc/fit/1920/1080/ce/0/bG9jYWw6Ly8vNWFlZTEzNGFhZGIxMTQ1OWZjMzZlNDkzLzU4YTg5ODM4MmM.jpeg",
    "https://resizer.4zida.rs/ZzRNWCA_rqDaRTEFdoOsV9BQVUeJS6oVd4bFyH5WPn4/fit/1920/1080/ce/0/bG9jYWw6Ly8vNWFlZTEzNGFhZGIxMTQ1OWZjMzZlNDkzLzQ2ZTQyNTQ4NzM.jpeg",
    "https://resizer.4zida.rs/wQr0_0FTMR7_s7KcBot3tuzF-B-CVsDowM_W4rNcr40/fit/1920/1080/ce/0/bG9jYWw6Ly8vNWFlZTEzNGFhZGIxMTQ1OWZjMzZlNDkzL2RlZGI4NWRmNWY.jpeg",
    "https://resizer.4zida.rs/rQo965p1567r7HqTQRNhFEwDbCzrmwGJX2Jde24frK8/fit/1920/1080/ce/0/bG9jYWw6Ly8vNWFlZTEzNGFhZGIxMTQ1OWZjMzZlNDkzL2U3YjUxY2JmMDg.jpeg",
    "https://resizer.4zida.rs/c7w276E_kFu6ocLb9b2Zg5Ro7yznVeYXzFdI8yt3Ub0/fit/1920/1080/ce/0/bG9jYWw6Ly8vNWFlZTEzNGFhZGIxMTQ1OWZjMzZlNDkzL2Y0ZGEwYmY3NDQ.jpeg",
    "https://resizer.4zida.rs/VDSR-TO01OSmqR6Qj3gzDwJpYfGfrIbJiD4Pzf3z7yQ/fit/1920/1080/ce/0/bG9jYWw6Ly8vNWFlZTEzNGFhZGIxMTQ1OWZjMzZlNDkzLzI2MDI3NjZlYmM.jpeg"
  ],
  "PhoneNumber": "060 6303391",
  "id": "5e2f558f0c7cde6d0366db83feafeafeafeafea"
}

console.log(await new check_save().Write("zida_updated", t)) */