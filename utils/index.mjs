export function generateTrackingNumber() {
  const timestamp = Date.now().toString(36); 
  const randomPart = Math.random().toString(36).substr(2, 5); 
  return `${timestamp}-${randomPart}`.toUpperCase();
}

//hello world
