var searchBtn = document.getElementById("searchCityBtn");
var searchText = document.getElementById("searchText");
var cityBtnsContainer = document.getElementById("cityBtns");

$('.btn-secondary').each(function() {
    $(this).on('click',function() {
        var clickedCity = $(this).attr('id');
        console.log(clickedCity);
        searchText.value = clickedCity;
        searchCity();
    });
})

searchBtn.addEventListener('click', searchCity)

function searchCity(event) {
    event.preventDefault();
    console.log(clickedCity);
}
