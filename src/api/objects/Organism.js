import Dataset from "./Dataset";

class Organism{

    constructor(organism){
        if(!organism){ // null or undefined or whatever
            console.error('organism is null');
            return;
        }
        this.id = organism.id ;
        this.name = organism.name;
        this.datasets = [];
        organism.datasets.forEach(element => {
            this.datasets.push(new Dataset(element));
        });
    }

}

export default Organism;