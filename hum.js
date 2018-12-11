FusionCharts.ready(function() { 
            var  csatGauge =   new  FusionCharts({
                "type" :  "angulargauge",
                "renderAt" :  "chart-hum",
                "width" :  "400",
                "height" :  "250",
                "dataFormat" :  "json",
                "dataSource" :  {
                    "chart" :  {
                        "caption" :  "Environment Humidity view",
                        "subcaption" :  "Value in %",
                        "lowerLimit" :  "0",
                        "upperLimit" :  "100",
			"gaugeFillMix" : "{dark-30},{light-60},{dark-10}",
			"gaugeFillRatio" : "15",
			"pivotRadius": "10",
			"showValue" : "1",
			"valueBelowPivot" : "1",
			"editMode" : "1",
			//"majorTMNumber" : "9",
			//"minorTMNumber" : "4",
                        "theme" :  "fint"
                    },
                    "colorRange" :  {
                        "color" :  [{
                                "minValue" :  "0",
                                "maxValue" :  "10",
                                "code" :  "#e44a00"
                            },
                            {
                                "minValue" :  "10",
                                "maxValue" :  "25",
                                "code" :  "#f8bd19"
                            },
                            {
                                "minValue" :  "25",
                                "maxValue" :  "75",
                                "code" :  "#6baa01"
                            },
                            {
                                "minValue" :  "75",
                                "maxValue" :  "90",
                                "code" :  "#f8bd19"
                            },
                            {
                                "minValue" :  "90",
                                "maxValue" :  "100",
                                "code" :  "#e44a00"
                            }
                        ]
                    },
                    "dials" :  {
                        "dial" :  [{	
                            "id" : "affiche1",
                            "value" :  insideHumValue,
                            "showValue" : "1",
                            "tooltext": "current year's average : $value",
                            "rearExtension" : "5"
                        }]
                    }
                },
                
                events: {
        'beforeRender': function(evt, args) {
            var score = document.createElement('div');
            score.setAttribute('id', 'score-detail');
            score.innerHTML = '';
            score.style.cssText = "font-family:'Helvetica Neue', Arial; font-size: 14px; padding:10px 0 10px 20px;";
            args.container.parentNode.insertBefore(score, args.container.nextSibling);
        },
        "rendered": function(evtObj, argObj) {
            evtObj.sender.intervalVar = setInterval(function() {
                var chartIns = evtObj.sender;                    
                chartIns.feedData("value=" + insideHumValue);
            }, 1000);
        },
        "realtimeUpdateComplete": function(evtObj, argObj) {
            var updtObj = argObj && argObj.updateObject,
                values = updtObj && updtObj.values,
                updtValStr = values && values[0],
                updtVal = updtValStr &&
                parseFloat(updtValStr).toFixed(0),
                divToUpdate = document.getElementById("score-detail");

            divToUpdate.innerHTML = "Current value send fron server is : <b>" + updtVal + "%</b>";

        },
        "disposed": function(evtObj, argObj) {
            clearInterval(evtObj.sender.intervalVar);
        }
    }                                                                                                                                                                               
            });
            csatGauge.render();	
        });	
