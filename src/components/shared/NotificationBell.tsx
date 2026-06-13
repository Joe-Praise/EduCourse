import { useEffect, useRef, useState } from 'react';
import { Bell } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { RootState } from '../../redux/reducers';
import { AppDispatch } from '../../redux/store';
import {
  getNotificationsAction,
  getUnreadCountAction,
  markAllReadAction,
  markNotificationReadAction,
} from '../../redux/actions/notificationAppAction';
import { cn } from '../../lib/cn';

const NotificationBell = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const userId = useSelector((state: RootState) => state.user.userObj?._id);
  const { notifications, unreadCount } = useSelector(
    (state: RootState) => state.notificationApp,
  );

  useEffect(() => {
    if (!userId) return;
    dispatch(getUnreadCountAction());
  }, [dispatch, userId]);

  useEffect(() => {
    if (!open || !userId) return;
    dispatch(getNotificationsAction());
  }, [dispatch, open, userId]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (!userId) return null;

  const handleNotificationClick = (notificationId: string, link?: string) => {
    dispatch(markNotificationReadAction(notificationId));
    setOpen(false);
    if (link) navigate(link);
  };

  return (
    <div ref={ref} className='relative'>
      <button
        type='button'
        onClick={() => setOpen((v) => !v)}
        className='relative inline-grid place-items-center h-10 w-10 rounded-full text-ink-secondary hover:text-ink-primary hover:bg-bg-overlay/40 transition-colors'
        aria-label={
          unreadCount > 0
            ? `Notifications, ${unreadCount} unread`
            : 'Notifications'
        }
      >
        <Bell size={18} strokeWidth={1.75} />
        {unreadCount > 0 && (
          <span
            className='absolute top-0 right-0 min-w-[18px] h-[18px] bg-clay-500 text-white font-mono text-2xs uppercase tracking-[0.04em] tabular-nums rounded-full flex items-center justify-center px-1 border border-bg-base'
            aria-hidden
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className='absolute right-0 top-[calc(100%+8px)] w-80 bg-bg-raised rounded-card shadow-warm-3 border border-line-base z-50 overflow-hidden'>
          <div className='flex items-center justify-between px-4 py-3 border-b border-line-subtle'>
            <span className='font-mono text-2xs uppercase tracking-[0.18em] text-ink-tertiary'>
              Notifications
            </span>
            {unreadCount > 0 && (
              <button
                type='button'
                onClick={() => dispatch(markAllReadAction())}
                className='font-body text-xs text-clay-400 hover:text-clay-500 transition-colors'
              >
                Mark all read
              </button>
            )}
          </div>

          <ul className='max-h-72 overflow-y-auto divide-y divide-line-subtle'>
            {notifications.length === 0 ? (
              <li className='text-center font-body text-sm text-ink-tertiary italic py-6'>
                No notifications
              </li>
            ) : (
              notifications.map((n) => (
                <li key={n._id}>
                  <button
                    type='button'
                    onClick={() => handleNotificationClick(n._id, n.link)}
                    className={cn(
                      'w-full text-left px-4 py-3 hover:bg-bg-overlay/40 transition-colors',
                      !n.read && 'bg-clay-500/5',
                    )}
                  >
                    <div className='flex items-center gap-2'>
                      {!n.read && (
                        <span
                          aria-label='Unread'
                          className='inline-block w-1.5 h-1.5 rounded-full bg-clay-500 shrink-0'
                        />
                      )}
                      <p
                        className={cn(
                          'font-body text-sm truncate flex-1',
                          !n.read ? 'font-semibold text-ink-primary' : 'text-ink-secondary',
                        )}
                      >
                        {n.title}
                      </p>
                    </div>
                    <p className='font-body text-xs text-ink-tertiary mt-1 line-clamp-2'>
                      {n.message}
                    </p>
                    <p className='font-mono text-2xs uppercase tracking-[0.12em] text-ink-tertiary mt-1.5'>
                      {n.createdAt?.slice(0, 10)}
                    </p>
                  </button>
                </li>
              ))
            )}
          </ul>
          <div className='border-t border-line-subtle px-4 py-3 text-center'>
            <Link
              to='/notifications'
              onClick={() => setOpen(false)}
              className='font-mono text-2xs uppercase tracking-[0.22em] text-clay-400 hover:text-clay-500 transition-colors'
            >
              See all notifications →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
