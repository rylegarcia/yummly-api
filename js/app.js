var app = {};

app.pageNum = 0;

//Get Recipe information
app.getRecipes = function(type) {
	$.ajax({
		url: 'http://api.yummly.com/v1/api/recipes',
		type: 'GET',
		dataType: 'jsonp',
		data: {
			_app_id: '78d06731',
			_app_key: 'dfaa900d1d5f712a8f362fb537c3b1eb',
			requirePictures: true,
			maxResult: 12,
			start: app.pageNum,
			q: type
		},
		success: function(res){
			console.log(res);
			app.displayRecipes(res.matches);
		}
	});
};


//After we get the info, display the condensed recipe
app.displayRecipes = function(recipeData){

	$('#recipe-container').empty();

	$.each(recipeData, function(i, recipe){
		//display the title of the recipe
		var $title = $('<h3>').text(recipe.recipeName);
		//display the image of the recipe
		if (recipe.hasOwnProperty('smallImageUrls')){
			var imgSrc = recipe.smallImageUrls.toString().replace('=s90','');
			var $image = $('<img>').attr('src', imgSrc);
		};
		//put these variables all together
		var $halfRecipe = $('<div>').addClass('recipe-items').append($image, $title).attr('data-ingredients', recipe.ingredients).attr('data-rating', recipe.rating).attr('data-prepTime', recipe.totalTimeInSeconds);
		//This stores a data attribute on each item
		$halfRecipe.data('info', recipe)
		$('#recipe-container').append($halfRecipe);

		$('.wrapper').addClass('random-padding');
		$('.wrapper-user').addClass('random-padding');

		$('.button-container').show();

	});	
};


app.events = function(){

	$('#food-choice').on('change', function(){
		var foodRecipe = $(this).val();
		app.pageNum = 0;
		app.getRecipes(foodRecipe);
	});


	$('.search').on('submit', function(e){
		e.preventDefault();
		//Get the entered user input
		var searchQuery = $(this).find('input[type=search]').val();
		console.log(searchQuery);
		//Pass that value to the app.getRecipes() method
		app.getRecipes(searchQuery);
		//clear search value after submitting
		$(this).find('input[type=search]').val();
	});

	$('.buttonPrev').on('click', function(){
			app.pageNum -= 12;
			var foodRecipe = $('#food-choice').val();
			app.getRecipes(foodRecipe);
	});

	$('.buttonNext').on('click', function(){
			app.pageNum += 12;
			var foodRecipe = $('#food-choice').val();
			app.getRecipes(foodRecipe);
	});

	$('#recipe-container').on('click', '.recipe-items' , function() {
		var $ingredientsTitle = $('<h4>').append('Ingredients: ');
		var $ingredients = $('<p>').append(($(this).data('ingredients')));
		var $randomLine = $('<div>').css({
																	 'width': '100px',
																	 'height': '1px',
																	 'background': '#F2F2F2',
																	 'position': 'absolute',
																	 'bottom': '11%',
																	 'left': '50%',
																	 'margin-left': '-50px'
																});
		var $rating = $('<p>').text('Rating: ').addClass('rating').append(($(this).data('rating'))).append(' / 5');
		var $fullRecipe = $(this).clone().appendTo($('#selection-container')).append($ingredientsTitle, $ingredients, $randomLine, $rating).addClass('recipe-items-selected');
		$('.recipe-items-selected').on('click', function(){
			$(this).remove();
		});
	});	

	$('a').smoothScroll();

};


app.init = function() {
	app.events();
};

$(function(){
	app.init();
	$('#rice').on('change', function(){
	       $(this).smoothScroll();
	   });
});