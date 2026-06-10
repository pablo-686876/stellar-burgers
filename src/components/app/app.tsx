import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';

import { Modal, OrderInfo, IngredientDetails, AppHeader } from '@components';
import { useSelector, useDispatch } from '../../services/store';
import { useEffect } from 'react';

import {
  ingredientsSelector,
  isIngredientsLoadingSelector,
  errorSelector,
  getIngredients,
  isInitSelector
} from '../../services/slices/getIngredientsSlice';

import { getFeeds } from '../../services/slices/feedSlice';

import '../../index.css';
import styles from './app.module.css';

import { Preloader } from '@ui';
import { ProtectedRoute } from '../../routes/ProtectedRoute';
import { getUser } from '../../services/slices/userSlice';

import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const background = location.state?.background as Location | undefined;

  useEffect(() => {
    dispatch(getIngredients());
    dispatch(getFeeds());
    dispatch(getUser());
  }, []);
  const isIngredientsLoading = useSelector(isIngredientsLoadingSelector);
  const ingredients = useSelector(ingredientsSelector);
  const error = useSelector(errorSelector);
  const isInit = useSelector(isInitSelector);

  const onClose = () => {
    if (background) {
      navigate(background.pathname, { replace: true });
    } else {
      navigate(-1);
    }
  };

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background || location}>
        <Route
          path='/'
          element={
            !isInit || isIngredientsLoading ? (
              <Preloader />
            ) : error ? (
              <div
                className={`${styles.error} text text_type_main-medium pt-4`}
              >
                {error}
              </div>
            ) : ingredients.length > 0 ? (
              <ConstructorPage />
            ) : (
              <div
                className={`${styles.title} text text_type_main-medium pt-4`}
              >
                Нет игредиентов
              </div>
            )
          }
        />
        <Route path='/feed' element={<Feed />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route path='*' element={<NotFound404 />} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
      </Routes>
      {background && (
        <Routes>
          <Route
            path='/feed/:number'
            element={<Modal onClose={onClose} children={<OrderInfo />} />}
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal
                title={'Детали ингредиента'}
                onClose={onClose}
                children={<IngredientDetails />}
              />
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <Modal onClose={onClose} children={<OrderInfo />} />
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
