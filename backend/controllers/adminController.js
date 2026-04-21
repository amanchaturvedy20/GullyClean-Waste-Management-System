const User = require('../models/user');
const Pickup = require('../models/pickup');

// We'll create a basic admin overview endpoint
exports.getAdminDashboardStats = async (req, res) => {
    try {
        const usersCount = await User.countDocuments();
        const workersCount = await User.countDocuments({ role: 'worker' });
        const citizensCount = await User.countDocuments({ role: 'citizen' });

        // Bin stats
        const Bin = require('../models/bin');
        const emptyBins = await Bin.countDocuments({ status: 'empty' });
        const halfFullBins = await Bin.countDocuments({ status: 'half-full' });
        const fullBins = await Bin.countDocuments({ status: 'full' });
        const overflowingBins = await Bin.countDocuments({ status: 'overflowing' });
        const requestedBins = await Bin.countDocuments({ status: 'requested' });
        const totalBins = emptyBins + halfFullBins + fullBins + overflowingBins + requestedBins;
        
        // Pickup stats
        const pendingPickups = await Pickup.countDocuments({ status: { $ne: 'completed' } });
        const completedPickups = await Pickup.countDocuments({ status: 'completed' });

        // Recent Activity (Last 5 Pickups)
        const recentPickups = await Pickup.find()
            .sort({ updatedAt: -1 })
            .limit(5)
            .populate('assignedTo', 'name email')
            .populate('bin', 'binId location');

        res.status(200).json({
            users: {
                total: usersCount,
                workers: workersCount,
                citizens: citizensCount
            },
            bins: {
                total: totalBins,
                empty: emptyBins,
                halfFull: halfFullBins,
                full: fullBins,
                overflowing: overflowingBins,
                requested: requestedBins
            },
            pickups: {
                pending: pendingPickups,
                completed: completedPickups
            },
            recentActivity: recentPickups,
            message: "Dashboard stats fetched successfully."
        });
    } catch (error) {
        console.error('Error fetching admin stats:', error);
        res.status(500).json({ message: 'Server error while fetching stats' });
    }
};

exports.getAllWorkers = async (req, res) => {
    try {
        const workers = await User.find({ role: 'worker' }).select('-password');
        res.status(200).json(workers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching workers' });
    }
};

exports.getAllCitizens = async (req, res) => {
    try {
        const citizens = await User.find({ role: 'citizen' }).select('-password');
        res.status(200).json(citizens);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching citizens' });
    }
};

exports.getWorkerStats = async (req, res) => {
    try {
        const workers = await User.find({ role: 'worker' }).select('-password');
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const stats = await Promise.all(workers.map(async (worker) => {
            const totalAssigned = await Pickup.countDocuments({ assignedTo: worker._id });
            const totalCompleted = await Pickup.countDocuments({ assignedTo: worker._id, status: 'completed' });
            
            const dailyAssigned = await Pickup.countDocuments({ 
                assignedTo: worker._id, 
                createdAt: { $gte: today } 
            });
            const dailyCompleted = await Pickup.countDocuments({ 
                assignedTo: worker._id, 
                status: 'completed', 
                completedDate: { $gte: today } 
            });

            return {
                worker,
                totalAssigned,
                totalCompleted,
                dailyAssigned,
                dailyCompleted
            };
        }));

        res.status(200).json(stats);
    } catch (error) {
        console.error('Error fetching worker stats:', error);
        res.status(500).json({ message: 'Error fetching worker stats' });
    }
};
