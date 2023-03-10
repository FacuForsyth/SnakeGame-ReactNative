import * as React from 'react';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../styles/colors';
import { Coordinate, Direction, GestureEventType } from '../types/types';
import Snake from './Snake';
import { checkGameOver } from '../utils/checkGameOver';
import Food from './Food';
import { cheackEatsFood } from '../utils/cheackEatsFood';
import { randomFoodPosition } from '../utils/randomFoodPosition';
import Header from './Header';

const SNAKE_INITIAL_POSITION = [{ x: 5, y: 5}]; //es un arreglo por que va a ir creciendo
const FOOD_INITIAL_POSITION = { x: 5, y: 20 }; //es solo una
const GAME_BOUNDS = { xMin: 0, xMax: 37, yMin: 0, yMax: 67 }; //si pasa estas medidas -> gameover
const MOVE_INTERVAL = 50;
const SCORE_INCREMENT = 10;

export default function Game():JSX.Element {
  const [direction, setDirection] = React.useState<Direction>(Direction.Right); //empieza siempre hacia la derecha
  const [snake, setSnake] = React.useState<Coordinate[]>(SNAKE_INITIAL_POSITION);
  const [food, setFood] = React.useState<Coordinate>(FOOD_INITIAL_POSITION);
  const [score, setScore] = React.useState(0);
  const [isGameOver, setIsGameOver] = React.useState<boolean>(false);
  const [isPaused, setIsPaused] = React.useState<boolean>(false);

  //para mover la snake
  React.useEffect(() => {
    if (!isGameOver) {
      //si no perdimos -> moveSnake
      const intervalID = setInterval(() => {
        !isPaused && moveSnake();
      }, MOVE_INTERVAL)   //se llama cada 50mseg
      return () => clearInterval(intervalID);
    }
  }, [isGameOver, snake, isPaused]);

  const moveSnake = () => {
    const snakeHead = snake[0];
    const newHead = {...snakeHead};   //crear una copia

    //gameover
    if (checkGameOver(snakeHead, GAME_BOUNDS)) {
      //setIsGameOver(true);   //no
      setIsGameOver((prev) => !prev);    //cambia el estado al contrario en el mismo ciclo
      return;
    }

    switch(direction) {
      case Direction.Up:
        newHead.y -= 1;
        break;
      case Direction.Down:
        newHead.y += 1;
        break;
      case Direction.Left:
        newHead.x -= 1;
        break;
      case Direction.Right:
        newHead.x += 1;
        break;
      default:
        break;
    }

    //check if eats food
    if (cheackEatsFood(newHead, food, 2)) {
      setFood(randomFoodPosition(GAME_BOUNDS.xMax, GAME_BOUNDS.yMax));
      setSnake([newHead, ...snake]);
      setScore(score + SCORE_INCREMENT);
    } else {
      setSnake([newHead, ...snake.slice(0, -1)]);   //move snake
    }
  };

  const handleGesture = (event: GestureEventType) => {
    //console.log(event.nativeEvent);   //-> necesito translation x y
    const { translationX, translationY } = event.nativeEvent;
    //console.log(translationX, translationY);  //para ver los movimientos

    if (Math.abs(translationX) > Math.abs(translationY)) {
      if (translationX > 0) {
        setDirection(Direction.Right);
      } else {
        setDirection(Direction.Left);
      }
    } else {
      if (translationY > 0) {
        setDirection(Direction.Down);
      } else {
        setDirection(Direction.Up);
      }
    }
    //console.log(direction);   //puedo ver la direccion
  };

  const reloadGame = () => {
    setSnake(SNAKE_INITIAL_POSITION);
    setFood(FOOD_INITIAL_POSITION);
    setIsGameOver(false);
    setScore(0);
    setDirection(Direction.Right);
    setIsPaused(false);
  }

  const pauseGame = () => {
    setIsPaused(!isPaused);
  };

  return (
    <PanGestureHandler onGestureEvent={handleGesture}>
      <SafeAreaView style={styles.container}>
        <Header
          realoadGame={reloadGame}
          isPaused={isPaused}
          pauseGame={pauseGame}
        >
          <Text 
            style={{
              fontSize: 22,
              fontWeight: "bold",
              color: Colors.primary,
            }}
          >
            {score}
          </Text>
        </Header>
        <View style={styles.boundaries}>
          <Snake snake={snake} />
          <Food x={food.x} y={food.y} />
        </View>
      </SafeAreaView>
    </PanGestureHandler>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  boundaries: {
    flex: 1,
    borderWidth: 12,
    borderColor: Colors.primary,
    backgroundColor: Colors.background,
    borderBottomLeftRadius:30,
    borderBottomRightRadius: 30,
  }
})