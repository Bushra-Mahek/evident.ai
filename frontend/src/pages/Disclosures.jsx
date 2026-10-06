import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDisclosures, createDisclosure } from "../api/disclosureApi.js";


export function Disclosures() {
    const [disclosures, setDisclosures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showForm,setShowForm] = useState(false);
    const [reportingYearInput,setReportingYearInput] = useState("");

    const currentYear = new Date().getFullYear();
    const currentD = disclosures.find((d)=>Number(d.reporting_year) === currentYear);


    async function handleSubmit(event){
         event.preventDefault();

    try {
        const year = Number(reportingYearInput);

        await createDisclosure(year);

        const data = await getDisclosures();
        setDisclosures(data.disclosures);

        setReportingYearInput("");
        setShowForm(false);

    } catch (error) {
        setError(
            error.response?.data?.message ||
            "Failed to create disclosure"
        );
    }
    }

   

    useEffect(() => {
        async function loadDisclosures() {
            try {
                const data = await getDisclosures();
                setDisclosures(data.disclosures);
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    "Failed to load disclosures"
                );
            } finally {
                setLoading(false);
            }
        }

        loadDisclosures();
    }, []);

    if (loading) {
        return <p>Loading disclosures...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    console.log("CURRENT YEAR:", currentYear);
console.log("DISCLOSURES:", disclosures);
console.log("CURRENT DISCLOSURE:", currentD);

    return (
        <div>
            <h1>My Disclosures</h1>

            {!currentD  && <button onClick={()=>setShowForm(true)}>Create Disclosure</button>}
            {showForm && 
                <form onSubmit={handleSubmit} style={{ margin: "20px 0" }}>
                    <div>
                        <label htmlFor="reportingYear">Reporting Year: </label>
                        <input
                            id="reportingYear"
                            name="reportingYear"
                            type="number"
                            placeholder="Enter reporting year"
                            value={reportingYearInput}
                            onChange={(e) => setReportingYearInput(e.target.value)}
                            required
                        />

                        <button type="submit">Create</button>

        <button
            type="button"
            onClick={() => setShowForm(false)}
        >
            Cancel
        </button>

                    </div>
                </form>
                }
            {currentD?.status === "DRAFT" && (
    <Link to={`/disclosures/${currentD.id}`}>
        Continue Draft
    </Link>
)}

            {disclosures.length === 0 ? (
                <p>No disclosures found.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Reporting Year</th>
                            <th>Status</th>
                            <th>Created</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {disclosures.map((disclosure) => (
                            <tr key={disclosure.id}>
                                <td>{disclosure.reporting_year}</td>
                                <td>{disclosure.status}</td>
                                <td>
                                    {new Date(
                                        disclosure.created_at
                                    ).toLocaleDateString()}
                                </td>
                                <td>
                                    <Link to={`${disclosure.id}`} className="view-button-style">View</Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}