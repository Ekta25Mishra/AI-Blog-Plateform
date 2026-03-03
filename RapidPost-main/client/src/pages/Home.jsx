import { useState, useEffect } from 'react';
import blogService from '../features/blog/services/blogService';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/ui/Loader';
import HomeHeader from '../features/blog/components/HomeHeader';
import BlogCard from '../features/blog/components/BlogCard';

const Home = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();
    const { socket } = useAuth();

    // get query params
    const q = searchParams.get('q') || '';
    const category = searchParams.get('category') || 'All';

    // state for local input value and fetching indicator
    const [searchTerm, setSearchTerm] = useState(q);
    const [isFetching, setIsFetching] = useState(false);
    const [highlightedBlogId, setHighlightedBlogId] = useState(null);

    // sync state with URL only if they differ significantly (navigating back/forward)
    // This prevents cursor jumping if we were to just set it blindly, though with simple input it's usually fine.
    useEffect(() => {
        setSearchTerm(q);
    }, [q]);

    useEffect(() => {
        if (socket) {
            const handleNewBlog = (newBlog) => {
                // only prepend if it matches current category filter (or category is All) and matches search term if any 
                if (category !== 'All' && newBlog.category !== category) return;

                setBlogs(prev => {
                    const exists = prev.find(b => b._id === newBlog._id);
                    if (exists) return prev;

                    setHighlightedBlogId(newBlog._id); // Highlight the new blog

                    setTimeout(() => setHighlightedBlogId(null), 5000); // Clear highlight after 5 seconds

                    return [newBlog, ...prev];
                });
            };

            const handleDeleteBlog = (blogId) => {
                setBlogs(prev => prev.filter(b => b._id !== blogId));
            };

            const handleUpdateViews = (data) => {
                setBlogs(prev => prev.map(b => b._id === data.blogId ? { ...b, views: data.views } : b));
            };

            const handleUpdateLikes = (data) => {
                setBlogs(prev => prev.map(b => b._id === data.blogId ? { ...b, likes: data.likes } : b));
            };

            socket.on('newBlog', handleNewBlog);
            socket.on('deleteBlog', handleDeleteBlog);
            socket.on('update_views', handleUpdateViews);
            socket.on('update_likes', handleUpdateLikes);

            return () => {
                socket.off('newBlog', handleNewBlog);
                socket.off('deleteBlog', handleDeleteBlog);
                socket.off('update_views', handleUpdateViews);
                socket.off('update_likes', handleUpdateLikes);
            };
        }
    }, [socket, category, q]);

    // Debounce search term to update URL
    useEffect(() => {
        const handler = setTimeout(() => {
            setSearchParams(prev => {
                const newParams = new URLSearchParams(prev);
                if (searchTerm) {
                    newParams.set('q', searchTerm);
                } else {
                    newParams.delete('q');
                }
                return newParams;
            });
        }, 300); // 300ms delay 

        return () => clearTimeout(handler);
    }, [searchTerm, setSearchParams]);

    useEffect(() => {
        const fetchBlogs = async () => {
            setIsFetching(true); // Start loading feedback
            try {
                // Clean way to pass params
                const paramsObj = {};
                if (q) paramsObj.q = q;
                if (category && category !== 'All') paramsObj.category = category;

                const response = await blogService.getAll(paramsObj);

                setBlogs(response.data.allBlogs || response.data);
            } catch (err) {
                console.error("Error fetching blogs:", err);
                setError('Failed to fetch blogs');
            } finally {
                setLoading(false); // Initial load done
                setIsFetching(false); // Update done
            }
        };
        fetchBlogs();
    }, [q, category]);

    const handleSearch = (e) => {
        e.preventDefault();
        // Immediate update on submit 
        setSearchParams(prev => {
            const newParams = new URLSearchParams(prev);
            if (searchTerm) {
                newParams.set('q', searchTerm);
            } else {
                newParams.delete('q');
            }
            return newParams;
        });
    };

    const handleCategoryClick = (cat) => {
        // Use current searchTerm so we don't lose typed text
        setSearchParams(prev => {
            const newParams = new URLSearchParams(prev);
            newParams.set('category', cat);
            // Ensure q is preserved from current state
            if (searchTerm) {
                newParams.set('q', searchTerm);
            } else {
                newParams.delete('q');
            }
            return newParams;
        });
    };

    const handleClearSearch = () => {
        setSearchTerm('');

        // Instant update without waiting for debounce
        setSearchParams(prev => {
            const n = new URLSearchParams(prev);
            n.delete('q');
            return n;
        });
    };

    if (loading) return (
        <div className="d-flex justify-content-center mt-5">
            <Loader />
        </div>
    );
    if (error) return <div>{error}</div>;

    return (
        <div className="position-relative mx-3 mx-sm-5 mx-xl-7">

            <HomeHeader
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                handleSearch={handleSearch}
                handleClearSearch={handleClearSearch}
                q={q}
            />

            {/* Category Filter Buttons */}
            <div className="d-flex align-items-center justify-content-center gap-2 my-4">
                {['All', 'Technology', 'Education', 'Travel', 'Finance'].map((cat) => (
                    <button
                        key={cat}
                        onClick={() => handleCategoryClick(cat)}
                        className={`btnn-decore btn-link text-muted text-decoration-none btn-sm me-2 ${category === cat ? 'active-category' : ''}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="mx-auto row row-cols row-cols-sm-1 row-cols-md-2 row-cols-lg-3 g-5 mt-3"
                style={{ opacity: isFetching ? 0.5 : 1, transition: 'opacity 0.2s' }}>
                {blogs.map((blog) => (
                    <BlogCard
                        key={blog._id}
                        blog={blog}
                        highlightedBlogId={highlightedBlogId}
                    />
                ))}
            </div>

            <div className="container my-5">
                <div className="d-flex flex-column align-items-center text-center">
                    <h1 className="h3 h1-md fw-semibold">Never Miss a Blog!</h1>
                    <p className="text-muted mb-4">Subscribe to get the latest blog, new tech, and exclusive news.</p>
                    <form action="" method="POST" className="w-100" style={{ maxWidth: '48rem' }}>
                        <div className="input-group">
                            <input type="email" className="form-control" name="email" placeholder="Enter your email id" required />
                            <button className="btn px-4 px-md-5" type="submit">Subscribe</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Home;
