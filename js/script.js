const apikey = "e4c07551";

class MovieService {
	Url;
	constructor(url) {
		this.Url = url;
	}

	async getMovie(movieId) {
		let result;
		let currentUrl = `${this.Url}?apikey=${apikey}&i=${movieId}`;

		$.ajax({
			method: "GET",
			url: currentUrl,
			dataType: "json",
			async: false,
			success: function (res) {
				result = res;
			},
		});
		return result;
	}

	async search(title, type, page = 1) {
		let result;
		let currentUrl =
			type.toLowerCase() == "any"
				? `${this.Url}?apikey=e4c07551&s=${title}&page=${page}`
				: `${
						this.Url
				  }?apikey=e4c07551&s=${title}&page=${page}&type=${type.toLowerCase()}`;

		console.log(currentUrl);
		$.ajax({
			method: "GET",
			url: currentUrl,
			dataType: "json",
			async: false,
			success: function (res) {
				result = res;
			},
		});
		return result;
	}
}

let service = new MovieService("https://www.omdbapi.com/");
let currPage = -1;
let totalPages = -1;
let currentTitle;
let currentType;

$(document).ready(function () {
	$("#book-loader").hide();
	$("#films-text").hide();
	$("#more-button").hide();
	$("#more-button").attr("disabled", "");
	$("#details").hide();
	$("#details-loader").hide();

	$("#search-button").click(searchMedia);
	$("#more-button").click(loadMoreMedia);
});

async function searchMedia() {
	$("#films-container").empty();

	let title = $("#media-title").val();
	let type = $("#media-type").val();

	if (title == "") {
		alert("Invalid title");
		return;
	}

	$("#book-loader").show();

	let media = await service.search(title, type);

	currPage = 1;
	totalPages = Math.ceil(media.totalResults / 10);
	currentTitle = title;
	currentType = type;

	if (media.Search != undefined) {
		media.Search.forEach((elem) => {
			let newFilm = $(`<div class="film-container">
					<div class="film-main-content">
						<img src=${elem.Poster}></img>
						<span class="film-name">${elem.Title}</span>
						<span>${elem.Year}</span>
					</div>

				</div>`);

			let input = $(
				`<input type="button"
			 value="details"
			  class="details-input"
			   data-num="${elem.imdbID}"></input>`
			).click(detailsClick);

			newFilm.append(input);

			$("#films-container").append(newFilm);
		});
	} else {
		alert("movies not found");
		$("#book-loader").hide();
		return;
	}
	$("#films-text").show();
	$("#more-button").show();
	$("#book-loader").hide();

	if (totalPages > 1) $("#more-button").removeAttr("disabled");
}

async function detailsClick() {
	let id = $(this).attr("data-num");

	$("#details").empty();
	$("#details").append(
		`<div class="lds-spinner" id="details-loader"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>`
	);
	$("#details").show();

	$("#main-container").css("filter", "brightness(50%)");
	let details = await service.getMovie(id);
	$("#details-loader").remove();

	$("#details").append(`<img src="${details.Poster}"></img>`);

	let infoContainer = $(`<div class="info-container"></div>`);

	let datailContainer1 = $(`<div class="detail-container"></div>`).append(
		`<div class="detail-name">Title:</div><div>${details.Title}</div>`
	);
	let datailContainer2 = $(`<div class="detail-container"></div>`).append(
		`<div class="detail-name">Released:</div><div>${details.Released}</div>`
	);
	let datailContainer3 = $(`<div class="detail-container"></div>`).append(
		`<div class="detail-name">Genre:</div><div >${details.Genre}</div>`
	);
	let datailContainer4 = $(`<div class="detail-container"></div>`).append(
		`<div class="detail-name">Country:</div><div>${details.Country}</div>`
	);
	let datailContainer5 = $(`<div class="detail-container"></div>`).append(
		`<div class="detail-name">Director:</div><div>${details.Director}</div>`
	);
	let datailContainer6 = $(`<div class="detail-container"></div>`).append(
		`<div class="detail-name">Writer:</div><div>${details.Writer}</div>`
	);
	let datailContainer7 = $(`<div class="detail-container"></div>`).append(
		`<div class="detail-name">Actors:</div><div>${details.Actors}</div>`
	);
	let datailContainer8 = $(`<div class="detail-container"></div>`).append(
		`<div class="detail-name">Awards</div><div>${details.Awards}</div>`
	);

	infoContainer
		.append(datailContainer1)
		.append(datailContainer2)
		.append(datailContainer3)
		.append(datailContainer4)
		.append(datailContainer5)
		.append(datailContainer6)
		.append(datailContainer7)
		.append(datailContainer8);

	$("#details").append(infoContainer);

	let btnClose = $(`<span id="close-details">&#10006;</span>`);
	btnClose.click(closeDetails);

	$("#details").append(btnClose);
}

async function loadMoreMedia() {
	$("#book-loader").show();
	let media = await service.search(currentTitle, currentType, currPage + 1);

	media.Search.forEach((elem) => {
		let newFilm = $(`<div class="film-container">
					<div class="film-main-content">
						<img src=${elem.Poster}></img>
						<span class="film-name">${elem.Title}</span>
						<span>${elem.Year}</span>
					</div>

				</div>`);

		let input = $(
			`<input type="button"
			 value="details"
			  class="details-input"
			   data-num="${elem.imdbID}"></input>`
		).click(detailsClick);

		newFilm.append(input);

		$("#films-container").append(newFilm);
	});

	$("#book-loader").hide();
	currPage += 1;
	if (currPage == totalPages) $("#more-button").attr("disabled", "");
}

function closeDetails() {
	$("#details").hide();
	$("#main-container").css("filter", "none");
}
