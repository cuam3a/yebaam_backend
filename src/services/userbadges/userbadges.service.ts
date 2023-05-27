import { ConstantsRS } from '../../utils/constants';
import moment from "moment";
import { notificationsServices } from '../notifications/notifications.services';
import { userRankServices } from '../userranks/userranks.service';
import { userSettingsServices } from '../usersettings/usersettings.service';
const userBadgeModel = require('../../models/userbadge/UsersBadge.model');

class UserBadgeServices {
    public async saveUserBadge(data: any) {
        let rta

        const awardToSave = new userBadgeModel(data);
        const awardSaved = await awardToSave.save();

        if (awardSaved) {
            rta = awardSaved
            if (rta) {
                const getUserBages = await this.getUserBadgesByID(rta.id)
                if (getUserBages) {
                    // Asignar puntos por premio otorgado
                    console.log("WIN")
                    await userRankServices.addSubstractScoreToEntity(getUserBages.userID.id, getUserBages.awardID.scoreValue)

                    const getConfig = await userSettingsServices.getUserSettingsByEntityId({ entityId: getUserBages.userID.id })
                    if (getConfig) {
                        if (getConfig.isDisabledNotificactionOfawards == false) {
                            await notificationsServices.sendNotificationsAwardsOrBadges(getUserBages)
                        }
                    }
                }
            }
        }
    }

    public async getUserBadgesByUserID(body: any) {
        let rta, rtaError
        let userBadges = await userBadgeModel.find({ userID: body.userID })
            .populate([
                {
                    path: 'userID',
                    model: 'Users',
                },
                {
                    path: 'awardID',
                    model: 'Award',
                    populate: [
                        {
                            path: 'typeOfAwardID',
                            model: 'TypeOfAwards'
                        },
                        {
                            path: 'challengeIDS',
                            model: 'Challenges'
                        }
                    ]
                },
                {
                    path: 'userChallengeID',
                    model: 'UserChallenges',
                    populate: [
                        {
                            path: 'challengeID',
                            model: 'Challenges'
                        },
                        {
                            path: 'awardID',
                            model: 'Award'
                        }
                    ]
                }
            ])

        if (userBadges) {
            rta = userBadges;
        } else {
            rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST
        }

        return rta ? rta : rtaError
    }

    public async getUserBadgesByID(id: any) {
        const getUserBages = await userBadgeModel
            .findOne({ _id: id })
            .populate('userID')
            .populate('awardID')
            .populate('userChallengeID')
        return getUserBages
    }
}

export const userBadgeServices = new UserBadgeServices()