import { useSelector } from 'react-redux';
import { RootState } from '../redux/reducers';

const INSTRUCTOR_ROLES = ['instructor', 'admin'] as const;

const hasRole = (role: string | string[] | undefined, target: string): boolean => {
  if (!role) return false;
  return Array.isArray(role) ? role.includes(target) : role === target;
};

const hasAnyRole = (role: string | string[] | undefined, targets: readonly string[]): boolean => {
  if (!role) return false;
  return Array.isArray(role)
    ? role.some((r) => targets.includes(r))
    : targets.includes(role);
};

const useCurrentUser = () => {
  const userObj = useSelector((state: RootState) => state.user.userObj);

  const isLoggedIn = !!userObj?._id;
  const isInstructor = hasAnyRole(userObj?.role, INSTRUCTOR_ROLES);
  const isAdmin = hasRole(userObj?.role, 'admin');

  return {
    user: userObj,
    isLoggedIn,
    isInstructor,
    isAdmin,
  };
};

export default useCurrentUser;
