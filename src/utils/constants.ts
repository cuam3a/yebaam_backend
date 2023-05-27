export class ConstantsRS {
    // Generals
    static PACKAGE_LIMIT = 100;
    static DURATION_STORY_IN_HOURS = 24;
    static INCORRECT_PASSWORD: any = { code: 'ERR001', msg: 'Contraseña incorrecta' }
    static USER_DOES_NOT_EXIST: any = { code: 'ERR002', msg: 'El usuario no existe' };
    static FAILED_TO_FETCH_RECORDS: any = { code: 'ERR003', msg: 'Error al traer los registros' };
    static ERROR_SAVING_RECORD: any = { code: 'ERR004', msg: 'Error al guardar el registro' };
    static THE_RECORD_ALREDY_EXISTS: any = { code: 'ERR005', msg: 'El registro ya existe' };
    static THERE_IS_NO_VERIFICATION_CODE: any = { code: 'ERR006', msg: 'No existe un código de verificación' };
    static MAIL_IS_NECESSARY: any = { code: 'ERR007', msg: 'El correo es necesario' };
    static PLEASE_ENTER_A_VALID_MAIL: any = { code: 'ERR008', msg: 'Por favor ingrese un formato de correo válido' };
    static EMAIL_IS_NOT_VERIFY: any = { code: 'ERR009', msg: 'El correo no esta verificado' };
    static ERROR_TO_DELETE_REGISTER: any = { code: 'ERR010', msg: 'Error al eliminar registro' };
    static EXCEEDED_EMAIL_SENDED: any = { code: 'ERR011', msg: 'se excedió el número máximo de envíos' };
    static WAIT_A_MOMENT_TO_SEND_EMAIL: any = { code: 'ERR012', msg: 'Se debe esperar un momento antes de volver a enviar el código.' };
    static ERROR_TO_SEND_EMAIL: any = { code: 'ERR013', msg: 'no se a podido enviar el email' };
    static VERIFICATION_PROBLEMS: any = { code: 'ERR014', msg: 'No es posible restablecer la contraseña, el usuario tiene problemas de verificación' };
    static EXCEEDED_INTENTS_CODE: any = { code: 'ERR015', msg: 'código incorrecto, se excedió el número máximo de intentos' };
    static EXPIRATION_CODE: any = { code: 'ERR016', msg: 'El código ha expirado' };
    static INCORRECT_CODE: any = { code: 'ERR017', msg: 'código incorrecto' };
    static EMAIL_IS_NECESSARY: any = { code: 'ERR018', msg: 'el email es necesario' };
    static SERVER_ERROR: any = { code: 'ERR019', msg: 'error en el servidor' };
    static REPEAT_PROCESS_CODE: any = { code: 'ERR020', msg: 'Es necesario repetir el proceso de registro' };
    static THE_RECORD_DOES_NOT_EXIST: any = { code: 'ERR021', mjse: 'El registro no existe' };
    static INCORRECT_FILE_IMG: any = { code: 'ERR022', msg: 'El formato del archivo no es válido, formatos válidos .png, .jpeg, .gif...' };
    static ERROR_UPLOAD_FILE: any = { code: 'ERR023', msg: 'Error al subir el archivo' };
    static ERROR_UPDATING_RECORD: any = { code: 'ERR024', msg: 'Error al actualizar el registro' };
    static WRONG_TOKEN: any = { code: 'ERR025', mjse: 'Token incorrecto' }
    static ACCOUNT_FACEBOOK_REGISTER: any = { code: 'ERR026', msg: 'Cuenta con registro mediante Facebook' };
    static ACCOUNT_GOOGLE_REGISTER: any = { code: 'ERR027', msg: 'Cuenta con registro mediante Google' };
    static ACCOUNT_BOTH_REGISTER: any = { code: 'ERR028', msg: 'Cuenta con registro mediante Facebook y Google' };
    static YOUR_APPLICATION_HAS_ALREADY_BEEN_ACCEPTED: any = { code: 'ERR029', mjse: 'Su solicitud ya ha sido aceptada' }
    static YOU_DO_NOT_HAVE_A_REQUEST_WITH_THIS_USER: any = { code: 'ERR030', mjse: 'No tiene solicitud con este usuario' }
    static FAILED_ACTION: any = { code: 'ERR031', mjse: 'Fallo la acción' }
    static I_ALREADY_SEND_REQUEST: any = { code: 'ERR032', mjse: 'Ya existe una solcitud pendiente' }
    static NO_FOLLOWING_USERS: any = { code: 'ERR033', mjse: 'No estas siguiendo a este usuario' }
    static EMAIL_OTHER_PROFILE: any = { code: 'ERR034', msg: 'Ya existe otro perfil con este correo' };
    static NO_FRIENDS_FOUND: any = { code: 'ERR035', msg: 'No se encontraron amigos' };
    static NO_FOLLOWED_FOUND: any = { code: 'ERR036', msg: 'No sigues a nadie' };
    static NO_FOLLOWERS_FOUND: any = { code: 'ERR037', msg: 'No se encontraron seguidores' };
    static NO_BLOCKED_FOUND: any = { code: 'ERR038', msg: 'No hay contactos bloqueados' };
    static NO_FRIEND_REQUEST: any = { code: 'ERR039', msg: 'No tiene solicitudes de amistad' };
    static UNAUTHORIZED_ACCESS: any = { code: 'ERR040', msg: 'Acceso no autorizado' };
    static NO_CONTENT_DISPLAY: any = { code: 'ERR041', msg: 'No hay contenido para mostrar' };
    static ERROR_LOGOUT: any = { code: 'ERR042', msg: 'Error al cerrar sesión' };
    static ACCOUNT_FACEBOOK_PENDING: any = { code: 'ERR043', msg: 'Cuenta pendiente por validar mediante Facebook' };
    static ACCOUNT_GOOGLE_PENDING: any = { code: 'ERR044', msg: 'Cuenta pendiente por validar mediante Google' };
    static ACCOUNT_BOTH_PENDING: any = { code: 'ERR045', msg: 'Cuenta pendiente por validar mediante Facebook y Google' };
    static NO_USERS_FOUND: any = { code: 'ERR046', msg: 'No se encontraron usuarios' };
    static NO_BRANDS_FOUND: any = { code: 'ERR047', msg: 'No se encontraron marcas' };
    static NO_POSTS_FOUND: any = { code: 'ERR048', msg: 'No se encontraron publicaciones' };
    static EMAIL_WITH_BRAND: any = { code: 'ERR049', msg: 'Ya existe una marca registrada con este correo' };
    static NO_CLASSIFIEDS_FOUND: any = { code: 'ERR050', msg: 'No se encontraron clasificados' };
    static NO_COMMUNITIES_FOUND: any = { code: 'ERR051', msg: 'No se encontraron comunidades' };
    static NO_CHATS_FOUND: any = { code: 'ERR052', msg: 'No se encontraron salas' };
    static NO_CONTACTS_REQUEST: any = { code: 'ERR053', msg: 'No tiene solicitudes de contactos' };
    static ACCOUNT_PROFESSIONAL_ENABLED: any = { code: 'ERR054', msg: 'Ya existe una cuenta profesional activa' };
    static ACCOUNT_PROFESSIONAL_DISABLED: any = { code: 'ERR055', msg: 'Ya existe una cuenta profesional inactiva' };
    static ACCOUNT_PROFESSIONAL_NON_EXISTENT: any = { code: 'ERR056', msg: 'No existe el perfil profesional' };
    static CAN_NOT_CREATE_DOCUMENT: any = { code: 'ERR057', msg: 'No es posible crear el registro' };
    static EMAIL_WITH_USER: any = { code: 'ERR058', msg: 'Ya existe un usuario registrado con este correo' };
    static THE_RECORDS_IS_ALREADY_IN_THIS_ALBUM: any = { code: 'ERR059', msg: 'Los registros ya se encuentra en este album' };
    static ERROR_FETCHING_RECORD: any = { code: 'ERR060', mjse: 'Error al traer el registro' }
    static BEN: any = { code: 'ERR061', mjse: 'Ya aceptaron tu solicitud' }
    static ACCOUNT_DATA_PENDING: any = { code: 'ERR062', msg: 'Cuenta pendiente por validación de datos' };
    static EMAIL_WITH_PASS_CODE: any = { code: 'ERR063', msg: 'El correo ya posee un código de verificación para cambio de contraseña' };
    static NO_CONTACTS_FOUND: any = { code: 'ERR064', msg: 'No se encontraron contactos' };
    static THIS_NAME_ALREADY_EXISTS: any = { code: 'ERR065', msg: 'Este nombre ya existe' };
    static ERROR_MOVING_POST: any = { code: 'ERR066', msg: 'Error al mover registro' };
    static ERROR_WHEN_COPYING_THE_POST: any = { code: 'ERR067', msg: 'Error al copiar el registro' };
    static NO_REGISTER_FOUND: any = { code: 'ERR068', msg: 'No se encontraron registros' };
    static THE_RECORD_IS_ALREADY_IN_THIS_ALBUM: any = { code: 'ERR069', msg: 'El registro ya se encuentra en este album' };
    static ERROR_TO_SAVE_POST_REPORT: any = { code: 'ERR070', msg: 'Error al reportar contenido' };
    static POST_REPORT_ALREADY_EXIST: any = { code: 'ERR071', msg: 'Ya se reportó este contenido' };
    static NO_PROFESSIONALS_FOUND: any = { code: 'ERR072', msg: 'No se encontraron profesionales' };
    static POST_REPORT_NOT_FOUND: any = { code: 'ERR074', msg: 'No se ha reportado aún este contenido' };

    static PACKAGE_NOT_FOUND: any = { code: 'ERR076', msg: 'No se encuentra el paquete' };
    static PACKAGE_NOT_POINTS: any = { code: 'ERR077', msg: 'No hay puntos diponibles' };
    static PACKAGE_NOT_POINTS_AVALIABLE: any = { code: 'ERR078', msg: 'No hay puntos suficientes para la operación' };
    static INCORRECT_FILE_FORMAT: any = { code: 'ERR073', msg: 'El formato del archivo no es válido' };
    static POST_UNREPORTED: any = { code: 'ERR074', msg: 'No se ha reportado aún este contenido' };
    static ONLY_RECORD: any = { code: 'ERR075', msg: 'Ya existe un registro, debe actualizarlo' };
    static SELECT_TYPE_REPORT: any = { code: 'ERR079', msg: 'Debe seleccionar un tipo de reporte' };
    static NO_LIMIT_REPORT_EXISTS: any = { code: 'ERR080', msg: 'No existen límites de reportes estipulados' };
    static DATAPOINTS_NOT_VALID: any = { code: 'ERR081', msg: 'el objeto data points no es válido' };
    static CANNOT_CREATE_QR_CODE: any = { code: 'ERR82', msg: 'No se puede crear el código QR' };
    static NO_RECORDS: any = { code: 'ERR083', msg: 'No hay registros' };
    static FIELD_NOT_EXISTS: any = { code: 'ERR083', msg: 'verifique los campos del formulario' };
    static EXCEEDS_THE_LIMIT_OF_MEMBERS: any = { code: 'ERR084', msg: 'Excede el límite de miembros' };
    static ERROR_SENDING_MESSAGE: any = { code: 'ERR085', msg: 'Error al enviar el mensaje' };
    static CANNOT_DELETE_RECORD: any = { code: 'ERR086', msg: 'No es posible eliminar el registro' };
    static CANNOT_CANCEL_REPORT: any = { code: 'ERR087', msg: 'No es posible cancelar el reporte' };
    static CANNOT_RUN_ACTION: any = { code: 'ERR088', msg: 'No es posible realizar esta acción' };
    static THERE_ARENT_CHALLENGES: any = { code: 'ERR089', msg: 'No hay retos que cumplir' };
    static MUST_ASSOCIATE_CATEGORY: any = { code: 'ERR090', msg: 'Debe asociar una categoría' };
    static MUST_ASSOCIATE_CERTIFICATE_TYPE: any = { code: 'ERR091', msg: 'Debe asociar un tipo de certificado' };
    static MUST_ASSOCIATE_SUBCATEGORIE: any = { code: 'ERR092', msg: 'Debe asociar una subcategoría' };
    static CANNOT_UPDATE_RECORD: any = { code: 'ERR093', msg: 'No es posible actualizar el registro' };
    static CONTENT_ALREADY_SAVED: any = { code: 'ERR094', msg: 'Este contenido ya se guardó' };
    static MAIL_IN_USE: any = { code: 'ERR095', msg: 'El correo ya está en uso' };
    static COMMUNITY_REPORT_ALREADY_EXIST: any = { code: 'ERR096', msg: 'Ya se reportó esta comunidad' };
    static ERROR_TO_SAVE_COMMUNITY_REPORT: any = { code: 'ERR097', msg: 'Error al reportar comunidad' };
    static COMMUNITY_UNREPORTED: any = { code: 'ERR098', msg: 'No se ha reportado aún esta comunidad' };
    static SCORE_MUST_BE_HIGHER: any = { code: 'ERR099', msg: 'El puntaje requerido debe ser mayor a los existentes' };
    static SCORE_MUST_BE_WITHIN_RANGE: any = { code: 'ERR100', msg: 'El puntaje requerido debe estar dentro de un rango permitido' };
    static THE_REGISTRY_IS_IN_USE: any = { code: 'ERR101', msg: 'El registro está en uso' };
    static CLASSIFIED_MUST_CONTAIN_AN_IMAGE: any = { code: 'ERR102', msg: 'El clasificado debe contener almenos una imagen' };
    static YOUR_ARE_BLOCKED_FROM_THIS_COMMUNITY: any = { code: 'ERR103', msg: 'Estas bloqueado/a de esta comunidad' };
    static NO_CONVERSATION: any = { code: 'ERR104', msg: 'No hay conversación' };

    // Códigos de acciones en sistema
    static SYSTEM_ACTION_ADD_FRIEND: any = { code: 'ACT001', msg: 'Añadir amigo' }; // Usuarios
    static SYSTEM_ACTION_FOLLOW_USER: any = { code: 'ACT002', msg: 'Seguir usuario' }; // Usuarios
    static SYSTEM_ACTION_UPLOAD_PHOTO: any = { code: 'ACT003', msg: 'Subir foto' }; // Posts
    static SYSTEM_ACTION_UPLOAD_VIDEO: any = { code: 'ACT004', msg: 'Subir video' }; // Posts
    static SYSTEM_ACTION_UPLOAD_AUDIO: any = { code: 'ACT005', msg: 'Subir audio' } // Posts;
    static SYSTEM_ACTION_UPLOAD_TEXT: any = { code: 'ACT006', msg: 'Subir texto' } // Posts;
    static SYSTEM_ACTION_SHARE_TEXT: any = { code: 'ACT007', msg: 'Compartir texto' }; // Posts
    static SYSTEM_ACTION_SHARE_VIDEO: any = { code: 'ACT008', msg: 'Compartir video' }; // Posts
    static SYSTEM_ACTION_SHARE_IMAGE: any = { code: 'ACT009', msg: 'Compartir imagen' }; // Posts
    static SYSTEM_ACTION_UPLOAD_STORY: any = { code: 'ACT010', msg: 'Subir historia' }; // Story
    static SYSTEM_ACTION_LIKE_TO_POST: any = { code: 'ACT011', msg: 'Like a post' }; // Posts
    static SYSTEM_ACTION_RECEIVE_LIKE_TO_POST: any = { code: 'ACT012', msg: 'Recibir like a post' }; // Posts
    static SYSTEM_ACTION_AUTHENTICATE_ACCOUNT: any = { code: 'ACT013', msg: 'Autenticar cuenta' };
    static SYSTEM_ACTION_SCAN_QR: any = { code: 'ACT014', msg: 'Escanear código QR' };
    static SYSTEM_ACTION_GET_FOLLOWER: any = { code: 'ACT015', msg: 'Obtener seguidor' }; // Usuarios
    static SYSTEM_ACTION_SHARE_YOUR_TEXT: any = { code: 'ACT016', msg: 'Que compartan su publicación con texto' }; // Posts
    static SYSTEM_ACTION_SHARE_YOUR_VIDEO: any = { code: 'ACT017', msg: 'Que compartan su publicación con video' }; // Posts
    static SYSTEM_ACTION_SHARE_YOUR_IMAGE: any = { code: 'ACT018', msg: 'Que compartan su publicación con imágen' }; // Posts
    static SYSTEM_ACTION_RECEIVE_COMMENTS: any = { code: 'ACT019', msg: 'Recibir comentarios' }; // Comentarios
}