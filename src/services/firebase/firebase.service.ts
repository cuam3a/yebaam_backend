import * as admin from "firebase-admin";
import { database } from "firebase-admin";
let serviceAccount = require('../../utils/firebase/notifications-tudotspot-firebase-adminsdk-gtura-f3044b24a0.json')
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: ''
})
class FirebaseNotifications{
    public async sendNotifyToDevice(body:any){
        try {

            let registrationToken = body.registrationToken, rta;

            // mensaje que se envía
            let payload ={
                data: body.data
            }
            
            //configuraciones o opciones del mensaje
            let options = {
                priority: 'high',
                timeToLive: 60 * 60 * 24
            }

            rta = await admin.messaging().sendToDevice(registrationToken, payload, options)
            .then((res:any)=>{
                console.log('send message: ',res);
            })
            .catch((res:any)=>{
                console.log('send message: ',res);
            })
            return rta
        } catch (error) {
            console.log(error);
        }
    }
}

export const firebaseNotifications = new FirebaseNotifications()