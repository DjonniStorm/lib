export function useDumbState<T>(
  initialValue: T,
  render: () => void,
): [T, (newValue: T) => void] {
  let value = initialValue;

  const getValue = (): T => value;

  const setValue = (newValue: T) => {
    value = newValue;
    render();
  };

  return [getValue(), setValue];
}
