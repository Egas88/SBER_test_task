/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 98.00415136516047, "KoPercent": 1.9958486348395337};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.612975183567246, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.44419889502762433, 500, 1500, "Вход"], "isController": true}, {"data": [0.4429678848283499, 500, 1500, "Вход на главную"], "isController": false}, {"data": [0.9862068965517241, 500, 1500, "Полуить информацию с корзины"], "isController": false}, {"data": [0.631236442516269, 500, 1500, "Переход на второй товар"], "isController": false}, {"data": [0.5, 500, 1500, "Переход на товар-1"], "isController": false}, {"data": [0.42332613390928725, 500, 1500, "Ввод поискового запроса"], "isController": true}, {"data": [0.36984815618221256, 500, 1500, "Выбор второго товара из списка"], "isController": true}, {"data": [1.0, 500, 1500, "Переход на товар-0"], "isController": false}, {"data": [0.49084668192219677, 500, 1500, "Переход на вкладку"], "isController": false}, {"data": [0.732183908045977, 500, 1500, "Убрать из корзины"], "isController": true}, {"data": [0.49084668192219677, 500, 1500, "Переход на вкладку категории"], "isController": true}, {"data": [0.6938073394495413, 500, 1500, "Переход на товар"], "isController": false}, {"data": [0.9839080459770115, 500, 1500, "Удалить товар из корзины"], "isController": false}, {"data": [0.0, 500, 1500, "Use Case № 2"], "isController": true}, {"data": [0.42818574514038876, 500, 1500, "Результаты поиска"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "Получить информацию с корзины"], "isController": false}, {"data": [1.0, 500, 1500, "Debug Sampler"], "isController": false}, {"data": [0.49885057471264366, 500, 1500, "Добавить в корзину"], "isController": true}, {"data": [0.6447084233261339, 500, 1500, "Выбор первого товара из списка"], "isController": true}, {"data": [0.6447084233261339, 500, 1500, "Переход на первый товар"], "isController": false}, {"data": [0.9160919540229885, 500, 1500, "Добавить товар в коризну"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 6263, 125, 1.9958486348395337, 887.7673638831261, 0, 21063, 518.0, 902.0, 1110.0, 21040.36, 6.8130294973827, 1239.79311124619, 3.292759794681747], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Вход", 905, 102, 11.2707182320442, 3094.2508287292812, 0, 21063, 800.0, 21028.0, 21043.0, 21054.0, 0.9844928773844036, 286.042036503065, 0.36659484106695095], "isController": true}, {"data": ["Вход на главную", 903, 102, 11.295681063122924, 3101.104097452934, 640, 21063, 800.0, 21028.0, 21043.0, 21054.0, 0.9823033108951906, 286.0379913862171, 0.36658965679758243], "isController": false}, {"data": ["Полуить информацию с корзины", 435, 0, 0.0, 256.5747126436781, 156, 796, 226.0, 371.0, 449.39999999999986, 614.1999999999992, 0.4875539251453415, 0.6380100192331618, 0.3670938244990804], "isController": false}, {"data": ["Переход на второй товар", 461, 0, 0.0, 566.4685466377445, 423, 1086, 545.0, 702.8, 749.0, 898.14, 0.5157643773515667, 155.18026069001388, 0.23252903237400413], "isController": false}, {"data": ["Переход на товар-1", 1, 0, 0.0, 950.0, 950, 950, 950.0, 950.0, 950.0, 950.0, 1.0526315789473684, 321.14823190789474, 0.45641447368421056], "isController": false}, {"data": ["Ввод поискового запроса", 463, 6, 1.2958963282937366, 1144.8790496760248, 1, 21048, 783.0, 1847.6000000000001, 2012.8, 21026.96, 0.5170728983443617, 176.52442341450987, 0.24383498059580647], "isController": true}, {"data": ["Выбор второго товара из списка", 461, 0, 0.0, 1470.7114967462019, 914, 2851, 1315.0, 2332.8, 2509.0, 2693.14, 0.5153417576619358, 332.90499610768853, 0.4789168384006743], "isController": true}, {"data": ["Переход на товар-0", 1, 0, 0.0, 84.0, 84, 84, 84.0, 84.0, 84.0, 84.0, 11.904761904761903, 7.812499999999999, 5.266462053571428], "isController": false}, {"data": ["Переход на вкладку", 437, 7, 1.6018306636155606, 1045.659038901602, 29, 21057, 769.0, 1083.6, 1182.3, 21044.62, 0.48636183539823796, 169.37803397931626, 0.205947969787136], "isController": false}, {"data": ["Убрать из корзины", 435, 0, 0.0, 538.9241379310345, 353, 1404, 510.0, 707.0, 796.1999999999998, 1064.7599999999998, 0.4874009651659572, 1.2803794885707274, 0.8467639814748417], "isController": true}, {"data": ["Переход на вкладку категории", 437, 7, 1.6018306636155606, 1045.659038901602, 29, 21057, 769.0, 1083.6, 1182.3, 21044.62, 0.4863683310777121, 169.3802961334135, 0.20595072035657366], "isController": true}, {"data": ["Переход на товар", 872, 16, 1.834862385321101, 592.1834862385329, 1, 21046, 515.0, 675.0, 732.0, 912.2099999999996, 0.9704167561594199, 280.61786324273885, 0.4330037890211589], "isController": false}, {"data": ["Удалить товар из корзины", 435, 0, 0.0, 282.3494252873561, 174, 692, 256.0, 400.80000000000007, 455.59999999999997, 635.5199999999994, 0.4876512139152115, 0.6428995495952495, 0.4800316636977863], "isController": false}, {"data": ["Use Case № 2", 461, 53, 11.496746203904555, 6267.915401301518, 2718, 64618, 3508.0, 23358.6, 23908.1, 43771.1, 0.5141485655143493, 810.531231536727, 1.1418421209102325], "isController": true}, {"data": ["Результаты поиска", 926, 6, 0.6479481641468683, 1025.2829373650109, 1, 21048, 769.5, 1819.0, 1933.65, 2187.92, 1.031122988697734, 354.10242809072435, 0.4898014708952731], "isController": false}, {"data": ["Получить информацию с корзины", 435, 0, 0.0, 324.3333333333336, 202, 845, 291.0, 458.80000000000007, 538.1999999999999, 743.7599999999999, 0.4876654278843729, 0.8062616836508764, 0.4200399486269696], "isController": false}, {"data": ["Debug Sampler", 895, 0, 0.0, 0.08044692737430165, 0, 1, 0.0, 0.0, 1.0, 1.0, 1.0020219571560043, 0.6127708450655737, 0.0], "isController": false}, {"data": ["Добавить в корзину", 435, 0, 0.0, 737.5931034482759, 486, 1525, 700.0, 936.8000000000001, 1036.8, 1315.679999999999, 0.4874697852779642, 2.277777644509577, 0.7840456409695381], "isController": true}, {"data": ["Выбор первого товара из списка", 463, 2, 0.4319654427645788, 599.7840172786177, 1, 21042, 535.0, 669.8000000000001, 762.1999999999996, 1021.2400000000025, 0.517196504511227, 153.88179085712753, 0.23053987935525813], "isController": true}, {"data": ["Переход на первый товар", 463, 2, 0.4319654427645788, 599.7840172786177, 1, 21042, 535.0, 669.8000000000001, 762.1999999999996, 1021.2400000000025, 0.5171936158424336, 153.8809313897428, 0.23053859173372682], "isController": false}, {"data": ["Добавить товар в коризну", 435, 0, 0.0, 413.25977011494234, 273, 872, 381.0, 548.0, 631.3999999999999, 789.56, 0.4877397913819182, 1.4726546601154429, 0.3643759183663744], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to dostaevsky.ru:443 [dostaevsky.ru/178.248.236.74] failed: Connection timed out: connect", 114, 91.2, 1.820213954973655], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: dostaevsky.ru:443 failed to respond", 5, 4.0, 0.07983394539358135], "isController": false}, {"data": ["404/Not Found", 6, 4.8, 0.09580073447229762], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 6263, 125, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to dostaevsky.ru:443 [dostaevsky.ru/178.248.236.74] failed: Connection timed out: connect", 114, "404/Not Found", 6, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: dostaevsky.ru:443 failed to respond", 5, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["Вход на главную", 903, 102, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to dostaevsky.ru:443 [dostaevsky.ru/178.248.236.74] failed: Connection timed out: connect", 102, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Переход на вкладку", 437, 7, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to dostaevsky.ru:443 [dostaevsky.ru/178.248.236.74] failed: Connection timed out: connect", 5, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: dostaevsky.ru:443 failed to respond", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Переход на товар", 436, 8, "404/Not Found", 6, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to dostaevsky.ru:443 [dostaevsky.ru/178.248.236.74] failed: Connection timed out: connect", 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: dostaevsky.ru:443 failed to respond", 1, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Результаты поиска", 926, 6, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to dostaevsky.ru:443 [dostaevsky.ru/178.248.236.74] failed: Connection timed out: connect", 5, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: dostaevsky.ru:443 failed to respond", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Переход на первый товар", 463, 2, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to dostaevsky.ru:443 [dostaevsky.ru/178.248.236.74] failed: Connection timed out: connect", 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: dostaevsky.ru:443 failed to respond", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
