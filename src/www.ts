import app from './app';
import express from "express";
import * as bodyParser from "body-parser";
import cors = require("cors");
import * as path from "path";
import cookieParser = require("cookie-parser");
import { NextFunction, Response, Request } from "express";
const upload = require("express-fileupload");
// import routes
import loginRoutes from "./routes/login/login.routes";
import adminRoutes from "./routes/admin/admin.routes";
import userRoutes from "./routes/user/user.routes";
import awardRoutes from "./routes/award/awards.routes";
import challengeRoutes from "./routes/challenges/challenges.routes";
import searchRoutes from "./routes/search/search.routes";
import postRoutes from "./routes/post/post.routes";
import albumRoutes from "./routes/album/album.routes";
import socialRoutes from "./routes/social/social.routes";
import trademarkRoutes from "./routes/trademarks/trademarks.routes";
import tokenRoutes from "./routes/token/token.routes";
import chatsRoutes from './routes/chats/chats.routes';
import reactionRoutes from "./routes/reaction/reaction.routes";
import userReactionRoutes from "./routes/userreactions/userreaction.routes";
import commentRoutes from "./routes/comments/comment.routes";
import replyToCommentRoutes from "./routes/replytocomment/replytocomment.routes";
import classifiedsRouter from './routes/classifieds/classifieds.routes';
import communitiesRoutes from './routes/communities/communities.routes';
import trendRoutes from './routes/trend/trend.routes';
import storiesRoutes from './routes/stories/stories.routes';
import certificatesRoutes from './routes/certificates/certificates.routes';
import professionalProfilleRoutes from './routes/professionalprofile/professionalprofile.routes';
import studyRoutes from './routes/study/study.routes';
import experienceRoutes from './routes/experience/experience.routes';
import professionalPostRoutes from './routes/professionalpost/professionalpost.routes';
import skillRoutes from './routes/skill/skill.routes';
import skillProfessionalRoutes from './routes/skill/skillProfesional.routes';
import landingsRoutes from './routes/landings/landings.routes';
import postReportRoutes from './routes/postreport/postreport.routes';
import awsRouter from './routes/aws/aws.routes';
import pointPackageRoutes from './routes/pointPackage/pointPackage.routes';
import trademarksBankPoints from './routes/trademarks/trademarksBankPoints.routes';
import typeOfReportRoutes from './routes/postreport/typeofreport.routes';
import reportingLimitRoutes from './routes/postreport/reportinglimit.routes';
import qrcodeRouter from './routes/qrcode/qrcode.routes';
import typeOfAwardRouter from './routes/award/typeofawards.routes';
import systemActionRoutes from './routes/systemactions/systemaction.routes';
import banLimitRoutes from './routes/postreport/banlimit.routes';
import mercadoRoutes from './routes/mercadoPago/mercadoPago.routes';
import rankRoutes from './routes/admin/rank.routes';
import notificationRoutes from './routes/notifications/notifications.routes';
import certificateClassTypesRoutes from './routes/certificates/certificateclasstypes.routes';
import sellersRatingRoutes from './routes/sellersrating/sellersrating.routes';
import generalLimitRoutes from './routes/generallimit/generallimit.routes';
import contentSavedRoutes from './routes/savedcontents/savedcontents.routes';
import userChallengesRoutes from './routes/challenges/userchallenges.routes';
import userBadgesRoutes from './routes/userbadges/userbadge.routes';
import locationsRoutes from './routes/locations/locations.routes';
import postRequestRoutes from './routes/postrequest/postrequest.routes';
import vendorBlockingRoutes from './routes/vendorblocking/vendorblocking.routes';
import communityReportRoutes from './routes/communityreport/communityreport.routes';
import userRankingRoutes from './routes/userranking/userranking.routes';
import brandRankingRoutes from './routes/brandranking/brandranking.routes';
import pqrsRoutes from "./routes/pqrs/pqrs.routes";
import pqrsadminRoutes from "./routes/pqrs/pqrsadmin.routes";
import professionalCommunitiesRoutes from './routes/communitiesprofessional/ProfessionalCommunities.routes';
import colorsRouter from './routes/colors/colors.routes';
import userSettingsRoutes from './routes/usersettings/usersettings.routes';
import logoutRoutes from './routes/login/logout.routes';
import regulationswithusersRoutes from './routes/regulationswithusers/regulationswithusers.routes';

// Workers
import { createCountries } from "./services/locations/countriesWorker";
import { createStates } from "./services/locations/statesWorker";
import { createCities } from "./services/locations/citiesWorker";

// import and connect BD
import "./config/global";
const server = app.instance;

//#region Config
/* server.app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
); */
server.app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

server.app.use(bodyParser.json({ limit: "10mb" }));
server.app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
server.app.use(cookieParser());
server.app.use(express.static(path.join(__dirname, "public")));
//#endregion

//#region Create Path
server.app.use(
  upload({
    createParentPath: true,
  })
);
//#endregion

//#region Get Response
server.app.get("/", (req: Request, res: Response) => {
  res.send("Hola mi pequeño saltamontes");
});
//#endregion

//#region Ipmports routes
server.app.use("/api/login", loginRoutes);
server.app.use("/api/logout", logoutRoutes);
server.app.use("/api/admin", adminRoutes);
server.app.use("/api/user", userRoutes);
server.app.use("/api/award", awardRoutes);
server.app.use("/api/challenge", challengeRoutes);
server.app.use("/api/search", searchRoutes);
server.app.use("/api/post", postRoutes);
server.app.use("/api/album", albumRoutes);
server.app.use("/api/social", socialRoutes);
server.app.use("/api/trademark", trademarkRoutes);
server.app.use("/api/kento", tokenRoutes);
server.app.use("/api/chats", chatsRoutes);
server.app.use("/api/reaction", reactionRoutes);
server.app.use("/api/userreaction", userReactionRoutes);
server.app.use("/api/comment", commentRoutes);
server.app.use("/api/replytocomment", replyToCommentRoutes);
server.app.use('/api/classifieds', classifiedsRouter);
server.app.use('/api/communities', communitiesRoutes);
server.app.use("/api/trends", trendRoutes);
server.app.use("/api/stories", storiesRoutes)
server.app.use("/api/certificate", certificatesRoutes);
server.app.use("/api/professional", professionalProfilleRoutes);
server.app.use("/api/study", studyRoutes);
server.app.use("/api/experience", experienceRoutes);
server.app.use("/api/professionalpost", professionalPostRoutes);
server.app.use("/api/skill", skillRoutes);
server.app.use("/api/skillProfessional", skillProfessionalRoutes);
server.app.use("/api/landings", landingsRoutes);
server.app.use("/api/postreport", postReportRoutes);
server.app.use("/api/get-media", awsRouter);
server.app.use("/api/point-package", pointPackageRoutes);
server.app.use("/api/trademark-point", trademarksBankPoints);
server.app.use("/api/typeofreport", typeOfReportRoutes);
server.app.use("/api/reportinglimit", reportingLimitRoutes);
server.app.use("/api/qrcode", qrcodeRouter);
server.app.use("/api/typeofaward", typeOfAwardRouter);
server.app.use("/api/systemaction", systemActionRoutes);
server.app.use("/api/banlimit", banLimitRoutes);
server.app.use("/api/payment", mercadoRoutes);
server.app.use("/api/rank", rankRoutes);
server.app.use("/api/notifications", notificationRoutes);
server.app.use("/api/certificatetypes", certificateClassTypesRoutes);
server.app.use("/api/sellersrating", sellersRatingRoutes);
server.app.use("/api/generallimit", generalLimitRoutes);
server.app.use("/api/contentsaved", contentSavedRoutes);
server.app.use("/api/userchallenges", userChallengesRoutes);
server.app.use("/api/userbadges", userBadgesRoutes);
server.app.use("/api/pqrs", pqrsRoutes);
server.app.use("/api/pqrsadmin", pqrsadminRoutes);
server.app.use("/api/locations", locationsRoutes);
server.app.use("/api/professionalcommunities", professionalCommunitiesRoutes);
server.app.use("/api/colors", colorsRouter);
server.app.use("/api/postrequest", postRequestRoutes);
server.app.use("/api/vendorblocking", vendorBlockingRoutes);
server.app.use("/api/communityreport", communityReportRoutes);
server.app.use("/api/usersettings", userSettingsRoutes);
server.app.use("/api/userranking", userRankingRoutes);
server.app.use("/api/brandranking", brandRankingRoutes);
server.app.use("/api/regulationswithusers", regulationswithusersRoutes);
//#endregion

//#region Config files
server.app.use("/files/img", express.static(`${__dirname}/storage/img/`));

server.app.get(/.*/, (req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Content-Type", "text/html");
  res.sendFile(__dirname + "/public/index.html");
});
//#endregion

//#region config errors
server.app.use((req: Request, res: Response, next: NextFunction) => {
  var err: any = new Error("Not Found");
  err["status"] = 404;
  next(err);
});

if (server.app.get("env") === "development") {
  server.app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    res.status(error["status"] || 500);
    res.send({
      message: error.message,
      error,
    });
  });
}
//#endregion

//#endregion


server.start(() => {
  console.log('servidor corriendo en el puerto', server.port);
  // console.log(GlobalConstants.Host);
  // createCountries()
  // createStates()
  // createCities()
})