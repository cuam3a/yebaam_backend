import { ConstantsRS } from "../../utils/constants";
const trademarkrsBankModel = require('../../models/trademarks/trademarksBankPoints.model');
const trademarksPointsModel = require('../../models/pointPackage/pointPackage.model');

class TrademarksBankPointsService {

    public async addPoints(bodyCreate: { userId?: string, marksId?: string }, dataPoints: { userId?: string, marksId?: string, packageId: string }) {

        // get object to upload
        let bankPoints = await trademarkrsBankModel.findOne(bodyCreate);

        // if not exist then create
        if (!bankPoints) {
            bankPoints = await this.createBankPoints(bodyCreate);
        }

        // Get Point package
        const packagePointsWithPoints = await trademarksPointsModel.findOne({ _id: dataPoints.packageId, isEnabled: true });

        if (!packagePointsWithPoints) {
            throw ConstantsRS.PACKAGE_NOT_FOUND
        } else {
            await trademarksPointsModel.updateOne({ _id: packagePointsWithPoints.id }, { inUse: true })
        }

        // create object trademark
        let packageUpdate = new trademarkrsBankModel(bankPoints);

        // update quantity points
        packageUpdate.boughtPackages.push(dataPoints.packageId);
        packageUpdate.totalBoughtPoints = bankPoints.getTotalBoughtPoints() + packagePointsWithPoints.pointsQuantity;
        packageUpdate.availablePoints = bankPoints.getAvailablePoints() + packagePointsWithPoints.pointsQuantity;

        // update points
        await trademarkrsBankModel.updateOne(bodyCreate, packageUpdate);

        return await trademarkrsBankModel.findOne(bodyCreate)
            .populate('boughtPackages', { pointsQuantity: 1, description: 1, price: 1 })
    }

    public async createBankPoints(bodyCreate: { userId?: string, marksId?: string }) {

        const bankToCreate = new trademarkrsBankModel(bodyCreate);

        return await bankToCreate.save();
    }

    /* public async getAllPointsBank() {
        return await trademarkrsBankModel.find({})
            .populate('boughtPackages', { pointsQuantity: 1, description: 1, price: 1 });
    } */

    public async getPointsBankById(id: string) {

        const bank = await trademarkrsBankModel.findOne({ _id: id })
            .populate('boughtPackages', { pointsQuantity: 1, description: 1, price: 1 });
        if (!bank) throw ConstantsRS.THE_RECORD_DOES_NOT_EXIST;

        return bank
    }

    public async getPointsBankByUserId(body: any) {
        const bank = await trademarkrsBankModel.find({
            $and: [
                { marksId: body.entityID },
                { isEnabled: true }
            ]
        })
            .populate('boughtPackages', { pointsQuantity: 1, description: 1, price: 1 })
        if (!bank) throw ConstantsRS.THE_RECORD_DOES_NOT_EXIST;

        return bank
    }

    public async substrackPoints(body: { userId?: string, marksId?: string }, datapoints: { quantity: number }) {

        const bankToSubstract = await trademarkrsBankModel.findOne(body);

        if (!bankToSubstract) throw ConstantsRS.PACKAGE_NOT_FOUND;

        if (bankToSubstract.getAvailablePoints() <= 0) throw ConstantsRS.PACKAGE_NOT_POINTS; //if not avaliable points

        if (bankToSubstract.getAvailablePoints() < datapoints.quantity) throw ConstantsRS.PACKAGE_NOT_POINTS_AVALIABLE; //if quantity substract biggest than avaliable points

        // update points
        const pointsToUpdate = {
            spendedPoints: bankToSubstract.getSpendedPoints() + datapoints.quantity,
            availablePoints: bankToSubstract.getAvailablePoints() - datapoints.quantity
        }

        await trademarkrsBankModel.updateOne(body, pointsToUpdate); //update bank

        return await trademarkrsBankModel.findOne(body); //return bank updated
    }

    /* public async deletePointBankById(id: string) {
        return await trademarkrsBankModel.findOneAndDelete({ _id: id });
    } */

    /* public async deactivatePointBankById(id: string) {
        await trademarkrsBankModel.updateOne({ _id: id }, { isEnabled: false });
        return await trademarkrsBankModel.findOne({ _id: id });
    } */

    /* public async updatePointBankById(bodyUpdate: any) {
        await trademarkrsBankModel.updateOne({ _id: bodyUpdate.id }, bodyUpdate);
        return await trademarkrsBankModel.findOne({ _id: bodyUpdate.id });
    } */
}

export const trademarksBankpointsService = new TrademarksBankPointsService();