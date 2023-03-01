import { Coordinate } from "../types/types";

export const cheackEatsFood = (
  head: Coordinate,
  food: Coordinate,
  area: number,   //cuando pase muy cerca
):boolean => {
  const distanceBetweenFoodAndSnakeX: number = Math.abs(head.x - food.x);
  const distanceBetweenFoodAndSnakeY: number = Math.abs(head.y - food.y);

  return (
    distanceBetweenFoodAndSnakeX < area && distanceBetweenFoodAndSnakeY < area
  );
}