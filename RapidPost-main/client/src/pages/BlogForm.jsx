import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SimpleEditor } from '@/features/blog/components/tiptap-templates/simple/simple-editor';
import blogService from '../features/blog/services/blogService';

const BlogForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [aiMode, setAiMode] = useState(false);
    const [validated, setValidated] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        content: '',
        image: null
    });

    // AI State
    const [aiParams, setAiParams] = useState({
        prompt: '',
        tone: 'professional',
        length: 'short',
        format: 'Blog'
    });
    const [aiGenerating, setAiGenerating] = useState(false);

    useEffect(() => {
        if (isEdit) {
            const fetchBlog = async () => {
                try {
                    const res = await blogService.getById(id);
                    const blog = res.data.blog;
                    setFormData({
                        title: blog.title,
                        category: blog.category,
                        content: blog.description,
                        image: null
                    });
                } catch (_err) {
                    setError("Failed to fetch blog data");
                }
            };
            fetchBlog();
        }
    }, [id, isEdit]);

    const handleGenerateAI = async () => {
        if (!aiParams.prompt) {
            alert("Please enter a topic or idea first!");
            return;
        }
        setAiGenerating(true);
        try {
            const res = await blogService.generateContent(aiParams);
            if (res.data.success && res.data.content) {
                const newContent = res.data.content;
                setFormData(prev => ({ ...prev, content: newContent }));
            } else {
                alert("No content generated. Try again.");
            }
        } catch (err) {
            console.error(err);
            alert("Error generating content.");
        } finally {
            setAiGenerating(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.stopPropagation();
            setValidated(true);
            return;
        }

        setValidated(true);
        setLoading(true);
        setError('');

        const data = new FormData();
        data.append('blog[title]', formData.title);
        data.append('blog[description]', formData.content);
        data.append('blog[category]', formData.category);

        if (formData.image) {
            data.append('blog[image]', formData.image);
        }

        try {
            if (isEdit) {
                await blogService.update(id, data);
                navigate(`/blogs/${id}`);
            } else {
                await blogService.create(data);
                navigate('/blogs');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save blog');
            setLoading(false);
        }
    };

    return (
        <div className="bg-white min-vh-100 py-4">
            <div className="container" style={{ maxWidth: '64rem' }}>
                {/* Header */}
                <div className="mb-4">
                    <h1 className="fw-bold text-dark display-6 mb-2">
                        {isEdit ? 'Edit Your Blog' : 'Create Your Blog'}
                    </h1>
                    <p className="lead text-muted">Write manually or use AI to generate amazing content</p>
                </div>

                {/* Writing Mode Toggle */}
                {!isEdit && (
                    <div className="row g-3 mb-4">
                        <div className="col-12 col-sm-6">
                            <button
                                type="button"
                                className={`w-100 p-4 border rounded-3 ${!aiMode ? 'border-primary bg-light' : 'bg-white'}`}
                                onClick={() => setAiMode(false)}
                            >
                                <div className="text-center mb-2">
                                    <i className="fa-solid fa-2xl fa-pencil" style={{ color: '#9810fa' }}></i>
                                </div>
                                <h3 className="h6 fw-semibold mb-1 text-center">Manual Writing</h3>
                                <p className="text-muted small text-center mb-0">Write your blog content from scratch</p>
                            </button>
                        </div>
                        <div className="col-12 col-sm-6">
                            <button
                                type="button"
                                className={`w-100 p-4 border rounded-3 ${aiMode ? 'border-primary bg-light' : 'bg-white'}`}
                                onClick={() => setAiMode(true)}
                            >
                                <div className="text-center mb-2">
                                    <i className="fa-solid fa-bolt fa-2xl me-2" style={{ color: '#9810fa' }}></i>
                                </div>
                                <h3 className="h6 fw-semibold mb-1 text-center">AI-Powered</h3>
                                <p className="text-muted small text-center mb-0">Generate content using AI assistance</p>
                            </button>
                        </div>
                    </div>
                )}

                {/* AI Panel */}
                {aiMode && (
                    <div className="card border-primary-subtle mb-4">
                        <div className="card-body">
                            <h3 className="h5 fw-semibold mb-3 d-flex align-items-center">
                                <i className="bi bi-stars text-primary me-2"></i>
                                AI Content Generator
                            </h3>
                            <div className="mb-3">
                                <label className="form-label">What would you like to write about?</label>
                                <textarea
                                    className="form-control"
                                    rows="3"
                                    placeholder="Topic, idea, or brief..."
                                    value={aiParams.prompt}
                                    onChange={e => setAiParams({ ...aiParams, prompt: e.target.value })}
                                ></textarea>
                            </div>
                            <div className="row g-3 mb-3">
                                <div className="col-12 col-md-4">
                                    <label className="form-label">Tone</label>
                                    <select
                                        className="form-select"
                                        value={aiParams.tone}
                                        onChange={e => setAiParams({ ...aiParams, tone: e.target.value })}
                                    >
                                        <option value="professional">Professional</option>
                                        <option value="casual">Casual</option>
                                        <option value="technical">Technical</option>
                                        <option value="creative">Creative</option>
                                    </select>
                                </div>
                                <div className="col-12 col-md-4">
                                    <label className="form-label">Length</label>
                                    <select
                                        className="form-select"
                                        value={aiParams.length}
                                        onChange={e => setAiParams({ ...aiParams, length: e.target.value })}
                                    >
                                        <option value="short">Short (300-500)</option>
                                        <option value="medium">Medium (800-1200)</option>
                                        <option value="long">Long (1500+)</option>
                                    </select>
                                </div>
                                <div className="col-12 col-md-4">
                                    <label className="form-label">Format</label>
                                    <select
                                        className="form-select"
                                        value={aiParams.format}
                                        onChange={e => setAiParams({ ...aiParams, format: e.target.value })}
                                    >
                                        <option value="Blog">Blog</option>
                                        <option value="article">Article</option>
                                        <option value="tutorial">Tutorial</option>
                                        <option value="guide">How-to Guide</option>
                                    </select>
                                </div>
                            </div>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleGenerateAI}
                                disabled={aiGenerating}
                            >
                                {aiGenerating ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <span className="bi bi-stars me-2"></span>
                                        Generate
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {/* Blog Form */}
                <form onSubmit={handleSubmit} className={`card needs-validation ${validated ? 'was-validated' : ''}`} noValidate>
                    <div className="card-body">
                        {error && <div className="alert alert-danger">{error}</div>}

                        {/* Title */}
                        <div className="mb-3">
                            <label className="form-label">Title*</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter your blog title..."
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                            <div className="valid-feedback">Title looks Good!</div>
                            <div className="invalid-feedback">Please provide a title</div>
                        </div>

                        {/* Category & Tags */}
                        <div className="mb-3">
                            <label className="form-label">Category*</label>
                            <div className="row g-3">
                                <div className="col-12 col-md-6">
                                    <select
                                        className="form-select"
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                        required
                                    >
                                        <option value="">Select a category</option>
                                        <option value="Technology">Technology</option>
                                        <option value="Finance">Finance</option>
                                        <option value="Business">Business</option>
                                        <option value="Lifestyle">Lifestyle</option>
                                        <option value="Health">Health</option>
                                        <option value="Travel">Travel</option>
                                        <option value="Food">Food</option>
                                        <option value="Education">Education</option>
                                    </select>
                                    <div className="invalid-feedback">Please select a category</div>
                                </div>
                                <div className="col-12 col-md-6">
                                    <input type="text" className="form-control" placeholder="Tags (ai, technology, future)" />
                                </div>
                            </div>
                        </div>

                        {/* Thumbnail */}
                        <div className="mb-3">
                            <label className="form-label">Thumbnail*</label>
                            <input
                                type="file"
                                className="form-control"
                                accept="image/*"
                                onChange={e => setFormData({ ...formData, image: e.target.files[0] })}
                                required={!isEdit} // Required only on create
                            />
                            <div id="thumbPreviewWrap" className="mt-3 d-none">
                                <img id="thumbPreview" alt="Thumbnail Preview" className="img-thumbnail" style={{ maxWidth: '320px' }} />
                            </div>
                        </div>

                        {/* Content (Tiptap SimpleEditor) */}
                        <div className="mb-3">
                            <label className="form-label">Content*</label>
                            <SimpleEditor
                                content={formData.content}
                                onChange={(html) => setFormData(prev => ({ ...prev, content: html }))}
                                isRequired={true}
                            />
                            <div className="invalid-feedback">Please provide blog content</div>
                        </div>

                        {/* Submit */}
                        <div className="d-grid d-md-flex gap-2">
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Publishing...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-send me-2"></i>
                                        Publish Blog
                                    </>
                                )}
                            </button>
                        </div>

                    </div>
                </form>
            </div>
        </div>
    );
};

export default BlogForm;
