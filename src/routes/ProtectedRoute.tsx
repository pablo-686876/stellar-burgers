import { useSelector } from '../services/store';
import {
  userSelector,
  isAuthLoadingSelector
} from '../services/slices/userSlice';
import { Preloader } from '@ui';
import { Navigate } from 'react-router-dom';

type ProtectedRouteProps = {
  children: React.ReactElement;
};

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const user = useSelector(userSelector);
  const isAuthLoading = useSelector(isAuthLoadingSelector);
  if (isAuthLoading) {
    return <Preloader />;
  }
  if (!user) {
    return <Navigate to='/login' />;
  }

  return children;
};
