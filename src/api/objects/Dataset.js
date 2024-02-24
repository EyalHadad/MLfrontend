import SearchOptions from "./SearchOptions";
class Dataset{

    constructor(dataset){
        if(!dataset){ // null or undefined or whatever
            console.error('dataset is null');
            return;
        }
        this.id = dataset.id ;
        this.name = dataset.name;
        this.interactionsAmount = dataset.interactionsAmount;
        this.datasetMB = dataset.datasetMB;
        this.searchOptions = new SearchOptions(dataset.searchOptions);
    }

}

export default Dataset;