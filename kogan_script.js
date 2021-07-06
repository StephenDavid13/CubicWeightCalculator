var jsonData; //need JSON data to be global

$(document).ready(async function(){
    jsonData = await paginated_fetch(); //get items
    
    uniqueCatShow(); //get unique categories
    findItems(); //get all items including cubic weight
});

//main function to get items and cubic weight
function findItems() {
    var cubicMetre = 0;
    var cubicWeight = 0;
    var currCat = document.getElementById("categories").value;

    $("#actual_content").html("");

    $.each(jsonData, function(index, value){
        if(value.category == currCat) {
            cubicMetre = ((value.size.width / 100) * (value.size.length / 100) * (value.size.height / 100)).toFixed(6); //calculate cubic metre
            cubicWeight = (cubicMetre * 250).toFixed(4); //calculate cubic weight

            //output data
            $("#actual_content").append('<h3>'+ value.title + ':</h3><ul><li>Dimensions: ' + 
                value.size.width + ' cm * ' +
                value.size.length + ' cm * ' +
                value.size.height + ' cm</li><li class="cubic_metre">Cubic Metre: ' +
                cubicMetre + 'm<sup>3</sup></li><li class="cubic_weight">Cubic Weight: ' + 
                cubicWeight + ' kg(s)</li></ul><hr>'); 
        }
    });
}

//function to get all objects in the paginated API
function paginated_fetch(
    url = 'http://wp8m3he1wt.s3-website-ap-southeast-2.amazonaws.com',
    page = '/api/products/1',
    previousResponse = []
) {
    return fetch(url+page)
    .then(response => response.json())
    .then(newResponse => {
        const response = [...previousResponse, ...newResponse.objects];

        
        if(newResponse.next !== null) {
            page = newResponse.next;

            return paginated_fetch(url, page, response);
        }
        
    return response;

    });
}

//function to get unique categories for dropdown
function uniqueCatShow() {
    var uniqueCategories = [];

    $.each(jsonData, function(index, value) {
        uniqueCategories.push(value.category);
    });

    uniqueCategories = uniqueCategories.filter(onlyUnique);

    $.each(uniqueCategories, function(index, value) {
        if(value == 'Air Conditioners') {
            $("#categories").append('<option selected="selected" value="' +
            value + '">' + value + '</option>');
        }
        else {
            $("#categories").append('<option value="' + value + '">' + 
            value + '</option>');
        }
        
    });

}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}
