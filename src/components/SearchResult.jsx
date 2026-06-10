function searchResult({searchInput, activeExplore}) {
  return (
    <div className="search-result">
        <h2>Search Result</h2>
        <div className="result-card">
            <img src={searchInput.avatar_url} alt="Avatar" className="avatar" />
            <div className="result-info">
                <h3>{searchInput.login}</h3>
                <p>{searchInput.bio}</p>
                <p>Followers: {searchInput.followers} | Following: {searchInput.following}</p>
                <p>Public Repos: {searchInput.public_repos}</p>
            </div>
        </div>
    </div>
  );
}