
function tempChart(myThm, target, name, initValue){
  FusionCharts.ready(function() {
  var updateAnnotation,
    chart = new FusionCharts({
      type: 'thermometer',
      renderAt: target,
      id: myThm,
      width: '240',	//240
      height: '310',	//310
      dataFormat: 'json',
      dataSource: {
        "chart": {
          "theme": "fusion",
          "caption": name,
          "subcaption": " House",
          "lowerLimit": "-30",
          "upperLimit": "45",

          "decimals": "1",
          "numberSuffix": "°C",
          "showhovereffect": "1",
          "thmFillColor": "#008ee4",
          "showGaugeBorder": "1",
          "gaugeBorderColor": "#008ee4",
          "gaugeBorderThickness": "2",
          "gaugeBorderAlpha": "30",
          "thmOriginX": "100",
          "chartBottomMargin": "20",	
          "valueFontColor": "#000000",
          "theme": "fusion"
        },
        "value": initValue,	// initial value
        //All annotations are grouped under this element
        "annotations": {
          "showbelow": "0",
          "groups": [{
            //Each group needs a unique ID
            "id": "indicator",
            "items": [
              //Showing Annotation
              {
                "id": "background",
                //Rectangle item 
                "type": "rectangle",
                "alpha": "50",
                "fillColor": "#AABBCC",
                "x": "$gaugeEndX-40",
                "tox": "$gaugeEndX",
                "y": "$gaugeEndY+54",
                "toy": "$gaugeEndY+65"
              }
            ]
          }]

        },
      },
      "events": {
        "initialized": function(evt, arg) {
          var dataUpdate = setInterval(function() {
            var value;
            if(document.getElementById("chart-outside").getAttribute("idChart")==myThm)
              value = outSideValue;
            else value = inSideValue;      		    
            FusionCharts.items[myThm].feedData("&value=" + value);
          }, 1000);
          updateAnnotation = function(evtObj, argObj) {
            var code,
              chartObj = evtObj.sender,
              val = chartObj.getData(),
              annotations = chartObj.annotations;

            if (val >= -4.5) {
              code = "#00FF00";
            } else if (val < -4.5 && val > -6) {
              code = "#ff9900";
            } else {
              code = "#ff0000";
            }
            annotations.update("background", {
              "fillColor": code
            });
          };
        },
        "renderComplete": function(evt, arg) {
          updateAnnotation(evt, arg);
        },
        "realtimeUpdateComplete": function(evt, arg) {
          updateAnnotation(evt, arg);
        }
      }
    })
    .render();
});
}

tempChart("chartO", "chart-outside", "Outside temperature", outSideValue); 
tempChart("chartI", "chart-inside", "Inside temperature", inSideValue);



