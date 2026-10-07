import { validationService } from "../services/validation/validationService.js";

export const validateDisclosure = async (req, res, next) => {
    try {
        const result =
            await validationService.validateDisclosure(
                req.params.disclosureId
            );

        return res.status(200).json({
            message: "Disclosure validation completed",
            valid: result.valid,
            summary: result.summary,
            results: result.results
        });

    } catch (err) {
        next(err);
    }
};


export const getValidationResults = async (req, res, next) => {
    try {
        const results =
            await validationService.getValidationResults(
                req.params.disclosureId
            );

        return res.status(200).json({
            results
        });

    } catch (err) {
        next(err);
    }
};