import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    getDisclosure,
    deleteDisclosure,
    submitDisclosure
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
    async function handleViewDocument(id) {

    try {

        const data = await getDocument(id);

        window.open(
            data.downloadUrl,
            "_blank"
        );

    }
    catch (error) {

        alert(
            error.response?.data?.message ||
            "Failed to open document."
        );

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

    if (loading) {

        return (
            <p>
                Loading disclosure details...
            </p>
        );

    }


    if (error) {

        return (
            <p style={{ color: "red" }}>
                {error}
            </p>
        );

    }


    if (!disclosure) {

        return (
            <p>
                No disclosure found.
            </p>
        );

    }


    // =========================
    // DISCLOSURE STATUS
    // =========================

    const isDraft =
        disclosure.status === "DRAFT";


    // =========================
    // UI
    // =========================

    return (

        <div
            style={{
                padding: "20px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                maxWidth: "900px",
                margin: "0 auto"
            }}
        >

            <h2>
                Disclosure Details
            </h2>

            <hr />


            {/* =========================
                DISCLOSURE INFORMATION
            ========================= */}

            <p>
                <strong>
                    Reporting Year:
                </strong>{" "}
                {disclosure.reporting_year}
            </p>


            <p>
                <strong>
                    Status:
                </strong>{" "}
                {disclosure.status}
            </p>


            <p>
                <strong>
                    Created:
                </strong>{" "}

                {
                    disclosure.created_at
                        ? new Date(
                            disclosure.created_at
                        ).toLocaleDateString()
                        : "N/A"
                }

            </p>


            {/* =========================
                1. DATA POINTS
            ========================= */}

            <hr
                style={{
                    border: "0",
                    borderTop: "1px solid #eee",
                    margin: "16px 0"
                }}
            />


            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}
            >

                <h3
                    style={{
                        textTransform: "uppercase",
                        margin: 0
                    }}
                >
                    Data Points
                </h3>


                {isDraft && !showAddBtn && (

                    <button
                        onClick={() => setShowAddBtn(true)}
                    >
                        + Add Data Point
                    </button>

                )}

            </div>


            {/* =========================
                ADD DATA POINT FORM
            ========================= */}

            {showAddBtn && (

                <form
                    onSubmit={handleAddDataPoint}

                    style={{
                        padding: "12px",
                        background: "#f9f9f9",
                        marginTop: "12px",
                        border: "1px dashed #bbb"
                    }}
                >

                    {/* METRIC */}

                    <div>

                        <label>
                            Metric:
                        </label>

                        {" "}

                        <select
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

                    </div>


                    {/* VALUE */}

                    <div>

                        <label>
                            Value:
                        </label>

                        {" "}

                        <input
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


                    {/* UNIT */}

                    {bufferForm.metricId && (

                        <p>

                            <strong>
                                Unit:
                            </strong>{" "}

                            {
                                metrics.find(
                                    metric =>
                                        metric.id ===
                                        bufferForm.metricId
                                )?.unit
                            }

                        </p>

                    )}


                    {/* PERIOD START */}

                    <div>

                        <label>
                            Reporting Period From:
                        </label>

                        {" "}

                        <input
                            type="date"
                            required
                            value={bufferForm.periodStart}

                            onChange={e =>
                                setBufferForm({
                                    ...bufferForm,
                                    periodStart:
                                        e.target.value
                                })
                            }
                        />

                    </div>


                    {/* PERIOD END */}

                    <div>

                        <label>
                            Reporting Period To:
                        </label>

                        {" "}

                        <input
                            type="date"
                            required
                            value={bufferForm.periodEnd}

                            onChange={e =>
                                setBufferForm({
                                    ...bufferForm,
                                    periodEnd:
                                        e.target.value
                                })
                            }
                        />

                    </div>


                    <br />


                    <button type="submit">
                        Add Data Point
                    </button>


                    {" "}


                    <button
                        type="button"
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

                </form>

            )}


            {/* =========================
                EXISTING DATA POINTS
            ========================= */}

            <div
                style={{
                    marginTop: "20px"
                }}
            >

                {dataPoints.length === 0 ? (

                    <p
                        style={{
                            color: "#777"
                        }}
                    >
                        No data points added yet.
                    </p>

                ) : (

                    dataPoints.map(dp => {

                        // Find metric belonging to this data point
                        const metric = metrics.find(
                            metric =>
                                metric.id === dp.metric_id
                        );


                        const metricName =
                            metric?.metric_name ||
                            "Unknown metric";


                        const metricUnit =
                            metric?.unit ||
                            dp.unit ||
                            "N/A";


                        const isEditing =
                            editDataPointId === dp.id;


                        return (

                            <div
                                key={dp.id}

                                style={{
                                    border: "1px solid #ddd",
                                    padding: "15px",
                                    marginBottom: "10px",
                                    borderRadius: "5px"
                                }}
                            >

                                {/* =========================
                                    READ ONLY VIEW
                                ========================= */}

                                {!isEditing ? (

                                    <>

                                        <p>
                                            <strong>
                                                Metric:
                                            </strong>{" "}
                                            {metricName}
                                        </p>


                                        <p>
                                            <strong>
                                                Value:
                                            </strong>{" "}
                                            {dp.value}
                                        </p>


                                        <p>
                                            <strong>
                                                Unit:
                                            </strong>{" "}
                                            {metricUnit}
                                        </p>


                                        <p>
                                            <strong>
                                                Reporting Period:
                                            </strong>{" "}

                                            {dp.period_start}
                                            {" → "}
                                            {dp.period_end}

                                        </p>


                                        {isDraft && (

                                            <button
                                                onClick={() =>
                                                    startInlineEdit(dp)
                                                }
                                            >
                                                Edit
                                            </button>

                                        )}

                                    </>

                                ) : (

                                    /* =========================
                                        EDIT MODE
                                    ========================= */

                                    <>

                                        <p>
                                            <strong>
                                                Metric:
                                            </strong>{" "}
                                            {metricName}
                                        </p>


                                        <p>
                                            <strong>
                                                Unit:
                                            </strong>{" "}
                                            {metricUnit}
                                        </p>


                                        <div>

                                            <label>
                                                Value:
                                            </label>

                                            {" "}

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


                                        <div>

                                            <label>
                                                From:
                                            </label>

                                            {" "}

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


                                        <div>

                                            <label>
                                                To:
                                            </label>

                                            {" "}

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


                                        <br />


                                        <button
                                            onClick={() =>
                                                handleSaveInlineEdit(
                                                    dp.id
                                                )
                                            }
                                        >
                                            Save
                                        </button>


                                        {" "}


                                        <button
                                            type="button"
                                            onClick={
                                                cancelInlineEdit
                                            }
                                        >
                                            Cancel
                                        </button>

                                    </>

                                )}

                            </div>

                        );

                    })

                )}

            </div>


            {/* =========================
                2. EVIDENCE
            ========================= */}

            <hr
                style={{
                    border: "0",
                    borderTop: "1px solid #eee",
                    margin: "16px 0"
                }}
            />


            {/* =========================
    2. EVIDENCE
========================= */}

<hr
    style={{
        border: "0",
        borderTop: "1px solid #eee",
        margin: "16px 0"
    }}
/>


<div
    style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    }}
>

    <h3
        style={{
            fontSize: "0.9rem",
            color: "#444",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            margin: 0
        }}
    >
        Evidence
    </h3>

</div>


{/* Upload only when DRAFT */}

{isDraft && (

    <form
        onSubmit={handleDocumentUpload}
        style={{
            padding: "12px",
            background: "#f9f9f9",
            marginTop: "12px",
            border: "1px dashed #bbb"
        }}
    >

        <div>

            <label htmlFor="evidenceFile">
                Supporting Document:
            </label>

            {" "}

            <input
                id="evidenceFile"
                type="file"
                onChange={(event) =>
                    setSelectedFile(
                        event.target.files[0]
                    )
                }
            />

        </div>


        <br />


        <button
            type="submit"
            disabled={uploadingDocument}
        >

            {uploadingDocument
                ? "Uploading..."
                : "Upload Evidence"
            }

        </button>

    </form>

)}


{/* Existing documents */}

<div
    style={{
        marginTop: "15px"
    }}
>

    {documents.length === 0 ? (

        <p
            style={{
                fontSize: "0.95rem",
                color: "#777"
            }}
        >
            No evidence uploaded yet.
        </p>

    ) : (

        documents.map(document => (

            <div
                key={document.id}
                style={{
                    border: "1px solid #ddd",
                    padding: "12px",
                    marginBottom: "10px",
                    borderRadius: "5px"
                }}
            >

                <p>
                    <strong>
                        File:
                    </strong>{" "}
                    {document.file_name}
                </p>


                <p>
                    <strong>
                        Type:
                    </strong>{" "}
                    {document.file_type || "Unknown"}
                </p>


                <p>
                    <strong>
                        Uploaded:
                    </strong>{" "}

                    {
                        document.uploaded_at
                            ? new Date(
                                document.uploaded_at
                            ).toLocaleDateString()
                            : "N/A"
                    }

                </p>


                <button
                    onClick={() =>
                        handleViewDocument(
                            document.id
                        )
                    }
                >
                    View Document
                </button>

            </div>

        ))

    )}

</div>


            {/* =========================
                3. CROSS-VERIFICATION
            ========================= */}

            <hr
                style={{
                    border: "0",
                    borderTop: "1px solid #eee",
                    margin: "16px 0"
                }}
            />


            <h3
                style={{
                    fontSize: "0.9rem",
                    color: "#444",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px"
                }}
            >
                Cross-Verification
            </h3>


            <p
                style={{
                    fontSize: "0.95rem",
                    color: "#777"
                }}
            >
                Cross-verification is performed automatically when
                data points are created or updated.
            </p>


            {/* =========================
                4. VALIDATION
            ========================= */}

            <hr
                style={{
                    border: "0",
                    borderTop: "1px solid #eee",
                    margin: "16px 0"
                }}
            />


            <h3
                style={{
                    fontSize: "0.9rem",
                    color: "#444",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px"
                }}
            >
                Validation
            </h3>


            <p
                style={{
                    fontSize: "0.95rem",
                    color: "#777"
                }}
            >
                Validation will be performed before submission.
            </p>


            {/* =========================
                DISCLOSURE ACTIONS
            ========================= */}

            {isDraft && (

                <>

                    <hr
                        style={{
                            border: "0",
                            borderTop: "1px solid #eee",
                            margin: "24px 0 16px 0"
                        }}
                    />


                    <div
                        style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: "12px"
                        }}
                    >

                        <button
                            onClick={handleDelete}

                            style={{
                                backgroundColor: "#fff",
                                color: "#d9383a",
                                border: "1px solid #d9383a",
                                padding: "8px 16px",
                                borderRadius: "4px",
                                cursor: "pointer"
                            }}
                        >
                            Delete Draft
                        </button>


                        <button
                            onClick={handleSubmitForAudit}

                            style={{
                                backgroundColor: "#0066cc",
                                color: "#fff",
                                border: "none",
                                padding: "8px 16px",
                                borderRadius: "4px",
                                cursor: "pointer"
                            }}
                        >
                            Submit for Audit
                        </button>

                    </div>

                </>

            )}

        </div>

    );

}