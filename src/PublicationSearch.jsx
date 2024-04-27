import React, { useState } from "react";
import axios from "axios";

function PublicationSearch() {
  const [query, setQuery] = useState("");
  const [publications, setPublications] = useState([]);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    try {
      const response = await axios.post(
        "https://jw65bf3w-5000.inc1.devtunnels.ms/search",
        { query },
      );

      const ids = response.data.join(",");

      const detailsResponse = await axios.get(
        `https://jw65bf3w-5000.inc1.devtunnels.ms/details?ids=${ids}`,
      );
      setPublications(detailsResponse.data.publications);
    } catch (err) {
      setError(err.message || "An error occurred");
    }
  };

  return (
    <div>
      <h2>Publication Search</h2>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      {error && <p>{error}</p>}
      <div>
        {publications.map((publication) => (
          <div key={publication.PMID}>
            <h3>{publication.Title}</h3>
            <p>PMID: {publication.PMID}</p>
            <p>Abstract: {publication.Abstract}</p>
            <p>Authors: {publication.AuthorList}</p>
            <p>Journal: {publication.Journal}</p>
            <p>Year: {publication.PublicationYear}</p>
            <p>MeSH Terms: {publication.MeSHTerms.join(", ")}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PublicationSearch;
