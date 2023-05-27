import { ConstantsRS } from '../../utils/constants';
import moment from 'moment';
import { similarServices } from '../similarservices/similar.services';

const sellersRatingModel = require('../../models/sellersrating/SellersRating.model');

class SellersRatingServices {
    public async saveSellerRating(body: any) {
        let rta, rtaError, ratingUpdated

        const seller = await similarServices.identifyUserBrandOrCommunity(body.sellerID)
        const qualifier = await similarServices.identifyUserBrandOrCommunity(body.qualifierID)
        if (!seller.code && !qualifier.code) {
            const raitingExist = await this.getRatingExistence(body)
            if (!raitingExist.code) { // Si ya existe
                if (raitingExist.value == parseInt(body.value) && raitingExist.isEnabled) { // Se anula
                    ratingUpdated = await sellersRatingModel.findOneAndUpdate({ _id: raitingExist._id }, { isEnabled: false }, { new: true })
                } else { // Se actualiza
                    ratingUpdated = await sellersRatingModel.findOneAndUpdate({ _id: raitingExist._id }, { value: body.value, isEnabled: true }, { new: true })
                }

                if (ratingUpdated) {
                    rta = ratingUpdated
                } else {
                    rtaError = ConstantsRS.ERROR_UPDATING_RECORD
                }
            } else {
                let ratigToSave = new sellersRatingModel(body)
                const ratingSaved = await ratigToSave.save()
                if (ratingSaved) {
                    rta = ratingSaved
                } else {
                    rtaError = ConstantsRS.ERROR_SAVING_RECORD
                }
            }
        } else {
            rtaError = ConstantsRS.USER_DOES_NOT_EXIST
        }

        return rta ? rta : rtaError
    }

    public async getRatingExistence(body: any) {
        let rta, rtaError;
        const exist = await sellersRatingModel.findOne({
            $and: [{ sellerID: body.sellerID }, { qualifierID: body.qualifierID }]
        });

        if (exist) {
            rta = exist
        } else {
            rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST
        }

        return rta ? rta : rtaError;
    }

    public async getRatingBySellerID(body: any) {
        const ratingOne = await sellersRatingModel.findOne({
            $and: [{ sellerID: body.sellerID }, { value: 1 }, { isEnabled: true }]
        }).countDocuments()

        const ratingTwo = await sellersRatingModel.findOne({
            $and: [{ sellerID: body.sellerID }, { value: 2 }, { isEnabled: true }]
        }).countDocuments()

        const ratingThree = await sellersRatingModel.findOne({
            $and: [{ sellerID: body.sellerID }, { value: 3 }, { isEnabled: true }]
        }).countDocuments()

        const ratingFour = await sellersRatingModel.findOne({
            $and: [{ sellerID: body.sellerID }, { value: 4 }, { isEnabled: true }]
        }).countDocuments()

        const ratingFive = await sellersRatingModel.findOne({
            $and: [{ sellerID: body.sellerID }, { value: 5 }, { isEnabled: true }]
        }).countDocuments()

        let voterMultiplication = (1 * ratingOne) + (2 * ratingTwo) + (3 * ratingThree) + (4 * ratingFour) + (5 * ratingFive)
        let sumVoters = ratingOne + ratingTwo + ratingThree + ratingFour + ratingFive
        let average = voterMultiplication / sumVoters

        return {
            1: ratingOne,
            2: ratingTwo,
            3: ratingThree,
            4: ratingFour,
            5: ratingFive,
            "average": average
        }
    }

    public async getRatingBetween(body: any) {
        let rta, rtaError;

        const rating = await sellersRatingModel.findOne({
            $and: [{ sellerID: body.sellerID }, { qualifierID: body.qualifierID }, { isEnabled: true }]
        })

        if (rating) {
            rta = rating
        } else {
            rtaError = ConstantsRS.NO_REGISTER_FOUND
        }

        return rta ? rta : rtaError
    }
}

export const sellersRatingServices = new SellersRatingServices()