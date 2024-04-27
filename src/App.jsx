import React, { useState } from "react";
import axios from "axios";

const App = () => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!query) {
      setError("Please enter a search term.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const response = await axios.post(
        "https://jw65bf3w-5000.inc1.devtunnels.ms/search",
        { query },
      );
      setSearchResults(response.data);
      if (response.data.length) {
        handleViewDetails(response.data.join(","));
      }
    } catch (error) {
      console.error("Error searching publications:", error);
      setError("Failed to fetch search results. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (ids) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://jw65bf3w-5000.inc1.devtunnels.ms/details?ids=${ids}`,
      );
      setPublications(response.data); // Assuming the response is an array of publication details
    } catch (error) {
      console.error("Error fetching publication details:", error);
      setError("Failed to fetch publication details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>PubMed Publication Search</h1>
      <div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
        {publications.length > 0 && (
          <table border="1">
            <thead>
              <tr>
                <th>Title</th>
                <th>PMID</th>
                <th>Abstract</th>
                <th>Author(s)</th>
                <th>Journal</th>
                <th>Publication Year</th>
              </tr>
            </thead>
            <tbody>
              {publications.map((pub) => (
                <tr key={pub.PMID}>
                  <td>{pub.Title}</td>
                  <td>{pub.PMID}</td>
                  <td>
                    {typeof pub.Abstract === "object"
                      ? pub.Abstract["#text"]
                      : pub.Abstract}
                  </td>
                  <td>{pub.AuthorList}</td>
                  <td>{pub.Journal}</td>
                  <td>{pub.PublicationYear}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default App;
