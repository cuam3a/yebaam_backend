const pointPackageModel = require('../../../models/pointPackage/pointPackage.model');
import { PointPackageInterface } from "./pointPackage.interface";
import { ConstantsRS } from '../../../utils/constants';

class PointPackagesService {

    public async createPointPackage(body: PointPackageInterface) {

        const packageToSave = new pointPackageModel(body);
        return await packageToSave.save();

    }

    public async editPointPackage(body: any) {

        const packageToEdit = await pointPackageModel.findOneAndUpdate({ _id: body.id }, body);

        if (packageToEdit) {
            return await pointPackageModel.findOne({ _id: body.id });
        }
    }

    public async getAllPointPackage() {
        // GET Only is enable packages
        return await pointPackageModel.find({ isEnabled: true });
    }

    public async getPointPackageById(id: string) {
        return await pointPackageModel.find({ _id: id });
    }

    public async deletePointPackageById(id: string) {
        let rta, rtaError
        let packageExist = await pointPackageModel.findById(id)
        if (packageExist) {
            if (!packageExist.inUse) {
                rta = await pointPackageModel.findOneAndDelete({ _id: id });
            } else {
                rtaError = ConstantsRS.THE_REGISTRY_IS_IN_USE
            }
        } else {
            rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST
        }

        return rta ? rta : rtaError
    }

    public async deactivatePointPackageById(id: string) {

        const updatePackage = await this.editPointPackage({ id, isEnabled: false });
        if (updatePackage) {
            return await pointPackageModel.findOne({ _id: id });
        }
    }

    public async getAllPointPackageDeactivate() {
        // GET Only is enable packages
        return await pointPackageModel.find({ isEnabled: false });
    }

}

export const pointPackagesService = new PointPackagesService();