class SearchOptions{

    constructor(searchOption){
        if(!searchOption){ //null or undefined or whatever
            return; // with default values    
        }
        this.seedFamilies =searchOption.seedFamilies;
        this.miRnaIds = searchOption.miRnaIds;
        // this.miRnaSeqs = searchOption.miRnaSeqs; removed according to isana's order
        this.siteTypes = searchOption.siteTypes;
        this.geneIds = searchOption.geneIds;
        this.regions = searchOption.regions;
    }

}

export default SearchOptions;