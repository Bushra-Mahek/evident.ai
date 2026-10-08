import { certificateService } from "../services/certificateService.js";

export const certificateController = {

    async createCertificate(req, res, next) {
        try {

            const { disclosureId } = req.params;

            const certificate =
                await certificateService.createCertificate(
                    disclosureId
                );

            return res.status(201).json({
                success: true,
                certificate
            });

        } catch (error) {
            next(error);
        }
    },


    async getCompanyCertificates(req, res, next) {
        try {

            const certificates =
                await certificateService.getCompanyCertificates(
                    req.user
                );

            return res.status(200).json({
                success: true,
                certificates
            });

        } catch (error) {
            next(error);
        }
    },


    async getCertificate(req, res, next) {
        try {

            const { id } = req.params;

            const certificate =
                await certificateService.getCertificate(
                    id,
                    req.user
                );

            return res.status(200).json({
                success: true,
                certificate
            });

        } catch (error) {
            next(error);
        }
    }

};