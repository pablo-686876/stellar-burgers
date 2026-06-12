import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { ordersSelector, getOrders } from '../../services/slices/userSlice';
import { useEffect } from 'react';

export const ProfileOrders: FC = () => {
  const orders: TOrder[] = useSelector(ordersSelector);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getOrders());
  }, []);

  return <ProfileOrdersUI orders={orders} />;
};
