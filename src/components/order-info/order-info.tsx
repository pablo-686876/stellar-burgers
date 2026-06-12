import { FC, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import { useEffect } from 'react';
import { ingredientsSelector } from '../../services/slices/getIngredientsSlice';
import {
  getOrder,
  orderCreatedAtSelector,
  orderIdSelector,
  orderIngredientsSelector,
  orderNameSelector,
  orderStatusSelector,
  orderUpdatedAtSelector
} from '../../services/slices/orderSlice';

type TOrderInfo = {
  inModal?: boolean;
};

export const OrderInfo: FC<TOrderInfo> = ({ inModal }) => {
  const { number } = useParams();
  const orderNumber = Number(number);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getOrder(orderNumber));
  }, []);

  const createdAt = useSelector(orderCreatedAtSelector);
  const ingredients = useSelector(orderIngredientsSelector);
  const _id = useSelector(orderIdSelector);
  const status = useSelector(orderStatusSelector);
  const name = useSelector(orderNameSelector);
  const updatedAt = useSelector(orderUpdatedAtSelector);

  const orderData = {
    createdAt,
    ingredients,
    _id,
    status,
    name,
    updatedAt,
    number: orderNumber
  };

  const ingredientsAll: TIngredient[] = useSelector(ingredientsSelector);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredientsAll.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item: string) => {
        if (!acc[item]) {
          const ingredient = ingredientsAll.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredientsAll]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} inModal={inModal} />;
};
