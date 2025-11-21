export function uuid() {
  return "xxxx-4xxx-yxxx".replace(/[xy]/g, c => 
    ((Math.random() * 16) | 0).toString(16)
  );
}
