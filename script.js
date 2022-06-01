const API_key = '953460e2beb6d2bff2afdbf51728860c';



let city="";
// variable declaration
var searchCity = $("#search-city");
var searchButton = $("#search-button");
var clearButton = $("#clear-history");
var currentCity = $("#current-city");
var currentTemperature = $("#temperature");
var currentHumidty= $("#humidity");
var currentWSpeed=$("#wind-speed");
var currentUvindex= $("#uv-index");
var sCity=[];
// searches the city to see if it exists in the entries from the storage
function find(c){
    for (var i=0; i<sCity.length; i++){
        if(c.toUpperCase()===sCity[i]){
            return -1;
        }
    }
    return 1;
}
//Set up the API key
var APIKey="a0aca8a89948154a4182dcecc780b513";
// Display the curent and future weather to the user after grabing the city form the input text box.
function displayWeather(event){
    event.preventDefault();
    if(searchCity.val().trim()!==""){
        city=searchCity.val().trim();
        currentWeather(city);
    }
}
// Here we create the AJAX call
function currentWeather(city){
    // Here we build the URL so we can get a data from server side.
    var queryURL= "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=" + APIKey;
    $.ajax({
        url:queryURL,
        method:"GET",
    }).then(function(response){

        // parse the response to display the current weather including the City name. the Date and the weather icon. 
        console.log(response);
        //Dta object from server side Api for icon property.
        var weathericon= response.weather[0].icon;
        var iconurl="https://openweathermap.org/img/wn/"+weathericon +"@2x.png";
        // The date format method is taken from the  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
        var date=new Date(response.dt*1000).toLocaleDateString();
        //parse the response for name of city and concanatig the date and icon.
        $(currentCity).html(response.name +"("+date+")" + "<img src="+iconurl+">");
        // parse the response to display the current temperature.
        // Convert the temp to fahrenheit

        var tempF = (response.main.temp - 273.15) * 1.80 + 32;
        $(currentTemperature).html((tempF).toFixed(2)+"&#8457");
        // Display the Humidity
        $(currentHumidty).html(response.main.humidity+"%");
        //Display Wind speed and convert to MPH
        var ws=response.wind.speed;
        var windsmph=(ws*2.237).toFixed(1);
        $(currentWSpeed).html(windsmph+"MPH");
        // Display UVIndex.
        //By Geographic coordinates method and using appid and coordinates as a parameter we are going build our uv query url inside the function below.
        UVIndex(response.coord.lat,response.coord.long);
        forecast(response.id);
        if(response.cod==200){
            sCity=JSON.parse(localStorage.getItem("cityname"));
            console.log(sCity);
            if (sCity==null){
                sCity=[];
                sCity.push(city.toUpperCase()
                );
                localStorage.setItem("cityname",JSON.stringify(sCity));
            }
            else {
                if(find(city)>0){
                    sCity.push(city.toUpperCase());
                    localStorage.setItem("cityname",JSON.stringify(sCity));
                }
            }
        }

    });
}
    // This function returns the UVIindex response.
function UVIndex(lat,long){
    //lets build the url for uvindex.
    var uvqURL="https://api.openweathermap.org/data/2.5/uvi?appid="+ APIKey+"&lat="+lat+"&lon="+long;
    $.ajax({
            url:uvqURL,
            method:"GET"
            }).then(function(response){
                $(currentUvindex).html(response.value);
            });
}
    
// Here we display the 5 days forecast for the current city.
function forecast(cityid){
    let queryforcastURL="https://api.openweathermap.org/data/2.5/forecast?id="+cityid+"&units=imperial&appid="+API_key;
    $.ajax({
        url:queryforcastURL,
        method:"GET"
    }).then(function(response){
// because each day have 3 hour range , so I need to do the math to pick the same time every day
        for (i=0;i<5;i++){
            let date= response.list[((i+1)*8)-3].dt_txt;
            let iconcode= response.list[((i+1)*8)-3].weather[0].icon;
            let iconurl="https://openweathermap.org/img/wn/"+iconcode+".png";
            let temp= response.list[((i+1)*8)-3].main.temp;
            let humidity= response.list[((i+1)*8)-3].main.humidity;
            let wind= (response.list[((i+1)*8)-3].wind.speed*2.237).toFixed(1);

            $("#fDate"+i).html(date);
            $("#fImg"+i).html("<img src="+iconurl+">");
            $("#fTemp"+i).html(temp+" F");
            $("#fWind"+i).html(wind+" MPH");
            $("#fHumidity"+i).html(humidity+"%");
        }
        
    });
}


// render function
function loadlastCity(){
    $("ul").empty();
    var sCity = JSON.parse(localStorage.getItem("cityname"));
    if(sCity!==null){
        sCity=JSON.parse(localStorage.getItem("cityname"));
        for(i=0; i<sCity.length;i++){
            addToList(sCity[i]);
        }
        city=sCity[i-1];
        currentWeather(city);
    }

}
//Clear the search history from the page
function clearHistory(event){
    event.preventDefault();
    sCity=[];
    localStorage.removeItem("cityname");
    document.location.reload();

}
//Click Handlers
$("#search-button").on("click",displayWeather);
$(window).on("load",loadlastCity);
$("#clear-history").on("click",clearHistory);


// NY weather botton
$("#NY").click(function(){
    var queryURL= "https://api.openweathermap.org/data/2.5/weather?q=New York&units=imperial&APPID="+API_key;
    $.ajax({
        url:queryURL,
        method:"GET",
    }).then(function(response){

        // parse the response to display the current weather including the City name. the Date and the weather icon. 
        console.log(response);
        //Dta object from server side Api for icon property.
        let weathericon= response.weather[0].icon;
        let iconurl="https://openweathermap.org/img/wn/"+weathericon +"@2x.png";
        // The date format method is taken from the  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
        let date=new Date(response.dt*1000).toLocaleDateString();
        //parse the response for name of city and concanatig the date and icon.
        $(currentCity).html(response.name +"("+date+")" + "<img src="+iconurl+">");

        let tempF = response.main.temp;
        $(currentTemperature).html((tempF).toFixed(2)+"&#8457");
        // Display the Humidity
        $(currentHumidty).html(response.main.humidity+"%");
        //Display Wind speed and convert to MPH
        let ws=response.wind.speed;
        let windsmph=(ws*2.237).toFixed(1);
        $(currentWSpeed).html(windsmph+" MPH");
        // Display UVIndex.
        //By Geographic coordinates method and using appid and coordinates as a parameter we are going build our uv query url inside the function below.
        UVIndex(response.coord.lat,response.coord.lon);
        forecast(response.id);

    });
    });

// SF weather botton
    $("#SF").click(function(){
        var queryURL= "https://api.openweathermap.org/data/2.5/weather?q=San Francisco&units=imperial&APPID=" + API_key;
        $.ajax({
            url:queryURL,
            method:"GET",
        }).then(function(response){
    
            console.log(response);
            let weathericon= response.weather[0].icon;
            let iconurl="https://openweathermap.org/img/wn/"+weathericon +"@2x.png";
            // The date format method is taken from the  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
            let date=new Date(response.dt*1000).toLocaleDateString();
            //parse the response for name of city and concanatig the date and icon.
            $(currentCity).html(response.name +"("+date+")" + "<img src="+iconurl+">");
    
            let tempF = response.main.temp;
            $(currentTemperature).html((tempF).toFixed(2)+"&#8457");
            // Display the Humidity
            $(currentHumidty).html(response.main.humidity+"%");
            //Display Wind speed and convert to MPH
            let ws=response.wind.speed;
            let windsmph=(ws*2.237).toFixed(1);
            $(currentWSpeed).html(windsmph+" MPH");
            // Display UVIndex.
            //By Geographic coordinates method and using appid and coordinates as a parameter we are going build our uv query url inside the function below.
            UVIndex(response.coord.lat,response.coord.lon);
            forecast(response.id);
    
        });
        });


    // Bos weather botton
    $("#Bos").click(function(){
        var queryURL= "https://api.openweathermap.org/data/2.5/weather?q=Boston&units=imperial&APPID=" + API_key;
        $.ajax({
            url:queryURL,
            method:"GET",
        }).then(function(response){
    
            console.log(response);
            let weathericon= response.weather[0].icon;
            let iconurl="https://openweathermap.org/img/wn/"+weathericon +"@2x.png";
            // The date format method is taken from the  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
            let date=new Date(response.dt*1000).toLocaleDateString();
            //parse the response for name of city and concanatig the date and icon.
            $(currentCity).html(response.name +"("+date+")" + "<img src="+iconurl+">");
    
            let tempF = response.main.temp;
            $(currentTemperature).html((tempF).toFixed(2)+"&#8457");
            // Display the Humidity
            $(currentHumidty).html(response.main.humidity+"%");
            //Display Wind speed and convert to MPH
            let ws=response.wind.speed;
            let windsmph=(ws*2.237).toFixed(1);
            $(currentWSpeed).html(windsmph+" MPH");
            // Display UVIndex.
            //By Geographic coordinates method and using appid and coordinates as a parameter we are going build our uv query url inside the function below.
            UVIndex(response.coord.lat,response.coord.lon);
            forecast(response.id);
    
        });
        });


// LA weather botton
$("#LA").click(function(){
    var queryURL= "https://api.openweathermap.org/data/2.5/weather?q=Los Angeles&units=imperial&APPID=" + API_key;
    $.ajax({
        url:queryURL,
        method:"GET",
    }).then(function(response){

        console.log(response);
        let weathericon= response.weather[0].icon;
        let iconurl="https://openweathermap.org/img/wn/"+weathericon +"@2x.png";
        // The date format method is taken from the  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
        let date=new Date(response.dt*1000).toLocaleDateString();
        //parse the response for name of city and concanatig the date and icon.
        $(currentCity).html(response.name +"("+date+")" + "<img src="+iconurl+">");

        let tempF = response.main.temp;
        $(currentTemperature).html((tempF).toFixed(2)+"&#8457");
        // Display the Humidity
        $(currentHumidty).html(response.main.humidity+"%");
        //Display Wind speed and convert to MPH
        let ws=response.wind.speed;
        let windsmph=(ws*2.237).toFixed(1);
        $(currentWSpeed).html(windsmph+" MPH");
        // Display UVIndex.
        //By Geographic coordinates method and using appid and coordinates as a parameter we are going build our uv query url inside the function below.
        UVIndex(response.coord.lat,response.coord.lon);
        forecast(response.id);

    });
    });

    // Chicago weather botton
$("#Chi").click(function(){
    var queryURL= "https://api.openweathermap.org/data/2.5/weather?q=Chicago&units=imperial&APPID=" + API_key;
    $.ajax({
        url:queryURL,
        method:"GET",
    }).then(function(response){

        console.log(response);
        let weathericon= response.weather[0].icon;
        let iconurl="https://openweathermap.org/img/wn/"+weathericon +"@2x.png";
        // The date format method is taken from the  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
        let date=new Date(response.dt*1000).toLocaleDateString();
        //parse the response for name of city and concanatig the date and icon.
        $(currentCity).html(response.name +"("+date+")" + "<img src="+iconurl+">");

        let tempF = response.main.temp;
        $(currentTemperature).html((tempF).toFixed(2)+"&#8457");
        // Display the Humidity
        $(currentHumidty).html(response.main.humidity+"%");
        //Display Wind speed and convert to MPH
        let ws=response.wind.speed;
        let windsmph=(ws*2.237).toFixed(1);
        $(currentWSpeed).html(windsmph+" MPH");
        // Display UVIndex.
        //By Geographic coordinates method and using appid and coordinates as a parameter we are going build our uv query url inside the function below.
        UVIndex(response.coord.lat,response.coord.lon);
        forecast(response.id);

    });
    });


// Dallas weather botton
$("#DA").click(function(){
    var queryURL= "https://api.openweathermap.org/data/2.5/weather?q=Dallas&units=imperial&APPID=" + API_key;
    $.ajax({
        url:queryURL,
        method:"GET",
    }).then(function(response){

        console.log(response);
        let weathericon= response.weather[0].icon;
        let iconurl="https://openweathermap.org/img/wn/"+weathericon +"@2x.png";
        // The date format method is taken from the  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
        let date=new Date(response.dt*1000).toLocaleDateString();
        //parse the response for name of city and concanatig the date and icon.
        $(currentCity).html(response.name +"("+date+")" + "<img src="+iconurl+">");

        let tempF = response.main.temp;
        $(currentTemperature).html((tempF).toFixed(2)+"&#8457");
        // Display the Humidity
        $(currentHumidty).html(response.main.humidity+"%");
        //Display Wind speed and convert to MPH
        let ws=response.wind.speed;
        let windsmph=(ws*2.237).toFixed(1);
        $(currentWSpeed).html(windsmph+" MPH");
        // Display UVIndex.
        //By Geographic coordinates method and using appid and coordinates as a parameter we are going build our uv query url inside the function below.
        UVIndex(response.coord.lat,response.coord.lon);
        forecast(response.id);

    });
    });

 // Orlando weather botton
$("#ORL").click(function(){
    var queryURL= "https://api.openweathermap.org/data/2.5/weather?q=Orlando&units=imperial&APPID=" + API_key;
    $.ajax({
        url:queryURL,
        method:"GET",
    }).then(function(response){

        console.log(response);
        let weathericon= response.weather[0].icon;
        let iconurl="https://openweathermap.org/img/wn/"+weathericon +"@2x.png";
        // The date format method is taken from the  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
        let date=new Date(response.dt*1000).toLocaleDateString();
        //parse the response for name of city and concanatig the date and icon.
        $(currentCity).html(response.name +"("+date+")" + "<img src="+iconurl+">");

        let tempF = response.main.temp;
        $(currentTemperature).html((tempF).toFixed(2)+"&#8457");
        // Display the Humidity
        $(currentHumidty).html(response.main.humidity+"%");
        //Display Wind speed and convert to MPH
        let ws=response.wind.speed;
        let windsmph=(ws*2.237).toFixed(1);
        $(currentWSpeed).html(windsmph+" MPH");
        // Display UVIndex.
        //By Geographic coordinates method and using appid and coordinates as a parameter we are going build our uv query url inside the function below.
        UVIndex(response.coord.lat,response.coord.lon);
        forecast(response.id);

    });
    });

