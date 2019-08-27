export default class SwapiService {
    _apiBase = '/map.json';
    getResourse = async (url) => {
        const res = await fetch(`${this._apiBase}`);
        if (!res.ok) {
            throw new Error(`Could not fetch ${url}` +
                `, received ${res.status}`)
        }
        return await res.json();
    };
    getMap = async () => {
        const res = await this.getResourse();
        return this._transformMap(res)
    };

    _transformMap = (map) => {
        let arr=[];
        for (const key of Object.keys(map)) {
            arr.push(map[key]);
        }
        return arr
    }

}


// let i = 0;
// data.data.forEach(item=>{
//     let addres = item.name.replace(", ", " ")
//     fetch(`https://geocode-maps.yandex.ru/1.x/?apikey=2342bd60-a212-486a-a5b6-8e84c2f50256&&format=json&geocode=${addres}`)
//         .then(response=>response.json())
//         .then(text=>{
//             let elem = `{
//                     "id": "${i}",
//                     "place": "${item.id}",
//                     "day": "${item.day}",
//                     "name": "${item.name}",
//                     "time": "${item.time}",
//                     "points": [
//                          ${text.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos}
//                     ]
//                  },
//             `
//             let divEl = document.createElement("div");
//             divEl.innerHTML = elem;
//             document.body.appendChild(divEl)
//             i++;
//         })
// })