var festivos = new Set([
    "2020-01-01", "2020-01-06", "2020-03-26", "2020-04-09", "2020-04-10", "2020-05-01",
    "2020-05-25", "2020-05-15", "2020-06-22", "2020-06-29", "2020-07-20", "2020-08-07",
    "2020-08-17", "2020-10-12", "2020-11-02", "2020-11-16", "2020-12-08", "2020-12-25",
    "2021-01-01", "2021-01-11", "2021-03-22", "2021-04-01", "2021-04-02", "2021-05-01",
    "2021-05-17", "2021-06-07", "2021-06-14", "2021-07-05", "2021-07-20", "2021-08-07", 
    "2021-08-16", "2021-10-18", "2021-11-01", "2021-11-15", "2021-12-08", "2021-12-25",
]);

var horasNoche = [21, 22, 23, 0, 1, 2, 3, 4, 5];

var costHours = {
    'ordinaria':1, 
    'extra_diurna':1.25, 
    'recargo_nocturno':1.35, 
    'extra_nocturna':1.75, 
    'dominical_diurna':1.75, 
    'extra_dominical_diurna':2.0, 
    'dominical_nocturna':2.1,
    'extra_dominical_nocturna':2.5
};

var sumCostHoursTotal = {'ordinaria':0.0, 
    'extra_diurna':0.0, 
    'recargo_nocturno':0.0, 
    'extra_nocturna':0.0, 
    'dominical_diurna':0.0, 
    'extra_dominical_diurna':0.0, 
    'dominical_nocturna':0.0, 
    'extra_dominical_nocturna':0.0
};

function convertInputDate(date) {
    let year = date.slice(0, 4);
    let month = date.slice(5, 7) -1;
    let day = date.slice(8, 10);

    let convertedDate = new Date(year, month, day);
    return convertedDate
}

function convertDate(date) {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    if (month < 10) {
        month = "0" + month;
    }
    let day = date.getDate();
    if (day < 10) {
        day = "0" + day;
    }
    return year+"-"+month+"-"+day
}

esDomingo = (date) => {
    var dateInput = convertDate(date);
    // console.log(dateInput);
    if (date.getDay() == 0) {
        return true;
    }
    else {
        return festivos.has(dateInput);
    }
}


var quincena = [];

function verQuincena() {
    quincena = [];
    document.getElementById("form-days").innerHTML = "";
    var startDate = document.getElementById("startDate").value;

    var year = parseInt(startDate.slice(0, 4));
    var month = parseInt(startDate.slice(5, 7) -1);
    var day = parseInt(startDate.slice(8, 10));

    if (day <= 15) {
        for (i=0; i<16; i++) {
            var newDate = new Date(year, month, day + i);
            var newDay = newDate.getDate();
    
            if (newDay <= 15) {
                quincena[i] = newDate;
            }
        }
        }
    else {
        for (i=0; i<16; i++) {
        var newDate = new Date(year, month, day + i);
        var newMonth = newDate.getMonth();

        if (newMonth == month) {
            quincena[i] = newDate;
        }
    }
    }

    document.getElementById("explanation").hidden = false;

    document.getElementById("title-container").innerHTML = "<h3>Día</h3>"+ 
                                                        "<h3>Hora comienzo</h3>"+
                                                        "<h3>Horas trabajadas</h3>"


    for (i=0; i < quincena.length; i++) {
        var finalYear = quincena[i].getFullYear();
        var finalMonth = quincena[i].getMonth() + 1;
        if (finalMonth < 10) {
            finalMonth = "0" + finalMonth;
        }
        var finalDay = quincena[i].getDate();
        if (finalDay < 10) {
            finalDay = "0" + finalDay;
        }
        var finalDate = finalYear + "-" + finalMonth + "-" + finalDay;
        var dateId = "date" + i;
        var startHourId = "startHour" + i;
        var numHoursId = "numHours" + i;
        document.getElementById("form-days").innerHTML += 
        "<label hidden><strong>Día</strong></label><input class='form-input-date' type='date' value="+finalDate+" id="+dateId + " readonly>" + 
        "<label hidden><strong>Hora comienzo</strong></label><input class='form-input-startHour' type='number' value=6 min='0' max='23' id="+startHourId+">"+
        "<label hidden><strong>Horas trabajadas</strong></label><input class='form-input-numHours' type='number' value=8 min='0' max='12' step='1' id="+numHoursId+">";
    }

    
    document.getElementById("calculate-button").hidden = false;

}

// crea un objeto con la lista de las houras, empezando con 0
function listHours(startHourDate, numHours) {
    var listHours = {}
    var year = startHourDate.getFullYear();
    var month = startHourDate.getMonth();
    var day = startHourDate.getDate();
    var hour = startHourDate.getHours();

    for (let i=0; i<numHours; i++) {
        var hours = new Date(year, month, day, hour+i);

        listHours[i] = hours;
    }

    return listHours;
}


// Clasifica las horas de acuerdo con el el comienzo de la hora
function classifyHour(hourDatelist) {
    var listTipoHora = {}
    for (const [key, value] of Object.entries(hourDatelist)) {
        var hour = value.getHours();
        var domingo = esDomingo(value);
        var horaNoche = horasNoche.includes(hour);
        
        if (key < 8) {
            if (horaNoche == false && domingo == false) {
                var horaTipo = 'ordinaria';
            }
            if (horaNoche == true && domingo == false) {
                var horaTipo = 'recargo_nocturno';
            }
            if (horaNoche == false && domingo == true) {
                var horaTipo = 'dominical_diurna';
            }
            if (horaNoche == true && domingo == true) {
                var horaTipo = 'dominical_nocturna';
            }
        }
        else {
            if (horaNoche == false && domingo == false) {
                var horaTipo = 'extra_diurna';
            }
            if (horaNoche == true && domingo == false) {
                var horaTipo = 'extra_nocturna';
            }
            if (horaNoche == false && domingo == true) {
                var horaTipo = 'extra_dominical_diurna';
            }
            if (horaNoche == true && domingo == true) {
                var horaTipo = 'extra_dominical_nocturna';
            }
        }
        listTipoHora[key] = horaTipo;
    }
    return listTipoHora;
}


function calcularSalario() {
    var sumTotalTipoHora = {'ordinaria':0, 
    'extra_diurna':0, 
    'recargo_nocturno':0, 
    'extra_nocturna':0, 
    'dominical_diurna':0, 
    'extra_dominical_diurna':0, 
    'dominical_nocturna':0, 
    'extra_dominical_nocturna':0
};

    var salaryMonth = parseFloat(document.getElementById("salaryMonth").value);

    valorHoras = 0;

    for (let i=0; i<quincena.length; i++) {
        var startHourId = "startHour" + i;
        var dateId = "date" + i;
        var numHoursId = "numHours" + i;

        var startDate = document.getElementById(dateId).value;
        var startHour = parseInt(document.getElementById(startHourId).value);
        var numHours = parseInt(document.getElementById(numHoursId).value);

        var year = startDate.slice(0, 4);
        var month = startDate.slice(5, 7)-1;
        var day = startDate.slice(8, 10);

        var start = new Date(year, month, day, startHour);

        var hourDateList = listHours(start, numHours);
        var classifiedHour = classifyHour(hourDateList);

        for (const [key, value] of Object.entries(classifiedHour)) {
            sumTotalTipoHora[value] += 1;
        }

    }

    horasOrdinarias = sumTotalTipoHora['ordinaria'];

    for (const [key, value] of Object.entries(sumTotalTipoHora)) {
        if (key != 'ordinaria') {
            sumCostHoursTotal[key] = sumTotalTipoHora[key] * costHours[key];
        }
    }

    for (const [key, value] of Object.entries(sumCostHoursTotal)) {
        valorHoras += sumCostHoursTotal[key];
        }

    var auxilioTransporteMonth = 106454;
    // var auxilioTransporteQuincena = auxilioTransporteMonth / 2;
    var auxilioTransporteDia = auxilioTransporteMonth / 30;
    // var auxilioTransporteHora = auxilioTransporteMonth / 240;

    var salaryQuincena = salaryMonth / 2;
    var salaryDay = salaryMonth / 30;
    var salaryHour = salaryMonth / 240;

    // var salud = salaryQuincena * 0.04;
    // var pension = salaryQuincena * 0.04;
    // var saludPension = salud + pension;

    var pagoHoras = salaryHour * valorHoras;
    var pagoDias = salaryDay * quincena.length;
    // var pagoDiasTransporte = auxilioTransporteDia * quincena.length;

    salarioTotal = (pagoHoras + pagoDias) * 0.92 + auxilioTransporteDia * quincena.length;

    var message = "Su salario será de aproximadamente " + salarioTotal.toFixed(0);

     if (isNaN(salarioTotal) == true) {
        document.getElementById("result").innerHTML = "Su salario será de aproximadamente " + "<strong>0</strong>.";
     }
     else {
        document.getElementById("result").innerHTML = "Su salario será de aproximadamente <strong>" + salarioTotal.toFixed(0) + "</strong>.";
        alert(message);
     }

}
