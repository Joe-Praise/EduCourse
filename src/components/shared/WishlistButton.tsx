import { useEffect } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/reducers';
import { AppDispatch } from '../../redux/store';
import {
  addToWishlistAction,
  checkWishlistAction,
  removeFromWishlistAction,
} from '../../redux/actions/wishlistAction';
interface WishlistButtonProps {
  courseId: string;
}

const WishlistButton = ({ courseId }: WishlistButtonProps) => {
  const dispatch: AppDispatch = useDispatch();
  const userId: string = useSelector((state: RootState) => state.user.userObj?._id) ?? '';
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const wishlisted = useSelector((state: RootState) => state.wishlist.wishlisted[courseId]);

  useEffect(() => {
    if (userId && courseId && wishlisted === undefined) {
      dispatch(checkWishlistAction(userId, courseId));
    }
  }, [dispatch, userId, courseId, wishlisted]);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!userId) return;

    if (wishlisted) {
      const item = wishlistItems.find((i) => i.courseId?._id === courseId || i.courseId === courseId);
      const wishlistId = item?._id ?? '';
      dispatch(removeFromWishlistAction(wishlistId, courseId));
    } else {
      dispatch(addToWishlistAction(userId, courseId));
    }
  };

  if (!userId) return null;

  return (
    <button
      onClick={handleToggle}
      aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      className='p-1.5 rounded-full bg-white/80 hover:bg-white transition-colors shadow-sm'
    >
      {wishlisted ? (
        <FaHeart className='text-red-500 w-4 h-4' />
      ) : (
        <FaRegHeart className='text-gray-500 w-4 h-4 hover:text-red-400' />
      )}
    </button>
  );
};

export default WishlistButton;
