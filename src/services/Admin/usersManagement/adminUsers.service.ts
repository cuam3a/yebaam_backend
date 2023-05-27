import { awsServiceS3 } from "../../aws/aws.services";
import Server from "../../../app";
const adminUsersModel = require("../../../models/admin/usersManagement/UserAdministrators.model");
const bcrypt = require("bcrypt");

class AdminUsersServices {
  public async createAdminUser(body: any, files: any) {
    try {
      const server = Server.instance;
      let adminUserSaved, fileSaved;
      if (files != undefined) {
        console.log(files);
        if (files.files) {
          const file = files.files;
          const objSaveFile = {
            entityId: body.id,
            file,
          };
          fileSaved = await awsServiceS3.UploadFile(objSaveFile);
        }
      }
      const getAdminUser = await this.getAdminUserByEmail(body.email);
      if (!getAdminUser) {
        const adminUserToSaved = new adminUsersModel(body);
        adminUserToSaved.password = bcrypt.hashSync(body.password, 10);
        adminUserToSaved.profilePicture = fileSaved;
        adminUserSaved = await adminUserToSaved.save();
        if (adminUserSaved) {
          await server.io.emit("user-connect", adminUserSaved.id);
        }
      }
      return adminUserSaved;
    } catch (error) {
      console.log(error);
    }
  }

  public async getAdminUserByName(name: String) {
    try {
      const getAdminUser = await adminUsersModel
        .findOne({ name: name })
        .populate("adminRoleID");
      return getAdminUser;
    } catch (error) {
      console.log(error);
    }
  }

  public async getAdminUserByEmail(email: String) {
    try {
      const getAdminUser = await adminUsersModel
        .findOne({ email: email })
        .populate("adminRoleID");
      return getAdminUser;
    } catch (error) {
      console.log(error);
    }
  }

  public async getAdminUserById(adminUserId: String) {
    try {
      const getAdminUser = await adminUsersModel
        .findOne({ _id: adminUserId })
        .populate("adminRoleID");
      return getAdminUser;
    } catch (error) {
      console.log(error);
    }
  }

  public async getAllAdminUsers() {
    try {
      const getAdminUser = await adminUsersModel
        .find({})
        .populate("adminRoleID");
      return getAdminUser;
    } catch (error) {
      console.log(error);
    }
  }

  public async getAdminUsersByRole(body: any) {
    try {
      const getAdminUser = await adminUsersModel
        .find({
          $and: [{ adminRoleID: { $in: [body.roleId] } }, { isEnabled: true }],
        })
        .populate("adminRoleID");
      return getAdminUser;
    } catch (error) {
      console.log(error);
    }
  }

  public async getAdminUsersByCodeOfRole(body: any) {
    try {
      const getAdminUser = await adminUsersModel
        .find({ isEnabled: true })
        .populate({
          path: "adminRoleID",
          model: "AdministratorRoles",
          match: { code: body.code },
        });
      return getAdminUser;
    } catch (error) {
      console.log(error);
    }
  }

  public async searchAdminUsers(body: any) {
    try {
      const getAdminPermission = await adminUsersModel
        .find({
          name: { $regex: body.search, $options: "i" },
        })
        .populate("adminRoleID");
      return getAdminPermission;
    } catch (error) {
      console.log(error);
    }
  }

  public async updateAdminUser(body: any, files: any) {
    try {
      let adminUserUpdate, fileSaved, dataToUpdate: any;
      if (files != undefined) {
        if (files.files) {
          const file = files.files;
          const objSaveFile = {
            entityId: body.id,
            file,
          };
          fileSaved = await awsServiceS3.UploadFile(objSaveFile);
        }
      }
      if (fileSaved) {
        dataToUpdate = {
          ...body,
          profilePicture: fileSaved,
        };
      } else {
        dataToUpdate = body;
      }
      const getAdminUser = await this.getAdminUserByEmail(body.email);
      if (!getAdminUser || getAdminUser.id == body.adminUserId) {
        adminUserUpdate = await adminUsersModel
          .findOneAndUpdate({ _id: body.adminUserId }, dataToUpdate, {
            new: true,
          })
          .populate("adminRoleID");
      }
      return adminUserUpdate;
    } catch (error) {
      console.log(error);
    }
  }

  public async deleteAdminUser(body: any) {
    try {
      let adminUserDelete;
      adminUserDelete = await adminUsersModel
        .findOneAndDelete({ _id: body.adminUserId })
        .populate("adminRoleID");
      return adminUserDelete;
    } catch (error) {
      console.log(error);
    }
  }
}

export const adminUsersServices = new AdminUsersServices();
