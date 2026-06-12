import { memo } from 'react';
import { Trash2 } from 'lucide-react';
import { NotificationType } from '../../redux/api/notificationApi';
import NotificationTypeIcon from './NotificationTypeIcon';
import { cn } from '../../lib/cn';

interface Props {
  notification: NotificationType;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
}

const getRelativeTime = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
};

const NotificationListItemComponent = ({ notification, onMarkRead, onDelete }: Props) => {
  const { _id, type, title, message, read, createdAt } = notification;

  return (
    <li
      className={cn(
        'group flex items-start gap-3 px-4 py-4 border-b border-line-subtle last:border-0 transition-colors',
        !read ? 'bg-clay-500/5' : 'bg-transparent hover:bg-bg-overlay/30',
      )}
      aria-current={!read ? 'true' : undefined}
    >
      {/* Type icon */}
      <div className='mt-0.5 shrink-0'>
        <NotificationTypeIcon type={type} />
      </div>

      {/* Content */}
      <div className='flex-1 min-w-0'>
        <div className='flex items-center gap-2'>
          {/* Unread indicator — dot is a non-color signal too (paired with aria-current + bold title) */}
          {!read && (
            <span
              aria-label='Unread'
              className='inline-block w-1.5 h-1.5 rounded-full bg-clay-500 shrink-0'
            />
          )}
          <p
            className={cn(
              'font-body text-sm truncate',
              !read ? 'font-semibold text-ink-primary' : 'text-ink-secondary',
            )}
          >
            {title}
          </p>
        </div>
        <p className='font-body text-xs text-ink-tertiary mt-1 line-clamp-2'>{message}</p>
        <p className='font-mono text-2xs uppercase tracking-[0.12em] text-ink-tertiary mt-1.5'>
          {getRelativeTime(createdAt)}
        </p>
      </div>

      {/* Actions */}
      <div className='shrink-0 flex items-center gap-1.5 ml-2'>
        {!read && (
          <button
            type='button'
            onClick={() => onMarkRead(_id)}
            className='font-mono text-2xs uppercase tracking-[0.18em] text-clay-400 hover:text-clay-500 whitespace-nowrap px-2 py-2 transition-colors'
            aria-label='Mark as read'
          >
            Mark read
          </button>
        )}
        <button
          type='button'
          onClick={() => onDelete(_id)}
          className='inline-grid place-items-center h-9 w-9 rounded-full text-ink-tertiary hover:text-signal-danger hover:bg-bg-overlay/40 transition-colors'
          aria-label='Delete notification'
        >
          <Trash2 size={14} strokeWidth={1.75} />
        </button>
      </div>
    </li>
  );
};

const NotificationListItem = memo(NotificationListItemComponent);

export default NotificationListItem;
