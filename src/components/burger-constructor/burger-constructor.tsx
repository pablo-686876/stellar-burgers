import { FC, useMemo } from 'react';
import { BurgerConstructorUI } from '@ui';
import {
  orderBunSelector,
  orderIngredientSelector
} from '../../services/slices/constructorSlice';
import { useSelector, useDispatch } from '../../services/store';
import { userSelector } from '../../services/slices/userSlice';
import { useNavigate } from 'react-router-dom';
import {
  orderBurger,
  orderBurgerSelector,
  isOrderLoadingSelector,
  clearState
} from '../../services/slices/constructorSlice';

export const BurgerConstructor: FC = () => {
  const ingredients = useSelector(orderIngredientSelector);
  const bun = useSelector(orderBunSelector);
  const user = useSelector(userSelector);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const constructorItems = {
    bun,
    ingredients
  };

  const orderRequest = useSelector(isOrderLoadingSelector);
  const orderModalData = useSelector(orderBurgerSelector);

  const onOrderClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!constructorItems.bun || orderRequest) return;

    const ingredientsId = [
      bun!._id,
      ...ingredients.map((item) => item._id),
      bun!._id
    ];
    dispatch(orderBurger(ingredientsId));
  };

  const closeOrderModal = () => {
    dispatch(clearState());
  };

  const price = useMemo(() => {
    const bunPrice = bun ? bun.price * 2 : 0;
    const ingredientsPrice = ingredients.reduce(
      (sum, item) => sum + item.price,
      0
    );
    return bunPrice + ingredientsPrice;
  }, [bun, ingredients]);

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
