import Alpine from "alpinejs";
import "./app";
// @ts-ignore
window.Alpine = Alpine;
Alpine.start();

// @ts-ignore
const HTTP_LINK = import.meta.env.VITE_API_HOST;
// @ts-ignore
const API_KEY = import.meta.env.VITE_API_KEY;
// @ts-ignore
console.log(import.meta.env);
// @ts-ignore
console.log(import.meta.env.VITE_API_KEY);
