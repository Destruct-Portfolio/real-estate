// task : removed duplicates from an array and then saves it 
import fs from "fs";
class upload {
    //takes FileName
    //takes AD_Object[]
    //returns void
    FileName;
    Payload;
    constructor(FileName, Payload) {
        this.FileName = FileName;
        this.Payload = Payload;
    }
    execute() {
        // we need to upload the file
        // push the arrays together 
        // remove all duplicates 
        // and save again 
        try {
            let Data = JSON.parse(fs.readFileSync(`../data/${this.FileName}.json`).toString());
            let uniquer = [...new Set(Data)];
            console.log(uniquer);
        }
        catch (error) {
            return null;
        }
    }
}
//console.log(new upload("test", []).execute())
let Data = JSON.parse(fs.readFileSync(`../data/test.json`).toString());
let t = Data.reduce((unique, item) => {
    console.log(
    // a. Item
    item, 
    // b. Final Array (Accumulator)
    unique, 
    // c. Condition (Remember it only get pushed if this returns `false`)
    unique.includes(item), 
    // d. Reducer Function Result
    unique.includes(item) ? unique : [...unique, item]);
    return unique.includes(item) ? unique : [...unique, item];
}, []); // 👈 The initial value of our Accumulator is an empty array
console.log('çççççççççççççççç');
console.log(t);