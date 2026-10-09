import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    runValidation,
    getValidationResults
} from "../api/validationApi.js";

import {
    getDisclosure,
    deleteDisclosure,
    submitDisclosure,
    getDisclosureReview
} from "../api/disclosureApi.js";

import {
    getDocumentsByDisclosure,
    uploadDocument,
    getDocument
} from "../api/documentApi.js";

import { getMetrics } from "../api/metricsApi.js";

import {
    createDataPoint,
    getDataPointsByDisclosure,
    updateDataPoint
} from "../api/dataPointApi.js";
import "./Disclosure.css";

export function Disclosure() {

    const { disclosureId } = useParams();
    const navigate = useNavigate();


    // =========================
    // DISCLOSURE STATE
    // =========================

    const [disclosure, setDisclosure] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // =========================
    // DATA POINT STATE
    // =========================

    const [metrics, setMetrics] = useState([]);

    const [dataPoints, setDataPoints] = useState([]);

    const [showAddBtn, setShowAddBtn] = useState(false);

    const [editDataPointId, setEditDataPointId] = useState(null);


    //evidence state
    const [documents, setDocuments] = useState([]);

const [selectedFile, setSelectedFile] = useState(null);

const [uploadingDocument, setUploadingDocument] = useState(false);


    // Form for creating a new data point

    const [bufferForm, setBufferForm] = useState({
        metricId: "",
        value: "",
        periodStart: "",
        periodEnd: ""
    });


    // Form for editing an existing data point

    const [editBufferForm, setEditBufferForm] = useState({
        value: "",
        periodStart: "",
        periodEnd: ""
    });

    //disclsourereview
    const [crossVerificationResults, setCrossVerificationResults] = useState([]);


//validation states
const [validationResults, setValidationResults] = useState([]);
const [validationSummary, setValidationSummary] = useState(null);
const [validationLoading, setValidationLoading] = useState(false);

    // =========================
    // LOAD DISCLOSURE
    // =========================

    useEffect(() => {

        const loadDisclosure = async () => {

            try {

                const data = await getDisclosure(disclosureId);

                setDisclosure(data.disclosure);

            }
            catch (error) {

                console.error(
                    error.response?.data?.message ||
                    "Failed to load disclosure"
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load disclosure"
                );

            }
            finally {

                setLoading(false);

            }

        };


        loadDisclosure();

    }, [disclosureId]);


    // =========================
    // LOAD METRICS
    // =========================

    useEffect(() => {

        const loadMetrics = async () => {

            try {

                const data = await getMetrics();

                setMetrics(data);

            }
            catch (error) {

                console.error(
                    error.response?.data?.message ||
                    "Failed to load metrics"
                );

            }

        };


        loadMetrics();

    }, []);


    // =========================
    // LOAD DATA POINTS
    // =========================

    useEffect(() => {

        const loadDataPoints = async () => {

            try {

                const data =
                    await getDataPointsByDisclosure(disclosureId);

                setDataPoints(data.dataPoints);

            }
            catch (error) {

                console.error(
                    error.response?.data?.message ||
                    "Failed to load data points"
                );

            }

        };


        loadDataPoints();

    }, [disclosureId]);
    

    //load documents
    useEffect(() => {

    const loadDocuments = async () => {

        try {

            const data =
                await getDocumentsByDisclosure(disclosureId);

            setDocuments(data.documents);

        }
        catch (error) {

            console.error(
                error.response?.data?.message ||
                "Failed to load documents"
            );

        }

    };


    loadDocuments();

}, [disclosureId]);

//load disclosureReview:
useEffect(() => {

    const loadReviewData = async () => {

        try {

            const data = await getDisclosureReview(disclosureId);


            console.log("VALIDATION:", data.validationResults);

            setCrossVerificationResults(
                data.crossVerificationResults || []
            );

            setValidationResults(
                data.validationResults || []
            );

        } catch (error) {

            console.error(
                error.response?.data?.message ||
                "Failed to load verification and validation results"
            );

        }

    };

    loadReviewData();

}, [disclosureId]);





    // =========================
    // ADD DATA POINT
    // =========================

    async function handleAddDataPoint(event) {

        event.preventDefault();

        try {

            // Find the selected metric
            const selectedMetric = metrics.find(
                metric => metric.id === bufferForm.metricId
            );


            if (!selectedMetric) {

                alert("Please select a metric.");

                return;

            }


            // Build request payload
            const payload = {

                disclosureId,

                metricId: bufferForm.metricId,

                value: Number(bufferForm.value),

                // Unit comes from metric catalog
                unit: selectedMetric.unit,

                periodStart: bufferForm.periodStart,

                periodEnd: bufferForm.periodEnd

            };


            // Send request to backend
            const data = await createDataPoint(payload);


            // Add newly created data point to UI
            setDataPoints(prev => [
                ...prev,
                data.dataPoint
            ]);


            // Close add form
            setShowAddBtn(false);


            // Clear form
            setBufferForm({

                metricId: "",
                value: "",
                periodStart: "",
                periodEnd: ""

            });

        }
        catch (error) {

            alert(
                error.response?.data?.message ||
                "Failed to create data point"
            );

        }

    }


    // =========================
    // START INLINE EDIT
    // =========================

    function startInlineEdit(dp) {

        setEditDataPointId(dp.id);


        setEditBufferForm({

            value: dp.value,

            periodStart: dp.period_start,

            periodEnd: dp.period_end

        });

    }


    // =========================
    // CANCEL INLINE EDIT
    // =========================

    function cancelInlineEdit() {

        setEditDataPointId(null);

        setEditBufferForm({

            value: "",
            periodStart: "",
            periodEnd: ""

        });

    }


    // =========================
    // SAVE INLINE EDIT
    // =========================

    async function handleSaveInlineEdit(id) {

        try {

            const payload = {

                value: Number(editBufferForm.value),

                periodStart: editBufferForm.periodStart,

                periodEnd: editBufferForm.periodEnd

            };


            const data =
                await updateDataPoint(id, payload);


            // Replace updated data point in state
            setDataPoints(prev =>

                prev.map(dp =>

                    dp.id === id
                        ? data.dataPoint
                        : dp

                )

            );


            // Exit edit mode
            cancelInlineEdit();

        }
        catch (error) {

            alert(
                error.response?.data?.message ||
                "Failed to update data point"
            );

        }

    }

    //upload function
    async function handleDocumentUpload(event) {

    event.preventDefault();

    if (!selectedFile) {

        alert("Please select a file.");

        return;

    }


    try {

        setUploadingDocument(true);


        const data = await uploadDocument(
            disclosureId,
            selectedFile
        );


        setDocuments(prev => [
            ...prev,
            data.document
        ]);


        setSelectedFile(null);


        // Reset file input
        event.target.reset();


        alert("Evidence uploaded successfully.");

    }
    catch (error) {

        alert(
            error.response?.data?.message ||
            "Failed to upload evidence."
        );

    }
    finally {

        setUploadingDocument(false);

    }

}

    //view function
    async function handleViewDocument(doc) {

    console.log("DOCUMENT TO VIEW:", doc);

    const data = await getDocument(doc.id);

    console.log("DOCUMENT RESPONSE:", data);

    window.open(data.document.downloadUrl, "_blank");


}

async function handleRunValidation() {
    try {
        setValidationLoading(true);

        const data = await runValidation(disclosureId);

        setValidationResults(data.results);
        setValidationSummary(data.summary);

    } catch (error) {
        alert(
            error.response?.data?.message ||
            "Validation failed"
        );
    } finally {
        setValidationLoading(false);
    }
}


    // =========================
    // DELETE ENTIRE DISCLOSURE
    // =========================

    const handleDelete = async () => {

        if (
            window.confirm(
                "Are you sure you want to permanently delete this draft disclosure?"
            )
        ) {

            try {

                await deleteDisclosure(disclosureId);

                alert("Draft deleted successfully.");

                navigate("/disclosures");

            }
            catch (error) {

                alert(
                    error.response?.data?.message ||
                    "Failed to delete disclosure."
                );

            }

        }

    };


    // =========================
    // SUBMIT DISCLOSURE
    // =========================

    const handleSubmitForAudit = async () => {

        if (
            window.confirm(
                "Submit this disclosure for formal audit? You will lose editing access."
            )
        ) {

            try {

                const data =
                    await submitDisclosure(disclosureId);


                // Update local disclosure state
                setDisclosure(
                    data.disclosure
                );


                alert(
                    "Disclosure submitted for audit successfully!"
                );

            }
            catch (error) {

                alert(
                    error.response?.data?.message ||
                    "Failed to submit for audit."
                );

            }

        }

    };


    // =========================
    // LOADING / ERROR STATES
    // =========================

        // =========================
    // UI
    // =========================

    if (loading) {
        return (
            <div className="page-state">
                <div className="loading-spinner"></div>
                <p>Loading disclosure...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page-state page-state-error">
                <h2>Unable to load disclosure</h2>
                <p>{error}</p>
            </div>
        );
    }

    if (!disclosure) {
        return (
            <div className="page-state">
                <p>No disclosure found.</p>
            </div>
        );
    }

    const isDraft = disclosure.status === "DRAFT";

    return (
        <div className="disclosure-page">

            {/* =========================
                HEADER
            ========================= */}

            <section className="disclosure-header">

                <div className="disclosure-header-main">

                    <span className="page-eyebrow">
                        ESG REPORTING
                    </span>

                    <div className="disclosure-title-row">
                        <div>
                            <h1>
                                {disclosure.reporting_year} Disclosure
                            </h1>

                            <p>
                                Prepare, verify and submit your organization's
                                ESG reporting data for formal audit.
                            </p>
                        </div>

                        <span
                            className={`status-badge status-${disclosure.status.toLowerCase()}`}
                        >
                            <span className="status-dot"></span>
                            {disclosure.status}
                        </span>
                    </div>

                </div>

                <div className="disclosure-meta">

                    <div className="disclosure-meta-item">
                        <span>REPORTING YEAR</span>
                        <strong>{disclosure.reporting_year}</strong>
                    </div>

                    <div className="disclosure-meta-item">
                        <span>CREATED</span>
                        <strong>
                            {disclosure.created_at
                                ? new Date(
                                    disclosure.created_at
                                ).toLocaleDateString()
                                : "N/A"}
                        </strong>
                    </div>

                    <div className="disclosure-meta-item">
                        <span>WORKFLOW</span>
                        <strong>
                            {isDraft ? "Editing" : "Under Review"}
                        </strong>
                    </div>

                </div>

            </section>


            {/* =========================
                DATA POINTS
            ========================= */}

            <section className="workspace-section">

                <div className="workspace-section-header">

                    <div className="section-title-group">

                        <div className="section-number">
                            01
                        </div>

                        <div>
                            <span className="section-eyebrow">
                                REPORTING DATA
                            </span>

                            <h2>Data Points</h2>

                            <p>
                                Report the measurable ESG values associated
                                with this disclosure period.
                            </p>
                        </div>

                    </div>

                    {isDraft && !showAddBtn && (
                        <button
                            className="btn btn-primary"
                            onClick={() => setShowAddBtn(true)}
                        >
                            + Add Data Point
                        </button>
                    )}

                </div>


                {/* ADD DATA POINT */}

                {showAddBtn && (

                    <form
                        className="disclosure-form-card"
                        onSubmit={handleAddDataPoint}
                    >

                        <div className="form-card-header">

                            <div>
                                <span className="section-eyebrow">
                                    NEW ENTRY
                                </span>

                                <h3>Add Data Point</h3>
                            </div>

                            <button
                                type="button"
                                className="icon-close"
                                onClick={() => {
                                    setShowAddBtn(false);

                                    setBufferForm({
                                        metricId: "",
                                        value: "",
                                        periodStart: "",
                                        periodEnd: ""
                                    });
                                }}
                            >
                                ×
                            </button>

                        </div>


                        <div className="disclosure-form-grid">

                            <div className="form-field form-field-wide">

                                <label htmlFor="metric">
                                    Metric
                                </label>

                                <select
                                    id="metric"
                                    value={bufferForm.metricId}
                                    onChange={e =>
                                        setBufferForm({
                                            ...bufferForm,
                                            metricId: e.target.value
                                        })
                                    }
                                    required
                                >
                                    <option value="">
                                        Select a metric
                                    </option>

                                    {metrics.map(metric => (
                                        <option
                                            key={metric.id}
                                            value={metric.id}
                                        >
                                            {metric.metric_name}
                                        </option>
                                    ))}
                                </select>

                                <span className="field-help">
                                    Select the ESG metric being reported.
                                </span>

                            </div>


                            <div className="form-field">

                                <label htmlFor="value">
                                    Reported Value
                                </label>

                                <input
                                    id="value"
                                    type="number"
                                    required
                                    value={bufferForm.value}
                                    onChange={e =>
                                        setBufferForm({
                                            ...bufferForm,
                                            value: e.target.value
                                        })
                                    }
                                />

                            </div>


                            <div className="form-field">

                                <label>Unit</label>

                                <div className="readonly-field">
                                    {bufferForm.metricId
                                        ? metrics.find(
                                            metric =>
                                                metric.id ===
                                                bufferForm.metricId
                                        )?.unit
                                        : "Select a metric"}
                                </div>

                            </div>


                            <div className="form-field">

                                <label htmlFor="periodStart">
                                    Reporting Period From
                                </label>

                                <input
                                    id="periodStart"
                                    type="date"
                                    required
                                    value={bufferForm.periodStart}
                                    onChange={e =>
                                        setBufferForm({
                                            ...bufferForm,
                                            periodStart: e.target.value
                                        })
                                    }
                                />

                            </div>


                            <div className="form-field">

                                <label htmlFor="periodEnd">
                                    Reporting Period To
                                </label>

                                <input
                                    id="periodEnd"
                                    type="date"
                                    required
                                    value={bufferForm.periodEnd}
                                    onChange={e =>
                                        setBufferForm({
                                            ...bufferForm,
                                            periodEnd: e.target.value
                                        })
                                    }
                                />

                            </div>

                        </div>


                        <div className="form-card-actions">

                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => {
                                    setShowAddBtn(false);

                                    setBufferForm({
                                        metricId: "",
                                        value: "",
                                        periodStart: "",
                                        periodEnd: ""
                                    });
                                }}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="btn btn-primary"
                            >
                                Add Data Point
                            </button>

                        </div>

                    </form>
                )}


                {/* EXISTING DATA POINTS */}

                <div className="data-points-list">

                    {dataPoints.length === 0 ? (

                        <div className="workspace-empty-state">
                            <div className="workspace-empty-icon">
                                +
                            </div>

                            <h3>No data points yet</h3>

                            <p>
                                Add the ESG metrics that belong to this
                                reporting period.
                            </p>
                        </div>

                    ) : (

                        dataPoints.map(dp => {

                            const metric = metrics.find(
                                metric => metric.id === dp.metric_id
                            );

                            const metricName =
                                metric?.metric_name || "Unknown metric";

                            const metricUnit =
                                metric?.unit || dp.unit || "N/A";

                            const isEditing =
                                editDataPointId === dp.id;

                            return (
                                <article
                                    className={`data-point-card ${
                                        isEditing
                                            ? "data-point-card-editing"
                                            : ""
                                    }`}
                                    key={dp.id}
                                >

                                    {!isEditing ? (

                                        <>
                                            <div className="data-point-main">

                                                <div className="data-point-heading">

                                                    <span className="data-point-label">
                                                        ESG METRIC
                                                    </span>

                                                    <h3>
                                                        {metricName}
                                                    </h3>

                                                </div>

                                                <span className="verification-chip">
                                                    <span>✓</span>
                                                    Verified
                                                </span>

                                            </div>


                                            <div className="data-point-details">

                                                <div className="data-point-value">

                                                    <span>REPORTED VALUE</span>

                                                    <strong>
                                                        {dp.value}
                                                        <small>
                                                            {metricUnit}
                                                        </small>
                                                    </strong>

                                                </div>


                                                <div className="data-point-detail">

                                                    <span>REPORTING PERIOD</span>

                                                    <strong>
                                                        {dp.period_start}
                                                        {" → "}
                                                        {dp.period_end}
                                                    </strong>

                                                </div>


                                                <div className="data-point-detail">

                                                    <span>UNIT</span>

                                                    <strong>
                                                        {metricUnit}
                                                    </strong>

                                                </div>

                                            </div>


                                            {isDraft && (

                                                <div className="data-point-actions">

                                                    <button
                                                        className="btn btn-secondary btn-small"
                                                        onClick={() =>
                                                            startInlineEdit(dp)
                                                        }
                                                    >
                                                        Edit
                                                    </button>

                                                </div>

                                            )}

                                        </>

                                    ) : (

                                        <>

                                            <div className="data-point-edit-header">

                                                <div>
                                                    <span className="section-eyebrow">
                                                        EDITING DATA POINT
                                                    </span>

                                                    <h3>
                                                        {metricName}
                                                    </h3>
                                                </div>

                                                <span className="verification-chip">
                                                    <span>✓</span>
                                                    Cross-verified
                                                </span>

                                            </div>


                                            <div className="disclosure-form-grid">

                                                <div className="form-field">

                                                    <label>
                                                        Value
                                                    </label>

                                                    <input
                                                        type="number"
                                                        value={
                                                            editBufferForm.value
                                                        }
                                                        onChange={e =>
                                                            setEditBufferForm({
                                                                ...editBufferForm,
                                                                value:
                                                                    e.target.value
                                                            })
                                                        }
                                                    />

                                                </div>


                                                <div className="form-field">

                                                    <label>
                                                        Unit
                                                    </label>

                                                    <div className="readonly-field">
                                                        {metricUnit}
                                                    </div>

                                                </div>


                                                <div className="form-field">

                                                    <label>
                                                        From
                                                    </label>

                                                    <input
                                                        type="date"
                                                        value={
                                                            editBufferForm.periodStart
                                                        }
                                                        onChange={e =>
                                                            setEditBufferForm({
                                                                ...editBufferForm,
                                                                periodStart:
                                                                    e.target.value
                                                            })
                                                        }
                                                    />

                                                </div>


                                                <div className="form-field">

                                                    <label>
                                                        To
                                                    </label>

                                                    <input
                                                        type="date"
                                                        value={
                                                            editBufferForm.periodEnd
                                                        }
                                                        onChange={e =>
                                                            setEditBufferForm({
                                                                ...editBufferForm,
                                                                periodEnd:
                                                                    e.target.value
                                                            })
                                                        }
                                                    />

                                                </div>

                                            </div>


                                            <div className="form-card-actions">

                                                <button
                                                    type="button"
                                                    className="btn btn-secondary"
                                                    onClick={cancelInlineEdit}
                                                >
                                                    Cancel
                                                </button>

                                                <button
                                                    type="button"
                                                    className="btn btn-primary"
                                                    onClick={() =>
                                                        handleSaveInlineEdit(
                                                            dp.id
                                                        )
                                                    }
                                                >
                                                    Save Changes
                                                </button>

                                            </div>

                                        </>

                                    )}

                                </article>
                            );
                        })

                    )}

                </div>

            </section>


            {/* =========================
                EVIDENCE
            ========================= */}

            <section className="workspace-section">

                <div className="workspace-section-header">

                    <div className="section-title-group">

                        <div className="section-number">
                            02
                        </div>

                        <div>
                            <span className="section-eyebrow">
                                SUPPORTING DOCUMENTATION
                            </span>

                            <h2>Evidence</h2>

                            <p>
                                Attach documents that substantiate the
                                reported ESG values.
                            </p>
                        </div>

                    </div>

                    <span className="section-count">
                        {documents.length}{" "}
                        {documents.length === 1
                            ? "document"
                            : "documents"}
                    </span>

                </div>


                {isDraft && (

                    <form
                        className="evidence-upload-card"
                        onSubmit={handleDocumentUpload}
                    >

                        <div className="upload-icon">
                            ↑
                        </div>

                        <div className="upload-content">

                            <h3>
                                Upload supporting evidence
                            </h3>

                            <p>
                                Add PDF, CSV or Excel documentation
                                supporting this disclosure.
                            </p>

                            <input
                                id="evidenceFile"
                                type="file"
                                accept=".pdf,.csv,.xls,.xlsx"
                                onChange={event =>
                                    setSelectedFile(
                                        event.target.files[0]
                                    )
                                }
                            />

                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={uploadingDocument}
                        >
                            {uploadingDocument
                                ? "Uploading..."
                                : "Upload Evidence"}
                        </button>

                    </form>

                )}


                <div className="documents-list">

                    {documents.length === 0 ? (

                        <div className="workspace-empty-state">
                            <div className="workspace-empty-icon">
                                ↗
                            </div>

                            <h3>No evidence uploaded</h3>

                            <p>
                                Supporting documents will appear here
                                once uploaded.
                            </p>
                        </div>

                    ) : (

                        documents.map(doc => (

                            <article
                                className="document-card"
                                key={doc.id}
                            >

                                <div className="document-icon">
                                    DOC
                                </div>

                                <div className="document-info">

                                    <h3>
                                        {doc.file_name}
                                    </h3>

                                    <div className="document-meta">

                                        <span>
                                            {doc.file_type ||
                                                "Document"}
                                        </span>

                                        <span>•</span>

                                        <span>
                                            Uploaded{" "}
                                            {doc.uploaded_at
                                                ? new Date(
                                                    doc.uploaded_at
                                                ).toLocaleDateString()
                                                : "N/A"}
                                        </span>

                                    </div>

                                </div>

                                <button
                                    className="btn btn-secondary btn-small"
                                    onClick={() =>
                                        handleViewDocument(doc)
                                    }
                                >
                                    View Document →
                                </button>

                            </article>

                        ))

                    )}

                </div>

            </section>


            {/* =========================
                VERIFICATION
            ========================= */}

            <section className="verification-grid">


                {/* CROSS VERIFICATION */}

                <article className="verification-card">

                    <div className="verification-card-header">

                        <div className="verification-card-icon">
                            ✓
                        </div>

                        <div>
                            <span className="section-eyebrow">
                                SOURCE CHECK
                            </span>

                            <h2>Cross-Verification</h2>
                        </div>

                    </div>


                    {crossVerificationResults.length === 0 ? (

                        <div className="verification-empty">
                            <p>
                                Cross-verification results will appear
                                after data points are submitted.
                            </p>
                        </div>

                    ) : (

                        <div className="cross-verification-list">

                            {crossVerificationResults.map(result => (

                                <div
                                    className="cross-verification-item"
                                    key={result.id}
                                >

                                    <div className="cross-result-header">

                                        <strong>
                                            Data Point
                                        </strong>

                                        <span
                                            className={
                                                result.verification_status ===
                                                "VERIFIED"
                                                    ? "result-status result-status-success"
                                                    : "result-status result-status-danger"
                                            }
                                        >
                                            {result.verification_status}
                                        </span>

                                    </div>

                                    <div className="cross-result-values">

                                        <div>
                                            <span>
                                                COMPANY VALUE
                                            </span>

                                            <strong>
                                                {result.company_value ??
                                                    "N/A"}
                                            </strong>
                                        </div>

                                        <div>
                                            <span>
                                                EXTERNAL VALUE
                                            </span>

                                            <strong>
                                                {result.external_value ??
                                                    "N/A"}
                                            </strong>
                                        </div>

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

                </article>


                {/* VALIDATION */}

                <article className="verification-card">

                    <div className="verification-card-header">

                        <div className="verification-card-icon validation-icon">
                            ✓
                        </div>

                        <div>
                            <span className="section-eyebrow">
                                AUTOMATED CHECKS
                            </span>

                            <h2>Validation</h2>
                        </div>

                    </div>


                    <div className="validation-action">

                        <p>
                            Run the automated validation engine to
                            check completeness, consistency, evidence
                            and reporting rules.
                        </p>

                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handleRunValidation}
                            disabled={validationLoading}
                        >
                            {validationLoading
                                ? "Running Validation..."
                                : "Run Validation"}
                        </button>

                    </div>


                    {validationSummary && (

                        <div className="validation-summary">

                            <div className="validation-summary-item validation-pass">
                                <span>Passed</span>
                                <strong>
                                    {validationSummary.passed}
                                </strong>
                            </div>

                            <div className="validation-summary-item validation-warning">
                                <span>Warnings</span>
                                <strong>
                                    {validationSummary.warnings}
                                </strong>
                            </div>

                            <div className="validation-summary-item validation-fail">
                                <span>Failed</span>
                                <strong>
                                    {validationSummary.failed}
                                </strong>
                            </div>

                            <div className="validation-overall">

                                <span>Overall Result</span>

                                <strong>
                                    {validationSummary.failed === 0
                                        ? "VALID"
                                        : "FAILED"}
                                </strong>

                            </div>

                        </div>

                    )}


                    {validationResults.length > 0 && (

                        <div className="validation-results">

                            {validationResults.map(result => (

                                <div
                                    className="validation-result"
                                    key={
                                        result.id ||
                                        result.ruleCode
                                    }
                                >

                                    <div className="validation-result-top">

                                        <strong>
                                            {result.ruleCode}
                                        </strong>

                                        <span
                                            className={`validation-severity validation-severity-${(result.severity || "unknown").toLowerCase()}`}
                                        >
                                            {result.severity}
                                        </span>

                                    </div>

                                    <p>
                                        {result.message}
                                    </p>

                                </div>

                            ))}

                        </div>

                    )}

                </article>

            </section>


            {/* =========================
                SUBMISSION ACTIONS
            ========================= */}

            {isDraft && (

                <section className="submission-panel">

                    <div>

                        <span className="section-eyebrow">
                            READY FOR REVIEW?
                        </span>

                        <h2>
                            Submit this disclosure for audit
                        </h2>

                        <p>
                            Once submitted, editing will be disabled
                            while the disclosure is reviewed by an
                            authorized auditor.
                        </p>

                    </div>

                    <div className="submission-actions">

                        <button
                            className="btn btn-danger-outline"
                            onClick={handleDelete}
                        >
                            Delete Draft
                        </button>

                        <button
                            className="btn btn-primary btn-submit"
                            onClick={handleSubmitForAudit}
                        >
                            Submit for Audit
                            <span>→</span>
                        </button>

                    </div>

                </section>

            )}

        </div>
    );
}