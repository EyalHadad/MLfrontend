import InteractionRecord from "./objects/InteractionRecord";
import Organism from "./objects/Organism";
// eslint-disable-next-line
import InteractionFullData from "./objects/InteractionFullData";
import CommonStrings from "../classes/CommonStrings";
import StatisticsOneD from "./objects/StatisticsOneD";
import StatisticsTwoD from "./objects/StatisticsTwoD";
import FeaturesObject from "./objects/FeaturesObject";

class ApiRequests{
    static async getDetails(searchOptions) {
        try{
            const response = await fetch(process.env.REACT_APP_api_route + '/organisms/details?searchOptions=' + searchOptions, {
                method: 'GET',
                headers: {
                    'Content-Type' : 'application/json'
                }});
            const details = await response.json();
            const featureTypes = details[CommonStrings.mappingStrings.featureTypes]
            const features = details[CommonStrings.mappingStrings.features]
            const organismsDict = details[CommonStrings.mappingStrings.organisms]
            const featuresObject = new FeaturesObject(featureTypes, features)
            let orgs = [];
            organismsDict.forEach(element => {
                orgs.push(new Organism(element));
            });

            let detailsDict =  {};
            detailsDict[CommonStrings.mappingStrings.organisms] = orgs
            detailsDict[CommonStrings.mappingStrings.featuresData]  = featuresObject
            return detailsDict;
        }
        catch(e){            
            console.error(CommonStrings.apiStrings.consoleExceptions.details)
            console.error(e)
        }
    }


    static async browseInteractions(datasetId) {
        try{
            const response = await fetch(process.env.REACT_APP_api_route + '/organisms/datasets/' + datasetId + '/interactions', {
                method: 'GET',
                headers: {
                    'Content-Type' : 'application/json'
                }});
            const interacitonsResponse = await response.json(); 
            let interacitons = [];
            interacitonsResponse.forEach(element => {
                interacitons.push(new InteractionRecord(element));
            });
            return interacitons;
        }
        catch(e){            
            console.error(CommonStrings.apiStrings.consoleExceptions.browse)
            console.error(e)
        }
    }

    static async quickSearchInteractions(searchQuery){
        if(searchQuery === null || searchQuery === ''){
            console.error('search query is empty');
            return;
        }
        try{
            const response = await fetch(process.env.REACT_APP_api_route + '/generalSearchInteractions/interactions?q=' + searchQuery, {
                method: 'GET',
                headers: {
                    'Content-Type' : 'application/json'
                }});
            const interacitonsResponse = await response.json(); 
            let interacitons = [];
            interacitonsResponse.forEach(element => {
                interacitons.push(new InteractionRecord(element));
            });
            return interacitons;
        }
        catch(e){            
            console.error(CommonStrings.apiStrings.consoleExceptions.search)
            console.error(e)
        }
    }

    static async searchInteractions(filters) {
        if(filters === null){
            console.error('filters object is null');
            return;
        }
        try{            
            let requestString = this.buildRequestForSearch(filters);            
            const response = await fetch(process.env.REACT_APP_api_route + requestString, {
                method: 'GET',
                headers: {
                    'Content-Type' : 'application/json'
                }});
            const interacitonsResponse = await response.json(); 
            let interacitons = [];
            interacitonsResponse.forEach(element => {
                interacitons.push(new InteractionRecord(element));
            });
            return interacitons;
        }
        catch(e){            
            console.error(CommonStrings.apiStrings.consoleExceptions.search)
            console.error(e)
        }
    }

    // download functionality
    static async downloadByDataset(datasetId) {
        try{            
            const url = process.env.REACT_APP_api_route + '/organisms/datasets/' + datasetId + '/interactions/download';
            await this.downloadUrl(url);
        }
        catch(e){            
            console.error('exception at browse')
            console.error(e)
            throw e;
        }       
    }
    static async downloadBySearchFilters(filters) {
        if(filters === null){
            console.error('filters object is null');
            return;
        }
        try{            
            let requestString = this.buildRequestForSearch(filters, true);
            let url = process.env.REACT_APP_api_route + requestString;
            await this.downloadUrl(url);
            
        }
        catch(e){            
            console.error(CommonStrings.apiStrings.consoleExceptions.download)
            console.error(e)
            throw e;
        }
    }
    static async downloadByQuickSearch(searchQuery){
        if(searchQuery === null || searchQuery === ''){
            console.error('search query is empty');
            return;
        }
        try{
            let url =
              process.env.REACT_APP_api_route +
              '/generalSearchInteractions/interactions/download?q=' +
              searchQuery;
            await this.downloadUrl(url);
        }
        catch(e){            
            console.error(CommonStrings.apiStrings.consoleExceptions.download)
            console.error(e)
            throw e;
        }
    }

    static buildRequestForSearch(filters, download = false, statistics1D = false, statistics2D = false){
        let requestString;
        if(download) requestString = '/interactions/download?';
        else if(statistics1D) requestString = '/statistics/oneD?';
        else if(statistics2D) requestString = '/statistics/twoD?';        
        else requestString = '/interactions?';        
        requestString += this.buildRequestForSearchField(filters.datasetsIds, 'datasetsIds') + 
            this.buildRequestForSearchField(filters.seedFamilies, 'seedFamilies') +
            this.buildRequestForSearchField(filters.miRnaIds, 'miRnaIds') +
            this.buildRequestForSearchField(filters.miRnaSeqs, 'miRnaSeqs') +
            this.buildRequestForSearchField(filters.sites, 'sites') +
            this.buildRequestForSearchField(filters.geneIds, 'geneIds') +
            this.buildRequestForSearchField(filters.regions, 'regions')+
            this.buildRequestForSearchField(filters.features, 'features');
        if(requestString[requestString.length - 1] === '&'
            && !statistics1D && !statistics2D) requestString = requestString.substring(0, requestString.length -1);
        return requestString;
    }

    static buildRequestForSearchField(field, queryKey){
        let str = '';
        if(!field) return str;        
        field.forEach(element => {
            str += queryKey + '=' + element.toString() + '&'
        });
        return str;
    }

    static async getInteractionFullData(interactionId) {
        try {
            const response = await fetch(process.env.REACT_APP_api_route+ '/interactionOuterData/' + interactionId, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const interactionResponse = await response.json();
            return new InteractionFullData(interactionResponse);
        } catch (e) {
            console.error(CommonStrings.apiStrings.consoleExceptions.interaction)
            console.error(e)
        }
    };
    
    static async downloadUrl(url){
        await fetch(url).then(response => {
            if (response.status !== 200) throw new Error("url doesn't return 200");
            else {
                const iframe = document.createElement('iframe');
                iframe.style.display = 'none';
                iframe.src = url;
                document.body.appendChild(iframe);
                Promise.resolve();        
            }
        })
    }

    // statistics
    static async getGeneralStatistics(){
        try {        
        const response = await fetch(process.env.REACT_APP_api_route+ '/statistics/general', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const jsonResponse = await response.json();
        const newJson = {}
        for (let key in jsonResponse.statistics) {
            newJson[key.substring(1)] = jsonResponse.statistics[key]
        }
        jsonResponse.statistics = newJson
        return new StatisticsOneD(jsonResponse);
        } catch(e){
            console.error(CommonStrings.apiStrings.consoleExceptions.statistics)
            console.error(e)
        }
    }

    static async getDatasetStatistics(datasetId){
        try {        
            const response = await fetch(process.env.REACT_APP_api_route+ `/statistics/${datasetId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const fromApi = await response.json();
            return fromApi.map(api => new StatisticsOneD(api));
        }catch(e){
            console.error(CommonStrings.apiStrings.consoleExceptions.statistics)
            console.error(e)
        }
    }

    static async get1DStatistics(filters, featureX){
        let requestString = this.buildRequestForSearch(filters, false, true);        
        requestString = requestString + `feature=${featureX}`
        console.log(requestString);
        try {
            const response = await fetch(process.env.REACT_APP_api_route + requestString, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const fromApi = await response.json();
            return new StatisticsOneD(fromApi);
        } catch(e) {
            console.error(CommonStrings.apiStrings.consoleExceptions.statistics)
            console.error(e)
        }
    }
    static async get2DStatistics(filters, featureX, featureY){
        let requestString = this.buildRequestForSearch(filters, false, false, true);            
        requestString = requestString + `firstFeature=${featureX}&secondFeature=${featureY}`
        console.log(requestString);
        const response = await fetch(process.env.REACT_APP_api_route + requestString, {
            method: 'GET',
            headers: {
                'Content-Type' : 'application/json'
            }});
        const fromApi = await response.json(); 
        return new StatisticsTwoD(fromApi);
    }

    static async getPrediction(dataDict) {
        try{
            const mRNA = dataDict['mRNA']
            const miRNA = dataDict['miRNA']
            const site = dataDict['site']
            const organism = dataDict['organism'].charAt(0).toUpperCase() + dataDict['organism'].slice(1)
            // const response = await fetch(process.env.REACT_APP_WSL_api_route + '/prediction?miRNA_seq=' + miRNA
            // Fix the .env variable.
            const response = await fetch('https://mirinterbase.cs.bgu.ac.il/wsl_api/prediction?miRNA_seq=' + miRNA
                + '&mRNA_seq=' + mRNA + '&site_seq=' + site + '&org_name=' + organism, {
                method: 'GET',
                headers: {
                    'Content-Type' : 'application/json'
                }});
            const modelResponse = await response.json();
            return modelResponse;
        }
        catch(e){
            console.error(CommonStrings.apiStrings.consoleExceptions.browse)
            console.error(e)
        }
    }

}

export default ApiRequests;