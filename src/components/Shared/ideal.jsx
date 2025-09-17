// File: RunQueryPage.jsx
import React, { useState } from "react";
import authService from "../../services/authService";

const RunQueryPage = () => {
  const [query, setQuery] = useState("");
  const [maxRows, setMaxRows] = useState(1000);
  const [code, setMCode] = useState();
  const [loading, setLoading] = useState(false);
  const [resultSets, setResultSets] = useState([]);
  const [error, setError] = useState(null);

  const handleRunQuery = async () => {
    setLoading(true);
    setError(null);
    setResultSets([]);

    try {
      const response = await authService.runQ(query, maxRows, code);
      setResultSets(response.resultSets || []);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Error executing query.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">🧪 Run Q</h2>

      <textarea
        rows={6}
        className="w-full border border-gray-300 rounded-md p-3 font-mono text-sm focus:ring focus:ring-blue-200 focus:outline-none"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter your SELECT query here..."
      />

      <div className="flex items-center mt-4 gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <label htmlFor="maxRows" className="font-medium">
            Max Rows:
          </label>
          <input
            type="number"
            id="maxRows"
            value={maxRows}
            onChange={(e) => setMaxRows(parseInt(e.target.value, 10))}
            min="1"
            max="10000"
            className="w-24 border border-gray-300 rounded px-2 py-1 text-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="maxRows" className="font-medium">
            Code:
          </label>
          <input
            type="number"
            id="code"
            value={code}
            onChange={(e) => setMCode(parseInt(e.target.value, 10))}
            className="w-24 border border-gray-300 rounded px-2 py-1 text-sm"
          />
        </div>

        <button
          onClick={handleRunQuery}
          disabled={loading || !query.trim()}
          className={`px-5 py-2 rounded text-white font-semibold ${loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
            }`}
        >
          {loading ? "Running..." : "Run Query"}
        </button>
      </div>

      {error && (
        <div className="mt-4 text-red-600 font-medium border border-red-300 bg-red-100 p-3 rounded">
          ⚠️ Error: {error}
        </div>
      )}

      {resultSets.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">📋 Results</h3>
          {resultSets.map((resultSet, index) => (
            <div key={index} className="mb-10">
              <h4 className="font-bold text-lg mb-2">
                {resultSet.tableName || `ResultSet ${index + 1}`}
              </h4>
              <div className="overflow-auto border border-gray-300 rounded-md">
                <table className="min-w-full text-sm text-left whitespace-nowrap">
                  <thead className="bg-gray-100 border-b">
                    <tr>
                      {resultSet.rows.length > 0 &&
                        Object.keys(resultSet.rows[0]).map((col, i) => (
                          <th key={i} className="py-2 px-3 font-semibold border-r border-gray-200">
                            {col}
                          </th>
                        ))}
                    </tr>
                  </thead>
                  <tbody>
                    {resultSet.rows.map((row, ri) => (
                      <tr key={ri} className="border-t hover:bg-gray-50">
                        {Object.values(row).map((val, ci) => (
                          <td key={ci} className="py-2 px-3 border-r border-gray-100">
                            {val !== null ? val.toString() : (
                              <span className="text-gray-400 italic">NULL</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RunQueryPage;
