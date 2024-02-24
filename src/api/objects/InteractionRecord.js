class InteractionRecord{

    constructor(interacitons){
        if(!interacitons){ // null or undefined or whatever
            console.error('interactions is null');
            return;
        }
        this.interactionId = interacitons.interactionId;
        this.index = interacitons.index;
        this.datasetId = interacitons.datasetId;
        this.miRnaId = interacitons.miRnaId;
        this.miRnaSeq = interacitons.miRnaSeq;
        this.seedFamily =interacitons.seedFamily ;
        this.site = interacitons.site;
        this.region = interacitons.region;
        this.start = interacitons.start;
        this.end = interacitons.end;
        this.mrnaBulge = interacitons.mrnaBulge;
        this.mrnaInter = interacitons.mrnaInter;
        this.mirInter = interacitons.mirInter;
        this.mirBulge = interacitons.mirBulge;
        this.energyMefDuplex = interacitons.energyMefDuplex;
        this.geneId = interacitons.geneId;
    }

}

export default InteractionRecord;