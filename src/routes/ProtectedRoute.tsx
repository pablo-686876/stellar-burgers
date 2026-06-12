import { useSelector } from '../services/store';
import {
  userSelector,
  isAuthLoadingSelector
} from '../services/slices/userSlice';
import { Preloader } from '@ui';
import { Navigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

type ProtectedRouteProps = {
  children: React.ReactElement;
  onlyUnAuth?: boolean;
};

export const ProtectedRoute = ({
  children,
  onlyUnAuth
}: ProtectedRouteProps) => {
  const user = useSelector(userSelector);
  const isAuthLoading = useSelector(isAuthLoadingSelector);
  const location = useLocation();

  if (isAuthLoading) {
    return <Preloader />;
  }
  if (!onlyUnAuth && !user) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }
  if (onlyUnAuth && user) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate replace to={from} />;
  }

  return children;
};
