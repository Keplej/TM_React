import AppErrorCode from "../constants/appErrorCode";
import { HttpStatusCode } from "../constants/http";


export class AppError extends Error {
    constructor(
        public statusCode: HttpStatusCode,
        public message: string,
        public errorCode?: AppErrorCode, // developers only pass specific error codes
    ){
        super(message);
    }
}

export default AppError;