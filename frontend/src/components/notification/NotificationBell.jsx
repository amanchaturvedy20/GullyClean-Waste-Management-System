import React from 'react';
import { Bell } from 'lucide-react';
import { useSelector } from 'react-redux';

const NotificationBell = () => {
    const { list } = useSelector(state => state.notifications);

    return (
        <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle">
                <div className="indicator">
                    <Bell />
                    {list.length > 0 && <span className="badge badge-xs badge-primary indicator-item">{list.length}</span>}
                </div>
            </label>
            <div tabIndex={0} className="mt-3 z-[1] card card-compact dropdown-content w-52 bg-base-100 shadow">
                <div className="card-body">
                    {list.length > 0 ? (
                        list.map(n => <span key={n.id} className="font-bold text-lg">{n.title}</span>)
                    ) : (
                        <span>No new notifications</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotificationBell;