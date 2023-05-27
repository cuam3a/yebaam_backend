const permissionRankModel = require('../../../models/admin/permissionRanks/permissionRank.model');

class PermissionRanService {

    public async createPermissionRank(body: { name: string, description: string }) {
        const permissionCreated = new permissionRankModel(body);
        return await permissionCreated.save();
    }

    public async updatePermiisionRankById(id: string, body: { name: string, description: string }) {
        await permissionRankModel.updateOne({ _id: id }, body);
        return await permissionRankModel.findOne({ _id: id });
    }

    public async deletePermiisionRankById(id: string) {
        return await permissionRankModel.deleteOne({ _id: id });
    }

    public async getPermiisionRankById(id: string) {
        return await permissionRankModel.findOne({ _id: id });
    }

    public async getAllPermiisionRank() {
        return await permissionRankModel.find({});
    }
}

export const permissionRankService = new PermissionRanService();