
class FeaturesObject{
    constructor(featureTypes, features){
        if(!featureTypes || !features){ // null or undefined or whatever
            console.error('featureTypes or features is null');
            return;
        }
        this.featureTypes = featureTypes ;
        this.features = features;
    }
        //     if(!featureTypes || !features){ // null or undefined or whatever
        //     console.error('featureTypes or features is null');
        //     return;
        // }
        // const featuresDict = features.reduce((acc, {name, featureTypeId}) => ({...acc, [name]: featureTypeId}), {});
        // const featureTypesDict = featureTypes.reduce((acc, {id, type, filters}) => ({
        //     ...acc,
        //     [id]: {type, filters}
        // }), {});
        // this.featureTypes = featureTypesDict ;
        // this.features = featuresDict;
}
export default FeaturesObject;