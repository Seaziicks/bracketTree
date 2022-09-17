export interface DoubleBinaryLeaf<T> {
  player1: T | undefined;
  player2: T | undefined;
  rightChild: DoubleBinaryLeaf<T> | undefined;
  leftChild: DoubleBinaryLeaf<T> | undefined;
}
