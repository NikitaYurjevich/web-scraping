let json = require('C:\Users\YesCoding\nikikikikiki\dveriparser\result.json');
console.log(json);

let ctx = document.getElementById('canvas').getContext('2d');

let chart = new Chart(ctx, {
    type: 'line',

    data: {
    labels: [0,1],
    datasets: [{
        label: 'График',
        data: [2,6],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
        }]
    }
});