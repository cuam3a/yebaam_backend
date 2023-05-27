const CommunityScores = require("../../models/communities/CommunityScores.model");
import {rolCommunitiesServices} from "../../services/communities/rolcommunities.services";
class ScoreCommunityServices{
    public async getScoreCommunityByID(id:string){
        try {
            let ScoreCommunity = await CommunityScores.findOne({ _id: id });
            if (ScoreCommunity) {
                return ScoreCommunity;
            } else {
                return ScoreCommunity;
            }
        } catch (error) {
            console.log(error);
        }
    }
    public async getScoreCommunityByUserID(id: string){
        try {
            let ScoreCommunity = await CommunityScores.findOne({ userID: id });
            if (ScoreCommunity) {
                return ScoreCommunity;
            } else {
                return ScoreCommunity;
            }
        } catch (error) {
            console.log(error);
        }
    }
    public async createScoreCommunity(userID:string,communityID:string){
        try {
            let ScoreCommunity = new CommunityScores({userID:userID,communityID:communityID});
            if (ScoreCommunity) {
                await ScoreCommunity.save();
            } else {
                return ScoreCommunity;
            }            
            return ScoreCommunity;
        } catch (error) {
            console.log(error);            
        }
    }
    public async updateScoreCommunity(obj:any){
        try {
            const getRecord = await CommunityScores.findOne({$and:[{userID:obj.userID},{communityID:obj.communityID}]});                       
            if (getRecord) {
                const updateScoreCommunity =  new CommunityScores(getRecord);                
                updateScoreCommunity.score += obj.score;
                const scorerolCommunity = await rolCommunitiesServices.validateCommunityRoleChange(updateScoreCommunity.score);
                if (scorerolCommunity) {
                    updateScoreCommunity.communityRolesID = scorerolCommunity.id;
                }
                const updateRolAndScore = await CommunityScores.findOneAndUpdate(
                    {$and:[{userID:obj.userID},{communityID:obj.communityID}]},
                    updateScoreCommunity,
                    {new:true}
                    )
                    return updateRolAndScore;
            }
        } catch (error) {
            console.log(error);            
        }
    }
    public async deleteScoreCommunityByID(id:string){
        try {
            const statusScore = await CommunityScores.findOneAndUpdate(
                {_id:id},
                {isEnabled : false},
                {new:true}
            )          
            return statusScore;
        } catch (error) {
            console.log(error);            
        }
    }
}
export const scoreCommunityServices = new ScoreCommunityServices();