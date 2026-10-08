import crypto from "crypto";

import { disclosureModel } from "../models/disclosureModel.js";
import { certificateModel } from "../models/certificateModel.js";
import { companyModel } from "../models/companyModel.js";
import { merkleModel } from "../models/merkleModel.js";
import { blockchainTransactionModel } from "../models/blockchainTransactionModel.js";

import { generateCertificatePdf } from "./certificatePDFService.js";
import { s3Service } from "./s3Service.js";


export const certificateService = {

    async createCertificate(disclosureId) {

        // 1. Get disclosure
        const disclosure =
            await disclosureModel.getDisclosure(disclosureId);

        if (!disclosure) {
            throw new Error("Disclosure not found");
        }


        // 2. Certificate only for VERIFIED disclosure
        if (disclosure.status !== "VERIFIED") {
            throw new Error(
                "Certificate can only be generated for a verified disclosure"
            );
        }


        // 3. Idempotency - don't generate duplicate certificate
        const existingCertificate =
            await certificateModel.getByDisclosureId(disclosureId);

        if (existingCertificate) {
            return existingCertificate;
        }


        // 4. Get company
        const company =
            await companyModel.getCompany(disclosure.company_id);

        if (!company) {
            throw new Error("Company not found");
        }


        // 5. Get Merkle root
        const merkleRoots =
            await merkleModel.getByDisclosure(disclosureId);

        if (!merkleRoots.length) {
            throw new Error("Merkle root not found");
        }

        const merkleRoot = merkleRoots[0];


        // 6. Get blockchain transaction
        const blockchainTransactions =
            await blockchainTransactionModel
                .getByDisclosure(disclosureId);

        if (!blockchainTransactions.length) {
            throw new Error("Blockchain transaction not found");
        }

        const blockchainTransaction =
            blockchainTransactions[0];


        // 7. Generate certificate number
        const randomPart =
            crypto.randomBytes(4)
                .toString("hex")
                .toUpperCase();

        const certificateNumber =
            `CERT-ESG-${disclosure.reporting_year}-${randomPart}`;


        // 8. Generate PDF
        const pdfBuffer =
            await generateCertificatePdf({

                certificateNumber,

                companyName:
    company.company_name,

                reportingYear:
                    disclosure.reporting_year,

                verifiedAt:
                    new Date().toISOString(),

                merkleRoot:
                    merkleRoot.root_hash,

                transactionHash:
                    blockchainTransaction.transaction_hash,

                blockNumber:
                    blockchainTransaction.block_number
            });


        // 9. Hash exact PDF bytes
        const certificateHash =
            crypto
                .createHash("sha256")
                .update(pdfBuffer)
                .digest("hex");


        // 10. S3 object key
        const certificateKey =
            `certificates/${certificateNumber}.pdf`;


        // 11. Upload PDF to S3
        await s3Service.uploadBuffer(
            pdfBuffer,
            certificateKey,
            "application/pdf"
        );


        // 12. Save certificate metadata
        const certificate =
            await certificateModel.createCertificate(
                disclosureId,
                certificateNumber,
                certificateKey,
                certificateHash
            );


        return certificate;
    },

    async getCompanyCertificates(user) {
    if (user.role === "AUDITOR"  ||
        user.role === "ADMIN" ||  user.role === "REGULATOR") {
        return await certificateModel.getAllCertificates();
    }

    if (user.role === "COMPANY_USER") {
        return await certificateModel.getCertificatesByCompany(
            user.company_id
        );
    }

    throw new Error("Access denied");
},


async getCertificate(id, user) {

    const certificate =
        await certificateModel.getById(id);

    if (!certificate) {
        throw new Error("Certificate not found");
    }

    const disclosure =
        await disclosureModel.getDisclosure(
            certificate.disclosure_id
        );

    if (!disclosure) {
        throw new Error("Disclosure not found");
    }

    if (
        user.role === "COMPANY_USER" &&
        disclosure.company_id !== user.company_id
    ) {
        throw new Error("Access denied");
    }

    const downloadUrl =
        await s3Service.getSignedUrl(
            certificate.certificate_url
        );

    return {
        ...certificate,
        downloadUrl
    };
},


};