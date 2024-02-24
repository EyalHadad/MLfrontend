class MiRnaData {
    constructor(miRnaData){
        if(!miRnaData){ // null or undefined or whatever
            console.error('miRna data is null');
            return;
        }
        this.miRnaId = miRnaData.miRnaId;
        this.miRnaSequence = miRnaData.miRnaSequence;
        this.seedFamily = miRnaData.seedFamily;

    }
}
export default MiRnaData;