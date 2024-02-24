class StatisticsTwoD {
    constructor(statisticsTwoD){
        if(!statisticsTwoD) return;
        this.featureX = statisticsTwoD.featureX;
        this.secondFeature = statisticsTwoD.secondFeature;        
        this.statistics = statisticsTwoD.statistics;
    }
}

export default StatisticsTwoD;