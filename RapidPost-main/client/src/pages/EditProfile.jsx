import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import userService from '../features/user/services/userService';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/ui/Loader';

const EditProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();

    const [formData, setFormData] = useState({
        name: '',
        username: '',
        bio: '',
        twitter: '',
        linkedin: '',
        github: '',
        instagram: ''
    });
    const [avatar, setAvatar] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await userService.getProfile(id);
                const { user } = res.data; 

                // Security check
                if (currentUser && currentUser._id !== user._id) {
                    alert("You can only edit your own profile");
                    navigate(`/users/${user._id}`);
                    return;
                }

                setFormData({
                    name: user.name || '',
                    username: user.username || '',
                    bio: user.bio || '',
                    twitter: user.socialLinks?.twitter || '',
                    linkedin: user.socialLinks?.linkedin || '',
                    github: user.socialLinks?.github || '',
                    instagram: user.socialLinks?.instagram || ''
                });

                if (user.avatar && user.avatar.url) {
                    setPreview(user.avatar.url);
                }

                setLoading(false);
            } catch (err) {
                console.error("Error fetching profile:", err);
                setError("Failed to load user profile");
                setLoading(false);
            }
        };
        fetchProfile();
    }, [id, currentUser, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setAvatar(file);
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        const data = new FormData();
        data.append('user[name]', formData.name);
        data.append('user[username]', formData.username);
        data.append('user[bio]', formData.bio);
        data.append('socialLinks[twitter]', formData.twitter);
        data.append('socialLinks[linkedin]', formData.linkedin);
        data.append('socialLinks[github]', formData.github);
        data.append('socialLinks[instagram]', formData.instagram);

        if (avatar) {
            data.append('user[avatar]', avatar);
        }

        try {
            await userService.updateProfile(id, data);
            navigate(`/users/${id}`);
        } catch (err) {
            console.error("Update error:", err);
            setError("Failed to update profile");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="d-flex justify-content-center mt-5">
            <Loader />
        </div>
    );
    if (error) return <div className="text-center mt-5 text-danger">{error}</div>;

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="card shadow-lg border-0 rounded-4">
                        <div className="card-body p-5">
                            <h2 className="text-center fw-bold mb-4">Edit Profile</h2>
                            <form onSubmit={handleSubmit} encType="multipart/form-data">

                                {/* Avatar Upload */}
                                <div className="mb-4 text-center">
                                    <div className="d-inline-block position-relative">
                                        <div className="rounded-circle bg-light d-flex align-items-center justify-content-center overflow-hidden"
                                            style={{ width: '120px', height: '120px', border: '1px solid #dee2e6' }}>
                                            {preview ? (
                                                <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <i className="bi bi-person fs-1 text-muted"></i>
                                            )}
                                        </div>
                                        <label htmlFor="avatar" className="position-absolute bottom-0 end-0 btn btn-sm btn-primary rounded-circle" style={{ cursor: 'pointer' }}>
                                            <i className="bi bi-camera"></i>
                                            <input type="file" id="avatar" name="avatar" className="d-none" onChange={handleFileChange} />
                                        </label>
                                    </div>
                                    <div className="form-text mt-2">Click icon to change profile picture</div>
                                </div>

                                {/* Basic Info */}
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Display Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Username</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        required
                                    />
                                    <div class="form-text">This will be the public handle</div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Bio</label>
                                    <textarea
                                        className="form-control"
                                        name="bio"
                                        rows="3"
                                        value={formData.bio}
                                        onChange={handleChange}
                                        placeholder="Tell us about yourself"
                                    ></textarea>
                                    <div class="form-text">Brief description for the profile</div>
                                </div>

                                <hr className="my-4" />
                                <h5 className="fw-semibold mb-3">Social Links</h5>

                                <div className="mb-3">
                                    <label className="form-label small text-muted"><i className="bi bi-twitter me-1"></i> Twitter</label>
                                    <input
                                        type="url"
                                        className="form-control"
                                        name="twitter"
                                        value={formData.twitter}
                                        onChange={handleChange}
                                        placeholder="https://twitter.com/..."
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label small text-muted"><i className="bi bi-linkedin me-1"></i> LinkedIn</label>
                                    <input
                                        type="url"
                                        className="form-control"
                                        name="linkedin"
                                        value={formData.linkedin}
                                        onChange={handleChange}
                                        placeholder="https://linkedin.com/in/..."
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label small text-muted"><i className="bi bi-github me-1"></i> GitHub</label>
                                    <input
                                        type="url"
                                        className="form-control"
                                        name="github"
                                        value={formData.github}
                                        onChange={handleChange}
                                        placeholder="https://github.com/..."
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="form-label small text-muted"><i className="bi bi-instagram me-1"></i> Instagram</label>
                                    <input
                                        type="url"
                                        className="form-control"
                                        name="instagram"
                                        value={formData.instagram}
                                        onChange={handleChange}
                                        placeholder="https://instagram.com/..."
                                    />
                                </div>

                                <div className="d-grid gap-2">
                                    <button type="submit" className="btn btn-primary py-2" disabled={submitting}>
                                        {submitting ? 'Saving...' : 'Save Changes'}
                                    </button>
                                    <button type="button" className="btn btn-outline-secondary py-2" onClick={() => navigate(-1)} disabled={submitting}>
                                        Cancel
                                    </button>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditProfile;
