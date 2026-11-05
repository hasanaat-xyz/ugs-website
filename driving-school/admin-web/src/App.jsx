
import { useState } from "react";
import "./App.css";

const API = "https://deccan-motor-driving-school.onrender.com/api";

const initialForm = {
  fullName: "",
  fatherName: "",
  dateOfBirth: "",
  phone: "",
  mobileNumber2: "",
  email: "",
  address: "",
  admissionDate: "",
  trainingTimeFrom: "",
  trainingTimeTo: "",
  llrNumber: "",
  fdlNumber: "",
  licenseNumber: "",
  licenseCategory: "LMV",
  trainingStatus: "Not Started",
  totalFees: "",
  paidFees: "",
  remarks: "",
};

function formatDate(date) {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatTime(time) {
  if (!time) return "—";

  const [hours, minutes] = time.split(":");
  const date = new Date();

  date.setHours(Number(hours), Number(minutes), 0, 0);

  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function getBalance(candidate) {
  return Math.max(
    0,
    Number(candidate.totalFees || 0) - Number(candidate.paidFees || 0)
  );
}

function getMobile1(candidate) {
  return candidate.mobileNumber1 || candidate.phone || "";
}

function CandidateFolio({ candidate, onClose }) {
  if (!candidate) return null;

  const mobile1 = getMobile1(candidate);
  const balance = getBalance(candidate);

  return (
    <div className="folio-overlay">
      <div className="folio-modal">
        <div className="folio-actions no-print">
          <button type="button" onClick={onClose}>
            Close
          </button>

          <button type="button" onClick={() => window.print()}>
            Print Candidate Details
          </button>
        </div>

        <div className="candidate-folio" id="candidate-folio">
          <header className="folio-header">
            <h1>DECCAN MOTOR DRIVING SCHOOL</h1>
            <p>TRAFFIC IN TRUST</p>
            <p>Candidate Admission Record</p>
          </header>

          <section className="folio-section">
            <h2>Candidate Information</h2>

            <div className="folio-grid">
              <div>
                <strong>Candidate Name</strong>
                <p>{candidate.fullName || "—"}</p>
              </div>

              <div>
                <strong>Father&apos;s Name</strong>
                <p>{candidate.fatherName || "—"}</p>
              </div>

              <div>
                <strong>Date of Birth</strong>
                <p>{formatDate(candidate.dateOfBirth)}</p>
              </div>

              <div>
                <strong>Admission Date</strong>
                <p>{formatDate(candidate.admissionDate)}</p>
              </div>

              <div>
                <strong>Mobile Number 1</strong>
                <p>{mobile1 || "—"}</p>
              </div>

              <div>
                <strong>Mobile Number 2</strong>
                <p>{candidate.mobileNumber2 || "—"}</p>
              </div>

              <div>
                <strong>Email</strong>
                <p>{candidate.email || "—"}</p>
              </div>

              <div>
                <strong>Address</strong>
                <p>{candidate.address || "—"}</p>
              </div>
            </div>
          </section>

          <section className="folio-section">
            <h2>Driving Licence Information</h2>

            <div className="folio-grid">
              <div>
                <strong>LLR Number</strong>
                <p>{candidate.llrNumber || "—"}</p>
              </div>

              <div>
                <strong>FD / FDL Number</strong>
                <p>{candidate.fdlNumber || "—"}</p>
              </div>

              <div>
                <strong>Driving Licence Number</strong>
                <p>{candidate.licenseNumber || "—"}</p>
              </div>

              <div>
                <strong>Licence Category</strong>
                <p>{candidate.licenseCategory || "—"}</p>
              </div>
            </div>
          </section>

          <section className="folio-section">
            <h2>Training Information</h2>

            <div className="folio-grid">
              <div>
                <strong>Training Time From</strong>
                <p>{formatTime(candidate.trainingTimeFrom)}</p>
              </div>

              <div>
                <strong>Training Time To</strong>
                <p>{formatTime(candidate.trainingTimeTo)}</p>
              </div>

              <div>
                <strong>Training Status</strong>
                <p>{candidate.trainingStatus || "Not Started"}</p>
              </div>
            </div>
          </section>

          <section className="folio-section">
            <h2>Fee Details</h2>

            <div className="folio-grid">
              <div>
                <strong>Total Fees</strong>
                <p>₹{Number(candidate.totalFees || 0).toLocaleString("en-IN")}</p>
              </div>

              <div>
                <strong>Advance / Fees Paid</strong>
                <p>₹{Number(candidate.paidFees || 0).toLocaleString("en-IN")}</p>
              </div>

              <div>
                <strong>Balance Fees</strong>
                <p>₹{balance.toLocaleString("en-IN")}</p>
              </div>
            </div>
          </section>

          <section className="folio-section">
            <h2>Remarks</h2>
            <p>{candidate.remarks || "—"}</p>
          </section>

          <footer className="folio-footer">
            <div>
              <p>________________________</p>
              <strong>Candidate Signature</strong>
            </div>

            <div>
              <p>________________________</p>
              <strong>Authorised Signature</strong>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [token, setToken] = useState(
    () => localStorage.getItem("token") || ""
  );

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const [form, setForm] = useState(initialForm);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState("dashboard");

  const totalFees = Number(form.totalFees || 0);
  const paidFees = Number(form.paidFees || 0);
  const balanceFees = Math.max(0, totalFees - paidFees);

  async function request(path, options = {}) {
    const response = await fetch(`${API}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        data.message || data.error || "Something went wrong."
      );
    }

    return data;
  }

  async function handleLogin(event) {
    event.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const data = await request("/auth/login", {
        method: "POST",
        body: JSON.stringify(loginForm),
      });

      if (!data.token) {
        throw new Error("Login succeeded but no authentication token was returned.");
      }

      if (
        data.user?.role &&
        !["admin", "staff"].includes(data.user.role)
      ) {
        throw new Error("Only authorised admin or staff accounts can log in.");
      }

      localStorage.setItem("token", data.token);
      setToken(data.token);

      setMessage("Login successful!");

      await loadCandidates(data.token);
    } catch (err) {
      setError(err.message || "Unable to log in.");
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");

    setToken("");
    setCandidates([]);
    setSearchResults([]);
    setSelectedCandidate(null);
    setPage("dashboard");

    setMessage("You have been logged out.");
    setError("");
  }

  async function loadCandidates(authToken = token) {
    try {
      const response = await fetch(`${API}/candidates`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Unable to load candidates.");
      }

      const list = Array.isArray(data)
        ? data
        : data.candidates || [];

      setCandidates(list);
    } catch (err) {
      setError(err.message || "Unable to load candidates.");
    }
  }

  async function searchCandidate(event) {
    event.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);
    setSearchResults([]);

    const phone = search.trim();

    if (!phone) {
      setError("Please enter a contact number.");
      setLoading(false);
      return;
    }

    try {
      const data = await request(
        `/candidates/search?phone=${encodeURIComponent(phone)}`
      );

      const results = Array.isArray(data.candidates)
        ? data.candidates
        : data.candidate
          ? [data.candidate]
          : Array.isArray(data)
            ? data
            : [];

      setSearchResults(results);

      if (results.length === 0) {
        setMessage("No candidates found for this contact number.");
      }
    } catch (err) {
      setError(err.message || "Candidate search failed.");
    } finally {
      setLoading(false);
    }
  }

  async function addCandidate(event) {
    event.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);

    if (!form.fullName.trim()) {
      setError("Please enter the candidate's name.");
      setLoading(false);
      return;
    }

    if (!form.phone.trim()) {
      setError("Please enter Mobile Number 1.");
      setLoading(false);
      return;
    }

    if (paidFees > totalFees) {
      setError("Advance/paid fees cannot exceed total fees.");
      setLoading(false);
      return;
    }

    if (
      form.trainingTimeFrom &&
      form.trainingTimeTo &&
      form.trainingTimeFrom >= form.trainingTimeTo
    ) {
      setError("Training end time must be later than start time.");
      setLoading(false);
      return;
    }

    const payload = {
      ...form,

      // Keep the existing phone field for compatibility with the API.
      phone: form.phone.trim(),
      mobileNumber1: form.phone.trim(),

      fullName: form.fullName.trim(),
      fatherName: form.fatherName.trim(),
      mobileNumber2: form.mobileNumber2.trim(),
      email: form.email.trim(),
      address: form.address.trim(),
      llrNumber: form.llrNumber.trim(),
      fdlNumber: form.fdlNumber.trim(),
      licenseNumber: form.licenseNumber.trim(),
      remarks: form.remarks.trim(),

      totalFees,
      paidFees,
    };

    try {
      const data = await request("/candidates", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setMessage(data.message || "Candidate registered successfully!");
      setForm(initialForm);

      await loadCandidates();

      setPage("candidates");
    } catch (err) {
      setError(err.message || "Candidate registration failed.");
    } finally {
      setLoading(false);
    }
  }

  function updateForm(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  const displayedCandidates =
    page === "search" ? searchResults : candidates;

  if (!token) {
    return (
      <main className="login-page">
        <form className="login-card" onSubmit={handleLogin}>
          <div className="brand-mark">DMDS</div>

          <h1>Deccan Motor Driving School</h1>
          <p>Admin Portal</p>

          {error && <div className="alert error">{error}</div>}
          {message && <div className="alert success">{message}</div>}

          <label htmlFor="login-email">Email Address</label>
          <input
            id="login-email"
            type="email"
            autoComplete="username"
            placeholder="Enter admin email"
            value={loginForm.email}
            onChange={(event) =>
              setLoginForm({
                ...loginForm,
                email: event.target.value,
              })
            }
            required
          />

          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter password"
            value={loginForm.password}
            onChange={(event) =>
              setLoginForm({
                ...loginForm,
                password: event.target.value,
              })
            }
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </main>
    );
  }

  return (
    <div className="app-layout">
      <aside className="sidebar no-print">
        <div className="sidebar-brand">
          <div className="brand-mark">DMDS</div>
          <div>
            <h2>Deccan Motor</h2>
            <p>Driving School</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button
            type="button"
            className={page === "dashboard" ? "active" : ""}
            onClick={() => {
              setPage("dashboard");
              setMessage("");
              setError("");
            }}
          >
            Dashboard
          </button>

          <button
            type="button"
            className={page === "register" ? "active" : ""}
            onClick={() => {
              setPage("register");
              setMessage("");
              setError("");
            }}
          >
            Register Candidate
          </button>

          <button
            type="button"
            className={page === "search" ? "active" : ""}
            onClick={() => {
              setPage("search");
              setMessage("");
              setError("");
              setSearchResults([]);
            }}
          >
            Search by Contact
          </button>

          <button
            type="button"
            className={page === "candidates" ? "active" : ""}
            onClick={async () => {
              setPage("candidates");
              setMessage("");
              setError("");
              await loadCandidates();
            }}
          >
            All Candidates
          </button>
        </nav>

        <button
          type="button"
          className="logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>
      </aside>

      <main className="main-content">
        <header className="topbar no-print">
          <div>
            <h1>
              {page === "dashboard" && "Dashboard"}
              {page === "register" && "Candidate Registration"}
              {page === "search" && "Search Candidates"}
              {page === "candidates" && "All Candidates"}
            </h1>

            <p>Deccan Motor Driving School Admin Portal</p>
          </div>
        </header>

        {error && (
          <div className="alert error no-print">
            {error}
          </div>
        )}

        {message && (
          <div className="alert success no-print">
            {message}
          </div>
        )}

        {page === "dashboard" && (
          <section className="dashboard-page">
            <div className="welcome-card">
              <h2>Welcome to DMDS</h2>
              <p>
                Manage candidate admissions, training details, contact
                information and fee records from one place.
              </p>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <span>Total Candidates</span>
                <strong>{candidates.length}</strong>
              </div>

              <div className="stat-card">
                <span>Training In Progress</span>
                <strong>
                  {
                    candidates.filter(
                      (candidate) =>
                        candidate.trainingStatus === "In Progress"
                    ).length
                  }
                </strong>
              </div>

              <div className="stat-card">
                <span>Training Completed</span>
                <strong>
                  {
                    candidates.filter(
                      (candidate) =>
                        candidate.trainingStatus === "Completed"
                    ).length
                  }
                </strong>
              </div>

              <div className="stat-card">
                <span>Total Outstanding Fees</span>
                <strong>
                  ₹
                  {candidates
                    .reduce(
                      (total, candidate) =>
                        total + getBalance(candidate),
                      0
                    )
                    .toLocaleString("en-IN")}
                </strong>
              </div>
            </div>

            <div className="quick-actions">
              <h2>Quick Actions</h2>

              <button
                type="button"
                onClick={() => {
                  setForm(initialForm);
                  setPage("register");
                  setMessage("");
                  setError("");
                }}
              >
                + Register New Candidate
              </button>

              <button
                type="button"
                onClick={() => {
                  setPage("search");
                  setMessage("");
                  setError("");
                }}
              >
                Search Candidate by Contact Number
              </button>

              <button
                type="button"
                onClick={() => {
                  setPage("candidates");
                  loadCandidates();
                }}
              >
                View All Candidates
              </button>
            </div>
          </section>
        )}

        {page === "register" && (
          <section className="form-card">
            <div className="section-heading">
              <h2>New Candidate Admission</h2>
              <p>Enter the candidate's complete information below.</p>
            </div>

            <form onSubmit={addCandidate}>
              <h3 className="form-section-title">
                Personal Information
              </h3>

              <div className="form-grid">
                <div className="form-field">
                  <label htmlFor="fullName">Candidate Name *</label>
                  <input
                    id="fullName"
                    name="fullName"
                    value={form.fullName}
                    onChange={updateForm}
                    placeholder="Enter candidate's full name"
                    required
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="fatherName">Father&apos;s Name</label>
                  <input
                    id="fatherName"
                    name="fatherName"
                    value={form.fatherName}
                    onChange={updateForm}
                    placeholder="Enter father's name"
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="dateOfBirth">Date of Birth</label>
                  <input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={form.dateOfBirth}
                    onChange={updateForm}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="admissionDate">Admission Date *</label>
                  <input
                    id="admissionDate"
                    name="admissionDate"
                    type="date"
                    value={form.admissionDate}
                    onChange={updateForm}
                    required
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="phone">Mobile Number 1 *</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={updateForm}
                    placeholder="Enter primary mobile number"
                    required
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="mobileNumber2">Mobile Number 2</label>
                  <input
                    id="mobileNumber2"
                    name="mobileNumber2"
                    type="tel"
                    value={form.mobileNumber2}
                    onChange={updateForm}
                    placeholder="Enter alternate mobile number"
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="email">Email Address</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={updateForm}
                    placeholder="Enter email address"
                  />
                </div>

                <div className="form-field full-width">
                  <label htmlFor="address">Address</label>
                  <textarea
                    id="address"
                    name="address"
                    value={form.address}
                    onChange={updateForm}
                    placeholder="Enter complete residential address"
                    rows="3"
                  />
                </div>
              </div>

              <h3 className="form-section-title">
                Driving Licence Information
              </h3>

              <div className="form-grid">
                <div className="form-field">
                  <label htmlFor="llrNumber">LLR Number</label>
                  <input
                    id="llrNumber"
                    name="llrNumber"
                    value={form.llrNumber}
                    onChange={updateForm}
                    placeholder="Enter LLR number"
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="fdlNumber">FD / FDL Number</label>
                  <input
                    id="fdlNumber"
                    name="fdlNumber"
                    value={form.fdlNumber}
                    onChange={updateForm}
                    placeholder="Enter FD/FDL number"
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="licenseNumber">
                    Driving Licence Number
                  </label>
                  <input
                    id="licenseNumber"
                    name="licenseNumber"
                    value={form.licenseNumber}
                    onChange={updateForm}
                    placeholder="Enter driving licence number"
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="licenseCategory">Licence Category</label>
                  <select
                    id="licenseCategory"
                    name="licenseCategory"
                    value={form.licenseCategory}
                    onChange={updateForm}
                  >
                    <option value="LMV">LMV</option>
                    <option value="HMV">HMV</option>
                    <option value="MCWG">MCWG</option>
                    <option value="MCWOG">MCWOG</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>

              <h3 className="form-section-title">
                Training Schedule
              </h3>

              <div className="form-grid">
                <div className="form-field">
                  <label htmlFor="trainingTimeFrom">
                    Training Time — From
                  </label>
                  <input
                    id="trainingTimeFrom"
                    name="trainingTimeFrom"
                    type="time"
                    value={form.trainingTimeFrom}
                    onChange={updateForm}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="trainingTimeTo">
                    Training Time — To
                  </label>
                  <input
                    id="trainingTimeTo"
                    name="trainingTimeTo"
                    type="time"
                    value={form.trainingTimeTo}
                    onChange={updateForm}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="trainingStatus">Training Status</label>
                  <select
                    id="trainingStatus"
                    name="trainingStatus"
                    value={form.trainingStatus}
                    onChange={updateForm}
                  >
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <h3 className="form-section-title">
                Fee Information
              </h3>

              <div className="form-grid">
                <div className="form-field">
                  <label htmlFor="totalFees">Total Fees (₹) *</label>
                  <input
                    id="totalFees"
                    name="totalFees"
                    type="number"
                    min="0"
                    value={form.totalFees}
                    onChange={updateForm}
                    placeholder="Enter total fees"
                    required
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="paidFees">
                    Advance / Fees Paid (₹) *
                  </label>
                  <input
                    id="paidFees"
                    name="paidFees"
                    type="number"
                    min="0"
                    value={form.paidFees}
                    onChange={updateForm}
                    placeholder="Enter amount paid"
                    required
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="balanceFees">Balance Fees (₹)</label>
                  <input
                    id="balanceFees"
                    value={balanceFees}
                    readOnly
                  />
                </div>

                <div className="form-field full-width">
                  <label htmlFor="remarks">Remarks</label>
                  <textarea
                    id="remarks"
                    name="remarks"
                    value={form.remarks}
                    onChange={updateForm}
                    placeholder="Enter any additional notes"
                    rows="3"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setForm(initialForm)}
                >
                  Clear Form
                </button>

                <button type="submit" disabled={loading}>
                  {loading ? "Registering..." : "Register Candidate"}
                </button>
              </div>
            </form>
          </section>
        )}

        {page === "search" && (
          <section className="content-card">
            <div className="section-heading">
              <h2>Search Candidate</h2>
              <p>
                Search using either Mobile Number 1 or Mobile Number 2.
              </p>
            </div>

            <form className="search-form" onSubmit={searchCandidate}>
              <input
                type="tel"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Enter candidate's contact number"
                aria-label="Candidate contact number"
                required
              />

              <button type="submit" disabled={loading}>
                {loading ? "Searching..." : "Search"}
              </button>
            </form>

            <CandidateTable
              candidates={displayedCandidates}
              onView={setSelectedCandidate}
            />
          </section>
        )}

        {page === "candidates" && (
          <section className="content-card">
            <div className="section-heading">
              <h2>All Candidates</h2>
              <p>View registered candidates and their admission details.</p>
            </div>

            <div className="table-actions no-print">
              <button
                type="button"
                onClick={loadCandidates}
                disabled={loading}
              >
                Refresh List
              </button>
            </div>

            <CandidateTable
              candidates={candidates}
              onView={setSelectedCandidate}
            />
          </section>
        )}
      </main>

      {selectedCandidate && (
        <CandidateFolio
          candidate={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
        />
      )}
    </div>
  );
}

function CandidateTable({ candidates, onView }) {
  if (!candidates || candidates.length === 0) {
    return (
      <div className="empty-state">
        <h3>No candidates found</h3>
        <p>Candidate records will appear here once available.</p>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table className="candidate-table">
        <thead>
          <tr>
            <th>Candidate Name</th>
            <th>Father&apos;s Name</th>
            <th>Mobile Number 1</th>
            <th>Mobile Number 2</th>
            <th>Admission Date</th>
            <th>Training Time</th>
            <th>Total Fees</th>
            <th>Paid</th>
            <th>Balance</th>
            <th>Status</th>
            <th className="no-print">Details</th>
          </tr>
        </thead>

        <tbody>
          {candidates.map((candidate) => (
            <tr
              key={
                candidate._id ||
                candidate.id ||
                `${candidate.fullName}-${getMobile1(candidate)}`
              }
            >
              <td>{candidate.fullName || "—"}</td>
              <td>{candidate.fatherName || "—"}</td>
              <td>{getMobile1(candidate) || "—"}</td>
              <td>{candidate.mobileNumber2 || "—"}</td>
              <td>{formatDate(candidate.admissionDate)}</td>
              <td>
                {candidate.trainingTimeFrom || candidate.trainingTimeTo
                  ? `${formatTime(candidate.trainingTimeFrom)} – ${formatTime(candidate.trainingTimeTo)}`
                  : "—"}
              </td>
              <td>
                ₹{Number(candidate.totalFees || 0).toLocaleString("en-IN")}
              </td>
              <td>
                ₹{Number(candidate.paidFees || 0).toLocaleString("en-IN")}
              </td>
              <td>₹{getBalance(candidate).toLocaleString("en-IN")}</td>
              <td>{candidate.trainingStatus || "Not Started"}</td>
              <td className="no-print">
                <button
                  type="button"
                  onClick={() => onView(candidate)}
                >
                  View / Print
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
