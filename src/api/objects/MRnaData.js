class MRnaData{
    constructor(mRnaData){
        if(!mRnaData){ // null or undefined or whatever
            console.error('mRna data is null');
            return;
        }
        this.region = mRnaData.region;
        this.geneId = mRnaData.geneId;
        this.geneName = mRnaData.geneName;
        this.sequenceUrl = mRnaData.sequenceUrl;
        this.interStart = mRnaData.interStart;
        this.interEnd = mRnaData.interEnd;
        this.site = mRnaData.site

    }
}

export default MRnaData;