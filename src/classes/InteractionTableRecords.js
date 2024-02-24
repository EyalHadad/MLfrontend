class InteractionTableRecord{
    // object for making transforming interaction record into table fitting data
    constructor(interacitonRecord, organisms){
        if(!interacitonRecord){ // null or undefined or whatever
            console.error('interacitons is null');
            return;
        }
        this.interactionId = interacitonRecord.interactionId;
        this.index = interacitonRecord.index;
        this.datasetName = organisms.map(org => org.datasets).flat().filter(ds => ds.id === interacitonRecord.datasetId)[0]?.name;
        this.miRnaId = interacitonRecord.miRnaId;
        this.miRnaSeq = interacitonRecord.miRnaSeq;
        this.seedFamily =interacitonRecord.seedFamily ;
        this.site = interacitonRecord.site;
        this.region = interacitonRecord.region;
        this.start = interacitonRecord.start;
        this.end = interacitonRecord.end;
        this.mrnaBulge = interacitonRecord.mrnaBulge;
        this.mrnaInter = interacitonRecord.mrnaInter;
        this.mirInter = interacitonRecord.mirInter;
        this.mirBulge = interacitonRecord.mirBulge;
        this.energyMefDuplex = interacitonRecord.energyMefDuplex;
        this.geneId = interacitonRecord.geneId;
    }

}

export default InteractionTableRecord;