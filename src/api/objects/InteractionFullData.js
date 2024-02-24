import MiRnaData from "./MiRnaData";
import MRnaData from "./MRnaData";
import InteractionInnerData from "./InteractionInnerData";

class InteractionFullData{
    constructor(interaction){
        if(!interaction){ // null or undefined or whatever
            console.error('interaction is null');
            return;
        }
        this.miRnaData = new MiRnaData(interaction.miRnaData);
        this.mRnaData = new MRnaData(interaction.mRnaData);
        this.interactionInnerData = new InteractionInnerData(interaction.interactionInnerData);
    }
}

export default InteractionFullData;