import { ConstantsRS } from "../../utils/constants";
import { awsServiceS3 } from '../aws/aws.services';

const rankModel = require('../../models/admin/ranks/Ranks.model');

class RankService {
    public async createRank(body: any, files: any) {
        let rta, rtaError, fileSaved, grayFileSaved, thumbnailFileSaved, file
        const rankExist = await rankModel.findOne({
            $or: [
                { name: body.name },
                { requiredScore: body.requiredScore },
                { requiredScore: { $gt: body.requiredScore } }
            ]
        })

        if (!rankExist) {
            if (files != undefined) {
                if (files.files) {
                    file = files.files;
                    const objSaveColorFile = {
                        entityId: body.adminID,
                        file
                    }
                    fileSaved = await awsServiceS3.UploadFile(objSaveColorFile);
                }

                if (files.grayfiles) {
                    file = files.grayfiles;
                    const objSaveGrayFile = {
                        entityId: body.adminID,
                        file
                    }
                    grayFileSaved = await awsServiceS3.UploadFile(objSaveGrayFile);
                }

                if (files.thumbnailfiles) {
                    file = files.thumbnailfiles;
                    const objSaveThumbnailFile = {
                        entityId: body.adminID,
                        file
                    }
                    thumbnailFileSaved = await awsServiceS3.UploadFile(objSaveThumbnailFile);
                }
            }


            let quantityRanks = await rankModel.find({}).countDocuments()

            const rankToSave = new rankModel(body)
            rankToSave.image = fileSaved
            rankToSave.grayImage = grayFileSaved
            rankToSave.thumbnailImage = thumbnailFileSaved

            if (quantityRanks == 0) {
                rankToSave.default = true
                rankToSave.requiredScore = 0
            }
            rankToSave.order = quantityRanks + 1

            const rankSaved = await rankToSave.save();
            if (!rankSaved.code) {
                rta = rankSaved

                const latestRank = await rankModel.findOne({ latest: true })
                if (latestRank) {
                    await rankModel.findOneAndUpdate({ _id: latestRank.id }, { latest: false }, { new: true })
                }
            } else {
                rtaError = ConstantsRS.ERROR_SAVING_RECORD
            }
        } else {
            if (rankExist.requiredScore == body.requiredScore || rankExist.name == body.name) {
                rtaError = ConstantsRS.THE_RECORD_ALREDY_EXISTS
            } else if (rankExist.requiredScore > body.requiredScore) {
                rtaError = ConstantsRS.SCORE_MUST_BE_HIGHER
            }
        }

        return rta ? rta : rtaError
    }

    public async updateRankById(body: any, files: any) {
        let rta, rtaError, rankToUpdate, fileSaved, grayFileSaved, thumbnailFileSaved, file, update = false
        const rankExist = await rankModel.findById(body.id)
        if (rankExist) {
            let prevRank = await rankModel.findOne({ requiredScore: { $lt: rankExist.requiredScore } }) // Próximo rango al aplicado
            let nextRank = await rankModel.findOne({ requiredScore: { $gt: rankExist.requiredScore } }) // Próximo rango al aplicado

            if (rankExist.requiredScore == body.requiredScore) {
                update = true
            } else if (!prevRank && nextRank) { // Modifica el 1ro
                if (body.requiredScore == 0) {
                    update = true
                }
            } else if (prevRank && !nextRank) { // Modifica el último
                if (body.requiredScore > prevRank.requiredScore) {
                    update = true
                }
            } else if (!prevRank && !nextRank) { // Modifica el por defecto
                if (body.requiredScore == 0) {
                    update = true
                }
            } else if (prevRank && nextRank) { // Modifica uno del medio
                if (body.requiredScore > prevRank.requiredScore && body.requiredScore < nextRank.requiredScore) {
                    update = true
                }
            }

            if (update) {
                const rankAlredyExist = await rankModel.findOne({
                    $and: [
                        { _id: { $ne: body.id } },
                        {
                            $or: [
                                { name: body.name },
                                { requiredScore: body.requiredScore }
                            ]
                        }
                    ]
                })

                if (!rankAlredyExist) {
                    if (files != undefined) {
                        if (files.files) {
                            file = files.files;
                            const objSaveColorFile = {
                                entityId: body.adminID,
                                file
                            }
                            fileSaved = await awsServiceS3.UploadFile(objSaveColorFile);
                            body.image = fileSaved
                        }

                        if (files.grayfiles) {
                            file = files.grayfiles;
                            const objSaveGrayFile = {
                                entityId: body.adminID,
                                file
                            }
                            grayFileSaved = await awsServiceS3.UploadFile(objSaveGrayFile);
                            body.grayImage = grayFileSaved
                        }

                        if (files.thumbnailfiles) {
                            file = files.thumbnailfiles;
                            const objSaveThumbnailFile = {
                                entityId: body.adminID,
                                file
                            }
                            thumbnailFileSaved = await awsServiceS3.UploadFile(objSaveThumbnailFile);
                            body.thumbnailImage = thumbnailFileSaved
                        }
                    }

                    rankToUpdate = await rankModel.findOneAndUpdate({ _id: body.id }, body, { new: true })

                    if (rankToUpdate) {
                        rta = rankToUpdate
                    } else {
                        rtaError = ConstantsRS.ERROR_UPDATING_RECORD
                    }
                } else {
                    rtaError = ConstantsRS.THE_RECORD_ALREDY_EXISTS
                }
            } else {
                rtaError = ConstantsRS.SCORE_MUST_BE_WITHIN_RANGE
            }
        } else {
            rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST
        }

        return rta ? rta : rtaError
    }

    public async getRankById(body: any) {
        let rta, rtaError
        const rank = await rankModel.findById(body.id)

        if (rank) {
            rta = rank
        } else {
            rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST
        }

        return rta ? rta : rtaError
    }

    public async getAllRanks() {
        const ranks = await rankModel.find()
        return ranks
    }

    public async deleteRankById(body: any) {
        let rta, rtaError
        const rankExist = await rankModel.findById(body.id).exec()

        if (rankExist) {
            if (!rankExist.inUse) {
                const rankToDelete = await rankModel.deleteOne({ _id: body.id });

                if (rankToDelete) {
                    rta = "Rango eliminado satisfactoriamente"

                    if (rankExist.latest == true) {
                        const latestRank = await rankModel.findOne().sort({ creationDate: -1 })
                        if (latestRank) {
                            await rankModel.findOneAndUpdate({ _id: latestRank.id }, { latest: true }, { new: true })
                        }
                    }
                } else {
                    rtaError = ConstantsRS.ERROR_TO_DELETE_REGISTER
                }
            } else {
                rtaError = ConstantsRS.THE_REGISTRY_IS_IN_USE
            }
        } else {
            rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST
        }

        return rta ? rta : rtaError
    }

    /* public async addPermissionRankById(id: string, permissionId: string) {

        const rank = await rankModel.findOne({ _id: id });
        if (!rank) throw ConstantsRS.THE_RECORD_DOES_NOT_EXIST;

        const permissions = rank.permissions;

        //add new permission
        permissions.push(permissionId);

        //update document
        await this.updateRankById(id, { permissions });
        return this.getRankById(id);
    } */

    /* public async deletePermissionRankById(id: string, permissionId: string) {

        const rank = await rankModel.findOne({ _id: id });
        if (!rank) throw ConstantsRS.THE_RECORD_DOES_NOT_EXIST;

        let permissions = rank.permissions;

        //delete permission
        permissions = permissions.filter((id: string) => id != permissionId);

        //update document
        await this.updateRankById(id, { permissions });
        return this.getRankById(id);
    } */

}

export const rankService = new RankService();