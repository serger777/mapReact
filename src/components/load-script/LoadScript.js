// статусы загружаемых скриптов и массив резолвов
var scriptsStatuses = {};

export default function LoadScript(url) {


    return new Promise(function (resolve, reject) {

        if (scriptsStatuses[url]) {
            switch (scriptsStatuses[url].status) {
                case 'loading':
                    // если скрипт уже начал загружаться, запоминаем в массиве его resolve, чтобы вызвать его позже.
                    scriptsStatuses[url].needResolving.push(resolve.bind(this));
                    return;
                case 'complete':
                    // если скрипт уже загружен, сразу резолвим промис
                    resolve(this);
                    return;
            }
        }
        // если скрипт не имеет статуса, скрипт новый, закрепляем за ним статус 'loading'
        scriptsStatuses[url] = {
            status: 'loading',
            needResolving: []
        };

        var r = false,
            t = document.getElementsByTagName("script")[0],
            s = document.createElement("script");

        s.type = "text/javascript";
        s.src = url;
        s.async = true;
        s.onload = s.onreadystatechange = function () {
            if (!r && (!this.readyState || this.readyState == "complete")) {
                r = true;
                // скрипт был загружен, сработал эвент, метим скрипт как complete и резолвим все промисы, которые попали в needResolving из-за статуса loading
                scriptsStatuses[url].status = 'complete';
                scriptsStatuses[url].needResolving.forEach(resolveBinded => resolveBinded());
                resolve(this);
            }
        };
        s.onerror = s.onabort = reject;
        t.parentNode.insertBefore(s, t);
    });
}