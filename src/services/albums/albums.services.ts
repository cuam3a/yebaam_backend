import { ConstantsRS } from '../../utils/constants';
import { similarServices } from '../similarservices/similar.services';
import { postSevices } from '../post/post.services';
import { socialServices } from '../social/social.services';

const albumModel = require('../../models/album/Albums.model');
const userModel = require('../../models/user/Users.model');
const trademarkModel = require('../../models/trademarks/Trademarks.model');
const communityModel = require('../../models/communities/Communities.model');
const postModel = require('../../models/post/Posts.model');

class AlbumsServices {
    public async CreateAlbumsDefault() {

        const albumProfile = {
            name: "Fotos de Perfil",
            quantity: 0,
            description: "album to save default photos profile",
            privacy: 0,
            inUse: true
        }
        const albumPhotosUpload = {
            name: "Fotos Subidas",
            quantity: 0,
            description: "album to save general photos uploaded",
            privacy: 0,
            inUse: true
        }

        try {

            const albummodelprofile = new albumModel(albumProfile);
            const albummodelphotos = new albumModel(albumPhotosUpload);

            // get all albumes
            const albumes = await albumModel.find({});

            // get album names
            let nameAlbums = albumes.map((objAlbum: any) => objAlbum.name);
            // delete repeat names
            nameAlbums = [...new Set(nameAlbums)];

            if (nameAlbums.indexOf('Fotos de Perfil') < 0) {
                const albumProfilesaved = await albummodelprofile.save();
            }

            if (nameAlbums.indexOf('Fotos Subidas') < 0) {
                const albumPhotosSaved = await albummodelphotos.save();
            }

        } catch (error) {
            console.log("error al crear", error)
        }
    }

    //#region create album by ab¿ny user
    public async createAlbumByAnyUser(body: any) {
        let albumSaved: any, albumSavedError, model: any
        await this.identifyUTCAlbumsById(body)
            .then(async (res: any) => {
                if (res) {
                    albumSavedError = ConstantsRS.THE_RECORD_ALREDY_EXISTS
                } else {
                    const albumToSave = new albumModel(body);
                    await albumToSave.save()
                        .then(async (albm: any) => {
                            await similarServices.identifyUserBrandOrCommunity(body.entityID)
                                .then(async (entity: any) => {
                                    switch (entity.type) {
                                        case 'user':
                                            model = userModel
                                            break;
                                        case 'marks':
                                            model = trademarkModel
                                            break;
                                        case 'community':
                                            model = communityModel
                                            break;
                                    }

                                    if (entity.code == 'ERR021' || entity.code != undefined) {
                                        albumSavedError = entity
                                    } else {
                                        const entityUpdate = entity;
                                        entityUpdate.albumsIDS.push(albm.id)
                                        await model.updateOne({ _id: body.entityID }, entityUpdate);
                                        albumSaved = albm
                                    }
                                })
                        })
                }
            })
        return albumSaved ? albumSaved : albumSavedError ? albumSavedError : albumSaved
    }

    public async identifyUTCAlbumsById(body: any) {
        try {
            let rta
            const userAny = await albumModel.findOne({ entityID: body.entityID, name: body.name })
            if (userAny) {
                rta = userAny
            }
            return rta
        } catch (error) {
            console.log(error);
            return ConstantsRS.ERROR_FETCHING_RECORD
        }
    }

    //#endregion

    /* public async getAlbumByNameNUser(albumName: any) {
        let rta, rtaError, success = false, response = {}
        const album = await albumModel.findOne({ name: albumName })
        if (album) {
            rta = album
            success = true
        } else {
            rtaError = ConstantsRS.ERROR_FETCHING_RECORD
            success = true
        }

        return response = {
            error: rtaError ? rtaError : null,
            success: success,
            data: rta ? rta : []
        }
    } */

    public async getAlbumsByAnyUser(entityID: string, visitorID: string) {
        let getAlbums: any = [], posts: any, postsQ: any

        const entity = await similarServices.identifyUserBrandOrCommunity(entityID)
        // console.log("entity: ", entity)
        if (!entity.code) {
            let isVisitor = entityID != visitorID;
            let privacyAllowed: any = [0, 1, 2]
            if (isVisitor) {
                if (entity.type == "user" || entity.type == "marks") {
                    let socialConnection = await socialServices.getSocialConnectionByIDS(entityID, visitorID)
                    if (!socialConnection.code) {
                        if (!socialConnection.areFriends) {
                            privacyAllowed = [0]
                        } else if (socialConnection.areFriends) {
                            privacyAllowed = [0, 2]
                        }
                    } else {
                        privacyAllowed = [0]
                    }
                }
            }

            for await (let idAlbum of entity.albumsIDS) {

                const getAlbum = await albumModel.findOne({
                    $and: [
                        { _id: idAlbum },
                        { privacy: { $in: privacyAllowed } }
                    ]
                })

                // console.log("getAlbum: ", getAlbum)

                if (getAlbum) {
                    const albumM = new albumModel(getAlbum)
                    let quantity = 0, getLastPost

                    switch (entity.type) {

                        case 'user':
                            await postModel.find({
                                $or: [
                                    { $and: [{ userID: entityID }, { albumsIDS: { $in: idAlbum } }, { typePost: 0 }, { isEnabled: true }, { privacy: { $in: privacyAllowed } }] },
                                    { $and: [{ userID: entityID }, { albumsIDS: { $in: idAlbum } }, { typePost: 1 }, { isEnabled: true }, { privacy: { $in: privacyAllowed } }] },
                                ]
                            }, (error: any, postsE: any) => {
                                if (error) throw error;
                                postsQ = postsE.filter((x: any) => x.communityID == undefined)
                            })
                            posts = await postModel.find({
                                $or: [
                                    { $and: [{ userID: entityID }, { albumsIDS: { $in: idAlbum } }, { typePost: 0 }, { isEnabled: true }, { privacy: { $in: privacyAllowed } }] },
                                    { $and: [{ userID: entityID }, { albumsIDS: { $in: idAlbum } }, { typePost: 1 }, { isEnabled: true }, { privacy: { $in: privacyAllowed } }] },
                                ]
                            }).limit(1)
                                .sort('-publicactionDate')
                            quantity = postsQ.length
                            getLastPost = posts
                            break;

                        case 'marks':
                            quantity = await postModel.find({
                                $or: [
                                    { $and: [{ trademarkID: entityID }, { albumsIDS: { $in: idAlbum } }, { typePost: 0 }, { isEnabled: true }, { privacy: { $in: privacyAllowed } }] },
                                    { $and: [{ trademarkID: entityID }, { albumsIDS: { $in: idAlbum } }, { typePost: 1 }, { isEnabled: true }, { privacy: { $in: privacyAllowed } }] },
                                ]
                            }).countDocuments()
                            getLastPost = await postModel.find({
                                $or: [
                                    { $and: [{ trademarkID: entityID }, { albumsIDS: { $in: idAlbum } }, { typePost: 0 }, { isEnabled: true }, { privacy: { $in: privacyAllowed } }] },
                                    { $and: [{ trademarkID: entityID }, { albumsIDS: { $in: idAlbum } }, { typePost: 1 }, { isEnabled: true }, { privacy: { $in: privacyAllowed } }] },
                                ]
                            })
                                .limit(1)
                                .sort('-publicactionDate')
                            break;

                        case 'community':
                            quantity = await postModel.find({
                                $or: [
                                    { $and: [{ communityID: entityID }, { albumsIDS: { $in: idAlbum } }, { typePost: 0 }, { isEnabled: true }] },
                                    { $and: [{ communityID: entityID }, { albumsIDS: { $in: idAlbum } }, { typePost: 1 }, { isEnabled: true }] },
                                ]
                            }).countDocuments()
                            getLastPost = await postModel.find({
                                $or: [
                                    { $and: [{ communityID: entityID }, { albumsIDS: { $in: idAlbum } }, { typePost: 0 }, { isEnabled: true }] },
                                    { $and: [{ communityID: entityID }, { albumsIDS: { $in: idAlbum } }, { typePost: 1 }, { isEnabled: true }] },
                                ]
                            })
                                .limit(1)
                                .sort('-publicactionDate')
                            break;
                    }

                    const coverAlbum = getLastPost[0] != undefined ? getLastPost[0].imgAndOrVideos : null
                    albumM.quantity = quantity
                    albumM.coverAlbum = coverAlbum
                    getAlbums.push(albumM)

                    // console.log("getAlbums: ", getAlbums)
                }
            }
        }

        return getAlbums
    }

    public async getAlbumByID(id: String) {
        try {
            let albums
            const getAlbums = await albumModel.findOne({ _id: id })
            getAlbums ? albums = getAlbums : albums
            return albums
        } catch (error) {
            console.log(error);
        }
    }

    public async deleteAlbumByAnyUser(id: string) {
        try {
            let deleteAlbum, model
            await postSevices.changeIsEnabledPostForAlbum(id)
            const deletedAlbum = await albumModel.findOneAndDelete({ _id: id })
            const anyUser = await similarServices.identifyUserBrandOrCommunity(deletedAlbum.entityID)
            const newArray = anyUser.albumsIDS.filter((res: String) => res != id)
            switch (anyUser.type) {
                case 'user':
                    model = userModel
                    break;
                case 'mark':
                    model = trademarkModel
                    break;
                case 'community':
                    model = communityModel
                    break;
            }
            await model.findOneAndUpdate({ _id: anyUser.id }, { albumsIDS: newArray }, { new: true })
            deletedAlbum ? deleteAlbum = deletedAlbum : deleteAlbum
            return deleteAlbum
        } catch (error) {
            console.log(error);
        }
    }

    public async updateAlbumByID(body: any) {
        try {
            let isExists = false, updateAlbum
            const albunFind = await this.getAlbumByID(body.albumID)
            const idAnyUser = await similarServices.identifyUMCWithAlbums(albunFind.entityID)
            idAnyUser.albumsIDS.forEach((res: any) => {
                if (res.name == body.name && res.id != body.albumID) {
                    isExists = true
                }
            });
            if (isExists) {
                updateAlbum = ConstantsRS.THIS_NAME_ALREADY_EXISTS
            } else {
                updateAlbum = await albumModel.findOneAndUpdate({ _id: body.albumID }, body, { new: true })
            }
            return updateAlbum
        } catch (error) {
            console.log(error);
        }
    }

    public async getAlbumsByAnyUserAndAlbumID(body: any) {
        try {
            let albums, postsAlbum
            const entity = await similarServices.identifyUserBrandOrCommunity(body.entityID)

            let isVisitor = body.entityID != body.visitorID;
            let privacyAllowed: any = [0, 1, 2]
            if (isVisitor) {
                if (entity.type == "user" || entity.type == "marks") {
                    let socialConnection = await socialServices.getSocialConnectionByIDS(body.entityID, body.visitorID)
                    if (!socialConnection.code) {
                        if (!socialConnection.areFriends) {
                            privacyAllowed = [0]
                        } else if (socialConnection.areFriends) {
                            privacyAllowed = [0, 2]
                        }
                    } else {
                        privacyAllowed = [0]
                    }
                }
            }

            switch (entity.type) {
                case 'user':
                    await postModel.find({
                        $or: [
                            { $and: [{ userID: body.entityID }, { albumsIDS: { $in: body.albumID } }, { typePost: 0 }, { isEnabled: true }, { privacy: { $in: privacyAllowed } }] },
                            { $and: [{ userID: body.entityID }, { albumsIDS: { $in: body.albumID } }, { typePost: 1 }, { isEnabled: true }, { privacy: { $in: privacyAllowed } }] },
                        ]
                    }, (error: any, postsE: any) => {
                        if (error) throw error;
                        postsAlbum = postsE.filter((x: any) => x.communityID == undefined)
                    }).populate('userID')
                        .populate('trademarkID')
                        .populate('communityID')
                        .populate('taggedUsers')
                        .populate({
                            path: 'reactionsIDS',
                            model: 'UserReactions',
                            match: { isEnabled: true },
                            populate: [
                                {
                                    path: 'userID',
                                    model: 'Users',
                                    select: 'name score profilePicture'
                                },
                                {
                                    path: 'trademarkID',
                                    model: 'Trademarks',
                                    select: 'socialReason profilePicture'
                                }
                            ]
                        })
                        .populate({
                            path: 'reportID',
                            model: 'PostsReports',
                            match: { isEnabled: true }
                        })
                        .sort('-publicactionDate')
                    break;
                case 'marks':
                    postsAlbum = await postModel.find({
                        $or: [
                            { $and: [{ trademarkID: body.entityID }, { albumsIDS: { $in: body.albumID } }, { typePost: 0 }, { isEnabled: true }, { privacy: { $in: privacyAllowed } }] },
                            { $and: [{ trademarkID: body.entityID }, { albumsIDS: { $in: body.albumID } }, { typePost: 1 }, { isEnabled: true }, { privacy: { $in: privacyAllowed } }] },
                        ]
                    }).populate('userID')
                        .populate('trademarkID')
                        .populate('communityID')
                        .populate('taggedUsers')
                        .populate({
                            path: 'reactionsIDS',
                            model: 'UserReactions',
                            match: { isEnabled: true },
                            populate: [
                                {
                                    path: 'userID',
                                    model: 'Users',
                                    select: 'name score profilePicture'
                                },
                                {
                                    path: 'trademarkID',
                                    model: 'Trademarks',
                                    select: 'socialReason profilePicture'
                                }
                            ]
                        })
                        .populate({
                            path: 'reportID',
                            model: 'PostsReports',
                            match: { isEnabled: true }
                        })
                        .sort('-publicactionDate')
                    break;
                case 'community':
                    postsAlbum = await postModel.find({
                        $or: [
                            { $and: [{ communityID: body.entityID }, { albumsIDS: { $in: body.albumID } }, { typePost: 0 }, { isEnabled: true }] },
                            { $and: [{ communityID: body.entityID }, { albumsIDS: { $in: body.albumID } }, { typePost: 1 }, { isEnabled: true }] },
                        ]
                    }).populate('userID')
                        .populate('trademarkID')
                        .populate('communityID')
                        .populate('taggedUsers')
                        .populate({
                            path: 'reactionsIDS',
                            model: 'UserReactions',
                            match: { isEnabled: true },
                            populate: [
                                {
                                    path: 'userID',
                                    model: 'Users',
                                    select: 'name score profilePicture'
                                },
                                {
                                    path: 'trademarkID',
                                    model: 'Trademarks',
                                    select: 'socialReason profilePicture'
                                }
                            ]
                        })
                        .populate({
                            path: 'reportID',
                            model: 'PostsReports',
                            match: { isEnabled: true }
                        })
                        .sort('-publicactionDate')
                    break;
            }
            postsAlbum ? albums = postsAlbum : albums
            return albums
        } catch (error) {
            console.log(error);
        }
    }

}

export const albumsServices = new AlbumsServices();