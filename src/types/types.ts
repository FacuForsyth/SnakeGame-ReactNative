export enum Direction {
  Right,
  Up,
  Down,
  Left,
}

export interface GestureEventType {
  nativeEvent: { translationX: number; translationY: number };
}

export interface Coordinate {
  x: number;
  y: number;
}