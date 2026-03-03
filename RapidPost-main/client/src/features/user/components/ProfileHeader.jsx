import { Link } from 'react-router-dom';

const ProfileHeader = ({ user, currentUser, isMe, isFollowing, handleFollow, stats }) => {
    const { followersCount = 0, followingCount = 0 } = stats || {};

    return (
        <div className="profile-card card shadow-lg border-0 rounded-4 mx-md-5">
            <div className="card-body p-5">
                <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between">
                    <div className="d-flex gap-3 align-items-start flex-column flex-md-row">
                        <div className="position-relative">
                            <div className="rounded-circle bg-light d-flex align-items-center justify-content-center" style={{ width: '112px', height: '112px' }}>
                                {user.avatar && user.avatar.url ? (
                                    <img src={user.avatar.url} alt={user.name} className="rounded-circle" style={{ width: '112px', height: '112px', objectFit: 'cover' }} />
                                ) : (
                                    <span className="text-muted small">No Image</span>
                                )}
                            </div>
                        </div>
                        <div>
                            <div className="d-flex align-items-center gap-2">
                                <h1 className="h4 fw-bold mb-0">{user.name}</h1>
                                <div className="d-flex align-items-center gap-1 text-primary">
                                    <i className="bi bi-patch-check-fill"></i>
                                </div>
                            </div>
                            <div className="text-muted">@{user.username}</div>
                            <p className="text-secondary mt-2 mb-0" style={{ maxWidth: '56ch' }}>{user.bio}</p>
                        </div>
                    </div>

                    {isMe ? (
                        <div className="d-flex gap-2 mt-3 mt-md-0">
                            <Link to={`/users/${user._id}/edit`} className="btn btn-primary d-inline-flex align-items-center gap-2">
                                <i className="bi bi-gear"></i>
                                <span className="small">Edit Profile</span>
                            </Link>
                        </div>
                    ) : (
                        currentUser && (
                            <div className="d-flex gap-2 mt-3 mt-md-0">
                                <button onClick={handleFollow} className={`btn ${isFollowing ? 'btn-outline-primary' : 'btn-primary'} px-4`}>
                                    {isFollowing ? 'Unfollow' : 'Follow'}
                                </button>
                            </div>
                        )
                    )}
                </div>

                <div className="d-flex flex-wrap gap-4 mt-4 text-secondary">
                    <p className="mb-0"><span className="fw-semibold">{user.blogs.length}</span> Blogs</p>
                    <p className="mb-0"><span className="fw-semibold">{followersCount}</span> Followers</p>
                    <p className="mb-0"><span className="fw-semibold">{followingCount}</span> Following</p>
                </div>

                <div className="d-flex gap-2 mt-4">
                    {/* Social Links */}
                    {['twitter', 'linkedin', 'github', 'instagram'].map(platform => (
                        <a
                            key={platform}
                            href={user.socialLinks?.[platform] || "#"}
                            target={user.socialLinks?.[platform] ? "_blank" : "_self"}
                            rel="noreferrer"
                            onClick={e => !user.socialLinks?.[platform] && e.preventDefault()}
                            className={`btn-light btn-sm rounded-circle`}
                            title={platform.charAt(0).toUpperCase() + platform.slice(1)}
                            style={{ width: '32px', height: '32px', cursor: user.socialLinks?.[platform] ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}
                        >
                            <i className={`fa-brands fa-${platform === 'twitter' ? 'x-twitter' : platform}${platform !== 'twitter' ? (platform === 'linkedin' || platform === 'github' || platform === 'instagram' ? ' fa-xl' : '') : ''} ${platform === 'github' || platform === 'linkedin' || platform === 'instagram' ? 'me-2' : ''}`}></i>
                            {/* Note: Icon class adjustments based on original */}
                            {platform === 'twitter' && <i className="fa-brands fa-x-twitter fa-xl"></i>}
                            {platform === 'linkedin' && <i className="fa-brands fa-linkedin fa-xl me-2"></i>}
                            {platform === 'github' && <i className="fa-brands fa-square-github fa-xl me-2"></i>}
                            {platform === 'instagram' && <i className="fa-brands fa-square-instagram fa-xl me-2"></i>}
                        </a>
                    ))}
                </div>
                <div className="d-flex align-items-center gap-2 text-muted small mt-4">
                    <i className="bi bi-calendar2"></i>
                    <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
            </div>
        </div>
    );
};

const ProfileHeaderSafe = ({ user, currentUser, isMe, isFollowing, handleFollow, stats }) => {
    const { followersCount = 0, followingCount = 0 } = stats || {};
    return (
        <div className="profile-card card shadow-lg border-0 rounded-4 mx-md-5">
            <div className="card-body p-5">
                <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between">
                    <div className="d-flex gap-3 align-items-start flex-column flex-md-row">
                        <div className="position-relative">
                            <div className="rounded-circle bg-light d-flex align-items-center justify-content-center" style={{ width: '112px', height: '112px' }}>
                                {user.avatar && user.avatar.url ? (
                                    <img src={user.avatar.url} alt={user.name} className="rounded-circle" style={{ width: '112px', height: '112px', objectFit: 'cover' }} />
                                ) : (
                                    <span className="text-muted small">No Image</span>
                                )}
                            </div>
                        </div>
                        <div>
                            <div className="d-flex align-items-center gap-2">
                                <h1 className="h4 fw-bold mb-0">{user.name}</h1>
                                <div className="d-flex align-items-center gap-1 text-primary">
                                    <i className="bi bi-patch-check-fill"></i>
                                </div>
                            </div>
                            <div className="text-muted">@{user.username}</div>
                            <p className="text-secondary mt-2 mb-0" style={{ maxWidth: '56ch' }}>{user.bio}</p>
                        </div>
                    </div>

                    {isMe ? (
                        <div className="d-flex gap-2 mt-3 mt-md-0">
                            <Link to={`/users/${user._id}/edit`} className="btn btn-primary d-inline-flex align-items-center gap-2">
                                <i className="bi bi-gear"></i>
                                <span className="small">Edit Profile</span>
                            </Link>
                        </div>
                    ) : (
                        currentUser && (
                            <div className="d-flex gap-2 mt-3 mt-md-0">
                                <button onClick={handleFollow} className={`btn ${isFollowing ? 'btn-outline-primary' : 'btn-primary'} px-4`}>
                                    {isFollowing ? 'Unfollow' : 'Follow'}
                                </button>
                            </div>
                        )
                    )}
                </div>

                <div className="d-flex flex-wrap gap-4 mt-4 text-secondary">
                    <p className="mb-0"><span className="fw-semibold">{user.blogs.length}</span> Blogs</p>
                    <p className="mb-0"><span className="fw-semibold">{followersCount}</span> Followers</p>
                    <p className="mb-0"><span className="fw-semibold">{followingCount}</span> Following</p>
                </div>

                <div className="d-flex gap-2 mt-4">
                    <a
                        href={user.socialLinks?.twitter || "#"}
                        target={user.socialLinks?.twitter ? "_blank" : "_self"}
                        rel="noreferrer"
                        onClick={e => !user.socialLinks?.twitter && e.preventDefault()}
                        className={`btn-light btn-sm rounded-circle  ${!user.socialLinks?.twitter ? '' : ''}`}
                        title="Twitter"
                        style={{ width: '32px', height: '32px', cursor: user.socialLinks?.twitter ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}
                    >
                        <i className="fa-brands fa-x-twitter fa-xl"></i>
                    </a>

                    <a
                        href={user.socialLinks?.linkedin || "#"}
                        target={user.socialLinks?.linkedin ? "_blank" : "_self"}
                        rel="noreferrer"
                        onClick={e => !user.socialLinks?.linkedin && e.preventDefault()}
                        className={`btn-light btn-sm rounded-circle ${!user.socialLinks?.linkedin ? '' : ''}`}
                        title="LinkedIn"
                        style={{ width: '32px', height: '32px', cursor: user.socialLinks?.linkedin ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}
                    >
                        <i className="fa-brands fa-linkedin fa-xl me-2"></i>
                    </a>

                    <a
                        href={user.socialLinks?.github || "#"}
                        target={user.socialLinks?.github ? "_blank" : "_self"}
                        rel="noreferrer"
                        onClick={e => !user.socialLinks?.github && e.preventDefault()}
                        className={`btn-light btn-sm rounded-circle ${!user.socialLinks?.github ? '' : ''}`}
                        title="GitHub"
                        style={{ width: '32px', height: '32px', cursor: user.socialLinks?.github ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}
                    >
                        <i className="fa-brands fa-square-github fa-xl me-2"></i>
                    </a>

                    <a
                        href={user.socialLinks?.instagram || "#"}
                        target={user.socialLinks?.instagram ? "_blank" : "_self"}
                        rel="noreferrer"
                        onClick={e => !user.socialLinks?.instagram && e.preventDefault()}
                        className={`btn-light btn-sm rounded-circle ${!user.socialLinks?.instagram ? '' : ''}`}
                        title="Instagram"
                        style={{ width: '32px', height: '32px', cursor: user.socialLinks?.instagram ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}
                    >
                        <i className="fa-brands fa-square-instagram fa-xl me-2"></i>
                    </a>
                </div>
                <div className="d-flex align-items-center gap-2 text-muted small mt-4">
                    <i className="bi bi-calendar2"></i>
                    <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
            </div>
        </div>
    );
};

export default ProfileHeaderSafe;
