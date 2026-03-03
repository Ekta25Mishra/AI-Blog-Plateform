import User from "../models/user.js";

// Get user notification preferences
export const getUserPreferences = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Ensure default preferences if not set
        const preferences = user.notificationPreferences || {
            likes: true,
            comments: true,
            follows: true,
            newPosts: true
        };

        res.json({ success: true, preferences });
    } catch (error) {
        console.error('Error getting user preferences:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get preferences'
        });
    }
};

// Update user notification preferences
export const updatePreferences = async (req, res) => {
    try {
        const { preferences } = req.body;

        if (!preferences || typeof preferences !== 'object') {
            return res.status(400).json({
                success: false,
                message: 'Invalid preferences data'
            });
        }

        // Validate preference keys
        const validKeys = ['likes', 'comments', 'follows', 'newPosts'];
        const invalidKeys = Object.keys(preferences).filter(key => !validKeys.includes(key));

        if (invalidKeys.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Invalid preference keys: ${invalidKeys.join(', ')}`
            });
        }

        // Update user preferences
        const user = await User.findByIdAndUpdate(
            req.user._id,
            {
                $set: {
                    'notificationPreferences.likes': preferences.likes !== false,
                    'notificationPreferences.comments': preferences.comments !== false,
                    'notificationPreferences.follows': preferences.follows !== false,
                    'notificationPreferences.newPosts': preferences.newPosts !== false
                }
            },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            message: 'Preferences updated successfully',
            preferences: user.notificationPreferences
        });
    } catch (error) {
        console.error('Error updating preferences:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update preferences'
        });
    }
};

// Render preferences page (if using server-side rendering)
export const renderPreferencesPage = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.redirect('back');
        }

        // Ensure default preferences if not set
        const preferences = user.notificationPreferences || {
            likes: true,
            comments: true,
            follows: true,
            newPosts: true
        };

        res.render('notifications/preferences', { preferences });
    } catch (error) {
        console.error('Error rendering preferences page:', error);
        res.redirect('back');
    }
};