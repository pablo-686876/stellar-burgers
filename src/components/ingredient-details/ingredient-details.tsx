import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useSelector } from '../../services/store';
import { ingredientsSelector } from '../../services/slices/getIngredientsSlice';
import { useParams, useLocation } from 'react-router-dom';

export const IngredientDetails: FC = () => {
  const ingredients = useSelector(ingredientsSelector);
  const { id } = useParams();

  const ingredientData = ingredients.find(
    (ingrerdient) => ingrerdient._id === id
  );

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
