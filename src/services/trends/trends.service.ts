
const trendModel = require('../../models/trend/Trend.model');
class TrendsServices {
    public async getAllTrends() {

        try {
            const allTrends = await trendModel.find({Trend:true}).populat('idpost').sort('-position');
            return allTrends
        } catch (error) {
            console.log(error);            
        }

    }
}

export const trendsServices = new TrendsServices();