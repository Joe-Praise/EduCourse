import { FaBell, FaBook, FaDollarSign, FaGraduationCap, FaStar } from 'react-icons/fa';

interface Props {
  type: string;
  className?: string;
}

const NotificationTypeIcon = ({ type, className = 'w-5 h-5' }: Props) => {
  switch (type) {
    case 'enrollment':
      return <FaGraduationCap className={`${className} text-blue-500`} />;
    case 'review':
      return <FaStar className={`${className} text-yellow-500`} />;
    case 'course_published':
      return <FaBook className={`${className} text-green-500`} />;
    case 'earning':
      return <FaDollarSign className={`${className} text-emerald-500`} />;
    default:
      return <FaBell className={`${className} text-gray-400`} />;
  }
};

export default NotificationTypeIcon;
