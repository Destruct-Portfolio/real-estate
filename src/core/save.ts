import fs from "fs";
import { Ad_Object } from "../types/index.js";
import Logger from "../misc/logger.js";
import lodash, { result } from "lodash"


export class Save2 {
  private path = "../data/";
  private Logger = new Logger("Saver", "Saver");

  public async wrtieData(FileName: string, Ads: Ad_Object[]) {
    this.Logger.info(`Saving ${Ads.length} Ads to ${FileName} ... `);
    let Load_File: Ad_Object[] = await JSON.parse(
      fs.readFileSync(this.path + FileName + ".json").toString()
    );

    this.Logger.info(
      "Verifying if there is Duplicates Between the old and the new data ..."
    );

    for (let index = 0; index < Ads.length; index++) {
      if (
        !Load_File.some((item) => item.article_url === Ads[index].article_url)
      )
        Load_File.push(Ads[index]);
    }
    this.Logger.info("Saving the New Data into the File");
    fs.writeFileSync(this.path + FileName + ".json", JSON.stringify(Load_File));
    return;
  }
}

/* class ObjectList {
  private objects: object[];

  constructor(filePath: string) {
    this.objects = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    console.log(this.objects.length)
  }

  compareList(newObjects: object[]): object[] {
    const difference = [];

    for (const newObject of newObjects) {
      if (!this.objects.includes(newObject)) {
        difference.push(newObject);
      }
    }

    return difference;
  }
} */

//const objectList = new ObjectList('../data/nek2.json');

const new_DATA = [
  {
    "property_location": "undefined Gradske lokacije Vrnjačka Banja",
    "Number_Of_Rooms": "0.5 soba",
    "square_meters": "31 m²",
    "property_price": "59000",
    "article_url": "https://www.4zida.rs/prodaja/stanovi/vrnjacka-banja/oglas/gradske-lokacije/638dabe58f02075e8c0bd67d",
    "website_source": "https://www.4zida.rs/prodaja-stanova?lista_fizickih_lica=1&strana=",
    "property_pictures": [
      "https://resizer.4zida.rs/1NItvBpjiOG9IRoUFgzZSkXeeH1hkoLffnbjM4OXAO8/fit/1920/1080/ce/0/bG9jYWw6Ly8vNjM4ZGFiZTU4ZjAyMDc1ZThjMGJkNjdkLzY1OTk5NTU5MTQ.jpeg",
      "https://resizer.4zida.rs/sgdpw190I54TAZNrBCfGE-3IBjM20rUUaSg8PCr_4-A/fit/1920/1080/ce/0/bG9jYWw6Ly8vNjM4ZGFiZTU4ZjAyMDc1ZThjMGJkNjdkLzc3NDkzNTA0Y2M.jpeg",
      "https://resizer.4zida.rs/YmnlYqk6ZfK-BbXTXoqsj_pfwWYFp8UtGZZcHGzrQP4/fit/1920/1080/ce/0/bG9jYWw6Ly8vNjM4ZGFiZTU4ZjAyMDc1ZThjMGJkNjdkLzY0MWU5NDFjODQ.jpeg",
      "https://resizer.4zida.rs/hlUkTGtk5XvWgOwTF3OI6mKN-18cDbhVANF859ymY4s/fit/1920/1080/ce/0/bG9jYWw6Ly8vNjM4ZGFiZTU4ZjAyMDc1ZThjMGJkNjdkLzRmYzBhNTdhMWM.jpeg",
      "https://resizer.4zida.rs/Nk-yYNyPtzmOkoYhhwOiLEQQGtrl-iewbjRHMv6BXZI/fit/1920/1080/ce/0/bG9jYWw6Ly8vNjM4ZGFiZTU4ZjAyMDc1ZThjMGJkNjdkLzM2ODI0ZDczZjE.jpeg",
      "https://resizer.4zida.rs/MPb7dyr2g2t3vSBbSfIpS8WZdj9e42cW3F_BmKyq7Uo/fit/1920/1080/ce/0/bG9jYWw6Ly8vNjM4ZGFiZTU4ZjAyMDc1ZThjMGJkNjdkL2FjNDlhMmUzMzM.jpeg",
      "https://resizer.4zida.rs/I4iOfEUdIMiw3Tem_7c9Ha0vPoE9Ydh_QSx7QbyD7J8/fit/1920/1080/ce/0/bG9jYWw6Ly8vNjM4ZGFiZTU4ZjAyMDc1ZThjMGJkNjdkL2FmOTcyNzVkZDk.jpeg",
      "https://resizer.4zida.rs/mbAdrZu8w7ryNYP9qnc1LJLSDX9kuA1TISIVjXtUDUI/fit/1920/1080/ce/0/bG9jYWw6Ly8vNjM4ZGFiZTU4ZjAyMDc1ZThjMGJkNjdkLzg0OTBjNGNjNjI.jpeg",
      "https://resizer.4zida.rs/lD3Is87BFKcE9ABgqHN4ezbjadqLcV7EBaUTUyhM5yo/fit/1920/1080/ce/0/bG9jYWw6Ly8vNjM4ZGFiZTU4ZjAyMDc1ZThjMGJkNjdkL2JkYmU4Mjk2Nzk.jpeg",
      "https://resizer.4zida.rs/HwGCjWzrlv737hXJ0jifgt7TixAgKgXOgpndR3FYKAI/fit/1920/1080/ce/0/bG9jYWw6Ly8vNjM4ZGFiZTU4ZjAyMDc1ZThjMGJkNjdkL2M2ZjdlN2YwNGQ.jpeg"
    ],
    "PhoneNumber": "064 5884649"
  },
  {
    "property_location": "Bulevar Patrijarha Pavla 1A Liman 4 Liman Gradske lokacije Novi Sad",
    "Number_Of_Rooms": "4 sobe",
    "square_meters": "91 m²",
    "property_price": "180000",
    "article_url": "https://www.4zida.rs/prodaja/stanovi/novi-sad/oglas/bulevar-patrijarha-pavla-1a/635545def08abc3ada0f91a9",
    "website_source": "https://www.4zida.rs/prodaja-stanova?lista_fizickih_lica=1&strana=",
    "property_pictures": [
      "https://resizer.4zida.rs/AiEs7xuX2lKM4H4JZe3PlAHXrTHlvzu9JbgpGCBHOhQ/fit/1920/1080/ce/0/bG9jYWw6Ly8vNjM1NTQ1ZGVmMDhhYmMzYWRhMGY5MWE5L2E0MGQxNWFiN2M.jpeg",
      "https://resizer.4zida.rs/KrfdDLFXQLV4xsETaqpcLg1d0c7zevREMQ7Yn56PLRo/fit/1920/1080/ce/0/bG9jYWw6Ly8vNjM1NTQ1ZGVmMDhhYmMzYWRhMGY5MWE5LzRhMDU2YTEwYjY.jpeg",
      "https://resizer.4zida.rs/UqMPQvdH3kooE_ZDhKbMM-XtkPk_l6yVnYJaEpWBmik/fit/1920/1080/ce/0/bG9jYWw6Ly8vNjM1NTQ1ZGVmMDhhYmMzYWRhMGY5MWE5L2E1YjZjZmExYzY.jpeg",
      "https://resizer.4zida.rs/PRWaZNAI0jlK1Dmba6vQK24wMj7i7IesSGfz8-A7xk8/fit/1920/1080/ce/0/bG9jYWw6Ly8vNjM1NTQ1ZGVmMDhhYmMzYWRhMGY5MWE5LzM4NjBhMGFlZWY.jpeg",
      "https://resizer.4zida.rs/9H29axBsDiu0X_T8uYvK-KlskbVRATUHjgHL1cgRswk/fit/1920/1080/ce/0/bG9jYWw6Ly8vNjM1NTQ1ZGVmMDhhYmMzYWRhMGY5MWE5L2Y5N2U3OWJmMGM.jpeg",
      "https://resizer.4zida.rs/RB2hm14wVqIZtyfV-WX-77TfZeQyM6TYzEMqGHX8QSk/fit/1920/1080/ce/0/bG9jYWw6Ly8vNjM1NTQ1ZGVmMDhhYmMzYWRhMGY5MWE5L2U3MjQ4YjU0NGE.jpeg",
      "https://resizer.4zida.rs/GlcQ3Em-X7Xfrfx7nB-g23IiURztUiZt7-O2itoKL7w/fit/1920/1080/ce/0/bG9jYWw6Ly8vNjM1NTQ1ZGVmMDhhYmMzYWRhMGY5MWE5LzIxZjY0ZDRmNDg.jpeg",
      "https://resizer.4zida.rs/5rjaJccuyVva0hj2G3-P66yftaTrbT-MwI1xAECaQEk/fit/1920/1080/ce/0/bG9jYWw6Ly8vNjM1NTQ1ZGVmMDhhYmMzYWRhMGY5MWE5L2FjZmUwMzRiNzA.jpeg",
      "https://resizer.4zida.rs/6teX_Nnx0Kdrz5AUwdMsf932l6BCTwQJxoGbCjvZ8Uo/fit/1920/1080/ce/0/bG9jYWw6Ly8vNjM1NTQ1ZGVmMDhhYmMzYWRhMGY5MWE5L2UzM2RiOTgwY2U.jpeg",
      "https://resizer.4zida.rs/sfX0iaXxFoqja_IAtAmAc326bqdYHrHwJXIGqL5bW78/fit/1920/1080/ce/0/bG9jYWw6Ly8vNjM1NTQ1ZGVmMDhhYmMzYWRhMGY5MWE5L2Q1ZDMzMjdhZGU.jpeg"
    ],
    "PhoneNumber": "060 1439663"
  },

];
const OLD_DATA = [
  {
    "property_location": "Bulevar Patrijarha Pavla 1A Liman 4 Liman Gradske lokacije Novi Sad",
    "Number_Of_Rooms": "4 sobe",
    "square_meters": "91 m²",
    "property_price": "180000",
    "article_url": "https://www.4zida.rs/prodaja/stanovi/novi-sad/oglas/bulevar-patrijarha-pavla-1a/635545def08abc3ada0f91a9",
    "website_source": "https://www.4zida.rs/prodaja-stanova?lista_fizickih_lica=1&strana=",
    "property_pictures": [
      "https://resizer.4zida.rs/AiEs7xuX2lKM4H4JZe3PlAHXrTHlvzu9JbgpGCBHOhQ/fit/1920/1080/ce/0/bG9jYWw6Ly8vNjM1NTQ1ZGVmMDhhYmMzYWRhMGY5MWE5L2E0MGQxNWFiN2M.jpeg",
      "https://resizer.4zida.rs/KrfdDLFXQLV4xsETaqpcLg1d0c7zevREMQ7Yn56PLRo/fit/1920/1080/ce/0/bG9jYWw6Ly8vNjM1NTQ1ZGVmMDhhYmMzYWRhMGY5MWE5LzRhMDU2YTEwYjY.jpeg",
      "https://resizer.4zida.rs/UqMPQvdH3kooE_ZDhKbMM-XtkPk_l6yVnYJaEpWBmik/fit/1920/1080/ce/0/bG9jYWw6Ly8vNjM1NTQ1ZGVmMDhhYmMzYWRhMGY5MWE5L2E1YjZjZmExYzY.jpeg",
      "https://resizer.4zida.rs/PRWaZNAI0jlK1Dmba6vQK24wMj7i7IesSGfz8-A7xk8/fit/1920/1080/ce/0/bG9jYWw6Ly8vNjM1NTQ1ZGVmMDhhYmMzYWRhMGY5MWE5LzM4NjBhMGFlZWY.jpeg",
      "https://resizer.4zida.rs/9H29axBsDiu0X_T8uYvK-KlskbVRATUHjgHL1cgRswk/fit/1920/1080/ce/0/bG9jYWw6Ly8vNjM1NTQ1ZGVmMDhhYmMzYWRhMGY5MWE5L2Y5N2U3OWJmMGM.jpeg",
      "https://resizer.4zida.rs/RB2hm14wVqIZtyfV-WX-77TfZeQyM6TYzEMqGHX8QSk/fit/1920/1080/ce/0/bG9jYWw6Ly8vNjM1NTQ1ZGVmMDhhYmMzYWRhMGY5MWE5L2U3MjQ4YjU0NGE.jpeg",
      "https://resizer.4zida.rs/GlcQ3Em-X7Xfrfx7nB-g23IiURztUiZt7-O2itoKL7w/fit/1920/1080/ce/0/bG9jYWw6Ly8vNjM1NTQ1ZGVmMDhhYmMzYWRhMGY5MWE5LzIxZjY0ZDRmNDg.jpeg",
      "https://resizer.4zida.rs/5rjaJccuyVva0hj2G3-P66yftaTrbT-MwI1xAECaQEk/fit/1920/1080/ce/0/bG9jYWw6Ly8vNjM1NTQ1ZGVmMDhhYmMzYWRhMGY5MWE5L2FjZmUwMzRiNzA.jpeg",
      "https://resizer.4zida.rs/6teX_Nnx0Kdrz5AUwdMsf932l6BCTwQJxoGbCjvZ8Uo/fit/1920/1080/ce/0/bG9jYWw6Ly8vNjM1NTQ1ZGVmMDhhYmMzYWRhMGY5MWE5L2UzM2RiOTgwY2U.jpeg",
      "https://resizer.4zida.rs/sfX0iaXxFoqja_IAtAmAc326bqdYHrHwJXIGqL5bW78/fit/1920/1080/ce/0/bG9jYWw6Ly8vNjM1NTQ1ZGVmMDhhYmMzYWRhMGY5MWE5L2Q1ZDMzMjdhZGU.jpeg"
    ],
    "PhoneNumber": "060 1439663"
  },
  {
    "property_location": "Bulevar Evrope Bulevar Evrope Gradske lokacije Novi Sad",
    "Number_Of_Rooms": "3 sobe",
    "square_meters": "59 m²",
    "property_price": "139200",
    "article_url": "https://www.4zida.rs/prodaja/stanovi/novi-sad/oglas/bulevar-evrope/639f1babffeb18ffde0e0594",
    "website_source": "https://www.4zida.rs/prodaja-stanova?lista_fizickih_lica=1&strana=",
    "property_pictures": [
      "https://resizer.4zida.rs/bfU-6s5ogb3enZmn4A9xaty99dDpX4MLh0BCy7sEZGo/fit/1920/1080/ce/0/bG9jYWw6Ly8vNjM5ZjFiYWJmZmViMThmZmRlMGUwNTk0L2Q1NTdiNjQ3ZTI.jpeg",
      "https://resizer.4zida.rs/iOMFQH1WXaB52qyQM5zEHOY9w0Eio_Dmn9yG65wv8gA/fit/1920/1080/ce/0/bG9jYWw6Ly8vNjM5ZjFiYWJmZmViMThmZmRlMGUwNTk0LzRkYWFmOWQ0ZGI.jpeg",
      "https://resizer.4zida.rs/3fc4rwWFYCsLa7K37x8sXO7VMTast74wU0OA1RUqO_8/fit/1920/1080/ce/0/bG9jYWw6Ly8vNjM5ZjFiYWJmZmViMThmZmRlMGUwNTk0LzliYmMyMjE0Yzg.jpeg",
      "https://resizer.4zida.rs/Sbc1XyydX1ZH7c2T6dvLg9OstIJdXJK5JdIIYmqd1-M/fit/1920/1080/ce/0/bG9jYWw6Ly8vNjM5ZjFiYWJmZmViMThmZmRlMGUwNTk0LzI5NDVjY2ZlZmY.jpeg",
      "https://resizer.4zida.rs/Tlbp-faV9S-2BHg5klMIwD0ka90U0XQtEa5wx3zlQ9w/fit/1920/1080/ce/0/bG9jYWw6Ly8vNjM5ZjFiYWJmZmViMThmZmRlMGUwNTk0LzhkZjk2ODMwODQ.jpeg",
      "https://resizer.4zida.rs/fCMpKcLh6bm7YY6piT-z_Y3AwcuTeSK9nKG5BSua8r4/fit/1920/1080/ce/0/bG9jYWw6Ly8vNjM5ZjFiYWJmZmViMThmZmRlMGUwNTk0LzBmMjY1MjlmMjA.jpeg",
      "https://resizer.4zida.rs/5R4x7JJ3iHBar3ZCXrMmze4wBHJs0N5t4Fls14Tqxos/fit/1920/1080/ce/0/bG9jYWw6Ly8vNjM5ZjFiYWJmZmViMThmZmRlMGUwNTk0L2UwMjFiMGIyN2E.jpeg",
      "https://resizer.4zida.rs/iDaZbFrTaq7sj_t5Yw_RETLsu2E9STHttWscLkUWhtA/fit/1920/1080/ce/0/bG9jYWw6Ly8vNjM5ZjFiYWJmZmViMThmZmRlMGUwNTk0LzZiY2UxMDc2ODE.jpeg",
      "https://resizer.4zida.rs/Zps8rdDaJ1QENAN0rIjAHXZQvUJcZ-6vUJLyqaSdMLk/fit/1920/1080/ce/0/bG9jYWw6Ly8vNjM5ZjFiYWJmZmViMThmZmRlMGUwNTk0LzBmNDMzOTA5YTk.jpeg",
      "https://resizer.4zida.rs/UUGNPnsjXj0cUgbEcHWSZ2sUiiwsnl-xaACAXDeNrIk/fit/1920/1080/ce/0/bG9jYWw6Ly8vNjM5ZjFiYWJmZmViMThmZmRlMGUwNTk0LzdhZjlmOWE5Mzk.jpeg",
      "https://resizer.4zida.rs/Lv3wefMG40DstD4aIhb0bRiAQkI9hvi2FTLzla6K6Xg/fit/1920/1080/ce/0/bG9jYWw6Ly8vNjM5ZjFiYWJmZmViMThmZmRlMGUwNTk0Lzc5MjMyNzIyM2E.jpeg",
      "https://resizer.4zida.rs/gM5GZzZX7cKzI_WX6fDniqUUQr6gvRwOHtF3OVpFX1k/fit/1920/1080/ce/0/bG9jYWw6Ly8vNjM5ZjFiYWJmZmViMThmZmRlMGUwNTk0LzAyMzFkMWIwN2Y.jpeg",
      "https://resizer.4zida.rs/MTygaBzogl62o_5j_HQt0xWk5ns4uZXXgJ8lkcMdfF4/fit/1920/1080/ce/0/bG9jYWw6Ly8vNjM5ZjFiYWJmZmViMThmZmRlMGUwNTk0Lzc3ZmU2OTNlMTg.jpeg",
      "https://resizer.4zida.rs/cRvwdGYB090D8O_DTYWmW_HXafgG_Gi8k87K-1oWZyk/fit/1920/1080/ce/0/bG9jYWw6Ly8vNjM5ZjFiYWJmZmViMThmZmRlMGUwNTk0LzVkYjQ5ZmE1MjA.jpeg"
    ],
    "PhoneNumber": "064 1535779"
  },

];
/*
const difference = objectList.compareList(newObjects);

console.log(difference);
*/
/*
let resultA = new_DATA.filter(elm => !OLD_DATA.map(elm => JSON.stringify(elm)).includes(JSON.stringify(elm)));

// a diff b
let resultB = OLD_DATA.filter(elm => !new_DATA.map(elm => JSON.stringify(elm)).includes(JSON.stringify(elm)));
 */
// show merge 
/* new_DATA.map((item) => {
  OLD_DATA.push(item)
})

//GET THE DIFF
let diff = lodash.uniq(new_DATA)
console.log(diff)
 */
//PUSH THE NEW ITEMS in the old file 

//and then write it again 


/* class ObjectCombiner {
  static combineArrays(array1: Ad_Object[], array2: Ad_Object[]): Ad_Object[] {
    // Create a set to store the unique objects
    const uniqueObjects: Set<string> = new Set();

    // Add all objects from both arrays to the set
    array1.forEach(obj => uniqueObjects.add(JSON.stringify(obj)));
    array2.forEach(obj => uniqueObjects.add(JSON.stringify(obj)));

    // Return an array of the unique objects
    return Array.from(uniqueObjects).map(JSON.parse(uniqueObjects));
  }
}



const combinedArray = ObjectCombiner.combineArrays(new_DATA, OLD_DATA)
console.log(combinedArray)

 */