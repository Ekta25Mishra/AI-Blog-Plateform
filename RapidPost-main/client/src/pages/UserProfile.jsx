import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/ui/Loader';
import { useUserProfile } from '../features/user/hooks/useUserProfile';
import ProfileHeader from '../features/user/components/ProfileHeader';
import UserAnalytics from '../features/user/components/UserAnalytics';
import ProfileBlogs from '../features/user/components/ProfileBlogs';

const UserProfile = () => {
    const { id } = useParams();
    const { user: currentUser } = useAuth();
    const { profileData, loading, error, handleFollow, handleSaveBlog, handleDeleteBlog } = useUserProfile(id);

    if (loading) return (
        <div className="d-flex justify-content-center mt-5">
            <Loader />
        </div>
    );
    if (error) return <div className="text-center mt-5 text-danger">{error}</div>;
    if (!profileData) return <div className="text-center mt-5">User not found</div>;

    const { user, stats } = profileData;
    const isMe = currentUser && currentUser._id === user._id;
    const isFollowing = currentUser && currentUser.following.includes(user._id);

    return (
        <div className="py-3 px-md-5">
            <div className="container">
                <ProfileHeader
                    user={user}
                    currentUser={currentUser}
                    isMe={isMe}
                    isFollowing={isFollowing}
                    handleFollow={handleFollow}
                    stats={stats}
                />

                {isMe && (
                    <UserAnalytics
                        stats={stats}
                        userBlogsCount={user.blogs.length}
                    />
                )}

                <ProfileBlogs
                    user={user}
                    isMe={isMe}
                    handleDeleteBlog={handleDeleteBlog}
                    handleSaveBlog={handleSaveBlog}
                />
            </div>
        </div>
    );
};

export default UserProfile;
