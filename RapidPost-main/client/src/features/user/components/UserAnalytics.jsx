const UserAnalytics = ({ stats, userBlogsCount }) => {
    const { totalViews = 0, totalLikes = 0, totalComments = 0 } = stats || {};

    return (
        <div className="mx-md-4 my-5">
            <div className="row g-4" data-id="analytics-cards">
                {/* Total Views */}
                <div className="col-12 col-md-6 col-lg-3">
                    <div className="analytics card rounded-4 shadow-lg border-0 h-100">
                        <div className="card-body rounded-4 bg-primary-subtle p-4 d-flex align-items-start justify-content-between">
                            <div>
                                <p className="text-muted small mb-1 fw-medium">Total Views</p>
                                <p className="fs-4 fw-bold text-dark mb-1">{totalViews}</p>
                                <p className="text-success small d-flex align-items-center mb-0">
                                    <i className="bi bi-graph-up-arrow me-1"></i>
                                    +12.5%
                                </p>
                            </div>
                            <div className="bg-primary-subtle rounded">
                                <i className="bi bi-eye fs-1 text-primary analytics-icon"></i>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Total Likes */}
                <div className="col-12 col-md-6 col-lg-3">
                    <div className="analytics card rounded-4 shadow-lg border-0 h-100">
                        <div className="card-body bg-danger-subtle rounded-4 p-4 d-flex align-items-start justify-content-between">
                            <div>
                                <p className="text-muted small mb-1 fw-medium">Total Likes</p>
                                <p className="fs-4 fw-bold text-dark mb-1">{totalLikes}</p>
                                <p className="text-success small d-flex align-items-center mb-0">
                                    <i className="bi bi-graph-up-arrow me-1"></i>
                                    +8.2%
                                </p>
                            </div>
                            <div className="bg-danger-subtle rounded">
                                <i className="bi bi-heart fs-1 text-danger analytics-icon"></i>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Comments */}
                <div className="col-12 col-md-6 col-lg-3">
                    <div className="analytics card rounded-4 shadow-lg border-0 h-100">
                        <div className="card-body bg-success-subtle rounded-4 p-4 d-flex align-items-start justify-content-between">
                            <div>
                                <p className="text-muted small mb-1 fw-medium">Comments</p>
                                <p className="fs-4 fw-bold text-dark mb-1">{totalComments}</p>
                                <p className="text-success small d-flex align-items-center mb-0">
                                    <i className="bi bi-graph-up-arrow me-1"></i>
                                    +15.3%
                                </p>
                            </div>
                            <div className="bg-success-subtle rounded">
                                <i className="bi bi-chat-left-text fs-1 text-success analytics-icon"></i>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Published Blogs */}
                <div className="col-12 col-md-6 col-lg-3">
                    <div className="analytics card rounded-4 shadow-lg border-0 h-100">
                        <div style={{ background: '#efe7ff' }} className="card-body rounded-4 p-4 d-flex align-items-start justify-content-between">
                            <div>
                                <p className="text-muted small mb-1 fw-medium">Published Blogs</p>
                                <p className="fs-4 fw-bold text-dark mb-1">{userBlogsCount}</p>
                                <p className="text-primary small d-flex align-items-center mb-0">
                                    <i className="bi bi-book me-1"></i>
                                </p>
                            </div>
                            <div className="rounded" style={{ background: '#efe7ff' }}>
                                <i className="bi bi-file-text fs-1 analytics-icon" style={{ color: '#6f42c1' }}></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserAnalytics;
