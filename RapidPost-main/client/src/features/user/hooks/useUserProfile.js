import { useState, useEffect } from 'react';
import userService from '../services/userService';
import blogService from '../../blog/services/blogService';
import { useAuth } from '../../../context/AuthContext';

export const useUserProfile = (id) => {
    const { user: currentUser, setUser } = useAuth();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            setError('');
            try {
                const res = await userService.getProfile(id);
                setProfileData(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching profile:", err);
                if (err.response?.status === 401) {
                    setError("Please login to view profiles");
                } else if (err.response?.status === 404) {
                    setError("User not found");
                } else {
                    setError("Failed to load user profile");
                }
                setLoading(false);
            }
        };
        fetchProfile();
    }, [id]);

    const handleFollow = async () => {
        if (!currentUser) return alert("Please login to follow");
        try {
            await userService.followUser(id);
            const res = await userService.getProfile(id);
            setProfileData(res.data);
            setUser(prev => {
                const isFollowing = prev.following.includes(id);
                let newFollowing;
                if (isFollowing) {
                    newFollowing = prev.following.filter(uid => uid !== id);
                } else {
                    newFollowing = [...prev.following, id];
                }
                return { ...prev, following: newFollowing };
            });
        } catch (e) {
            console.error(e);
            alert("Failed to follow user");
        }
    };

    const handleSaveBlog = async (blogId) => {
        try {
            await blogService.toggleSave(blogId);
            const res = await userService.getProfile(id);
            setProfileData(res.data);
            if (currentUser) {
                setUser(prev => {
                    const isSaved = prev.savedBlogs?.includes(blogId);
                    let newSaved;
                    if (isSaved) {
                        newSaved = prev.savedBlogs.filter(bid => bid !== blogId);
                    } else {
                        newSaved = [...(prev.savedBlogs || []), blogId];
                    }
                    return { ...prev, savedBlogs: newSaved };
                });
            }
        } catch (e) {
            console.error(e);
            alert("Failed to save blog");
        }
    };

    const handleDeleteBlog = async (blogId) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await blogService.delete(blogId);
            setProfileData(prev => (
                {
                    ...prev,
                    user: {
                        ...prev.user,
                        blogs: prev.user.blogs.filter(b => b._id !== blogId)
                    },
                }
            ));
        } catch (e) {
            console.error(e);
            alert("Failed to delete blog");
        }
    };

    return {
        profileData,
        loading,
        error,
        handleFollow,
        handleSaveBlog,
        handleDeleteBlog
    };
};
