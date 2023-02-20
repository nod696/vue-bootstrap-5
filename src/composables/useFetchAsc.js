export default async function useFetchAsc(key){
    await fetch(`https://localhost:5173/cars/index?sort=-${key}`, {
        method: "GET",
        mode: "no-cors",
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json',
        }
    }).catch(result => {
        alert(`Запрос отправлен c параметром ${key}, сортировка на возрастание`);
    })
  };
  