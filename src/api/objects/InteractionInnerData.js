class InteractionInnerData{
    constructor(interactionInnerData){
        if(!interactionInnerData){ // null or undefined or whatever
            console.error('mRna data is null');
            return;
        }
        this.interactionId = interactionInnerData.interactionId;
        this.organismName = interactionInnerData.organismName;
        this.datasetName = interactionInnerData.dataSetName;
        this.duplexStructure = interactionInnerData.duplexStructure;
        this.energyMefDuplex = interactionInnerData.energyMefDuplex;
        this.mRnaDistToEnd = interactionInnerData.mRnaDistToEnd;
        this.mRnaDistToStart = interactionInnerData.mRnaDistToStart;
        this.siteType = interactionInnerData.siteType;
        this.seedMatchStart = interactionInnerData.seedMatchStart;
    }
}
export default InteractionInnerData;