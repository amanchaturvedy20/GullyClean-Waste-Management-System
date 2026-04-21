import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { dismissNotification } from '../../store/notificationsSlice';

const NotificationContainer = () => {
    const { list } = useSelector(state => state.notifications);
    const dispatch = useDispatch();

    const alertType = {
        success: 'alert-success',
        error: 'alert-error',
        info: 'alert-info'
    }

    return (
        <div className="toast toast-end">
            {list.map(notification => (
                <div key={notification.id} className={`alert ${alertType[notification.type]}`}>
                    <div>
                        <span>{notification.message}</span>
                    </div>
                    <button onClick={() => dispatch(dismissNotification(notification.id))}>✕</button>
                </div>
            ))}
        </div>
    );
};

export default NotificationContainer;