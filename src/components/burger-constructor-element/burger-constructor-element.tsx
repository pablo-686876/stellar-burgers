import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import {
  deleteOrderIngredient,
  moveOrderIngredientUp,
  moveOrderIngredientDown
} from '../../services/slices/constructorSlice';
import { useDispatch } from '../../services/store';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();
    const handleMoveDown = () => {
      dispatch(moveOrderIngredientDown(ingredient.id));
    };

    const handleMoveUp = () => {
      dispatch(moveOrderIngredientUp(ingredient.id));
    };

    const handleClose = () => {
      dispatch(deleteOrderIngredient(ingredient.id));
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
