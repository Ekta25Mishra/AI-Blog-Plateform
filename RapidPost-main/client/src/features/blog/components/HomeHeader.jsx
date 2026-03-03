import React from 'react';

const HomeHeader = ({ searchTerm, setSearchTerm, handleSearch, handleClearSearch, q }) => {
    return (
        <div className="text-center mt-5 mb-5 ">
            <div className="AI d-inline-flex align-items-center gap-2 px-4 py-1 mb-3 rounded-pill small">
                <p className="m-0">New: AI feature integrated</p>
                <i className="ms-1 fa-solid fa-wand-magic-sparkles" style={{ color: '#9810fa' }}></i>
            </div>

            <h1 className="tagline fw-semibold text-dark lh-sm display-5 fs-sm-6">
                Your own <span className="Blogging">Blogging</span><br />
                platform.
            </h1>

            <p className="my-4 my-sm-5 mx-auto text-muted" style={{ maxWidth: '42rem' }}>
                This is your space to think out loud, to share what matters, and to
                write without filters. <br />
                Whether it's one word or a thousand, your story starts right here.
            </p>

            <form id="searchForm" onSubmit={handleSearch} className="mx-auto" style={{ maxWidth: '36rem' }}>
                <div className="input-group">
                    <input
                        id="searchInput"
                        type="text"
                        className="form-control"
                        name="q"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search for blogs"
                        required
                    />
                    <button className="btn" type="submit">Search</button>
                </div>
                {q && (
                    <button
                        type="button"
                        onClick={handleClearSearch}
                        className="btn-outline-secondary btnn-decore mt-4"
                    >
                        <i className="fa-solid fa-xmark"></i> Clear Search
                    </button>
                )}
            </form>
        </div>
    );
};

export default HomeHeader;
