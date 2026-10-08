import s3 from "../config/s3.js";
import {
    PutObjectCommand,
    GetObjectCommand
} from "@aws-sdk/client-s3";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";


export const s3Service = {

    async uploadBuffer(buffer, key, contentType) {

        const command = new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: key,
            Body: buffer,
            ContentType: contentType
        });

        await s3.send(command);

        return key;
    },


    async getSignedUrl(key) {

        const command = new GetObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: key
        });

        return await getSignedUrl(
            s3,
            command,
            {
                expiresIn: 300
            }
        );
    }

};