console.log("scripts.js loaded");

document.addEventListener('DOMContentLoaded', () => {
	checkAuthentication();

	const loginForm = document.getElementById('login-form');
	if (loginForm) {
		loginForm.addEventListener('submit', async (event) => {
			event.preventDefault();

			const email = document.getElementById('email').value;
			const password = document.getElementById('password').value;

			console.log("Tentative de login");

			try {
				const response = await fetch('http://localhost:5000/api/v1/auth/login', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ email, password })
				});

				if (response.ok) {
					const data = await response.json();
					console.log("Nouveau token reçu :", data.access_token);

					document.cookie = `token=${data.access_token}; path=/;`;
					window.location.href = 'index.html';
				} else {
					const errorData = await response.json();
					alert('Login failed: ' + (errorData.error || response.statusText));
				}
			} catch (err) {
				alert('Login failed: ' + err.message);
			}
		});
	}

	if (window.location.pathname.endsWith('place.html')) {
		const placeId = getPlaceIdFromURL();
		const token = getCookie('token');

		if (!placeId) return;

		const addReviewSection = document.getElementById('add-review');
		if (addReviewSection) {
			addReviewSection.style.display = token ? 'block' : 'none';
		}

		fetchPlaceDetails(placeId, token);
	}

	if (window.location.pathname.endsWith('add_review.html')) {
		console.log("🔐 Vérification de l'authentification...");
		const token = checkAuthenticationRedirect();
		const placeId = getPlaceIdFromURL();
		console.log("Place ID found :", placeId);

		const form = document.getElementById('review-form');

		if (form && placeId) {
			form.addEventListener('submit', async (e) => {
				e.preventDefault();

				const comment = document.getElementById('comment').value;
				const rating = parseInt(document.getElementById('rating').value);

				console.log("Formulaire soumis avec les données :", { comment, rating });

				try {
					const response = await fetch('http://localhost:5000/api/v1/reviews/', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							Authorization: `Bearer ${token}`
						},
						body: JSON.stringify({
							text: comment,
							rating: rating,
							place_id: placeId
						})
					});

					if (response.ok) {
						console.log("✅ Avis ajouté avec succès !");
						alert('✅ Avis ajouté avec succès !');
						form.reset();
						window.location.href = `place.html?id=${placeId}`;
					} else {
						const err = await response.json();
						alert('Erreur : ' + (err.error || 'Une erreur est survenue.'));
					}
				} catch (error) {
					alert('Erreur réseau : ' + error.message);
				}
			});
		}
	}
});

function getCookie(name) {
	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);
	if (parts.length === 2) return parts.pop().split(';').shift();
	return null;
}

function getPlaceIdFromURL() {
	const params = new URLSearchParams(window.location.search);
	return params.get('id');
}

function checkAuthentication() {
	const token = getCookie('token');
	const loginLink = document.getElementById('login-link');

	console.log("Token found?", token);

	if (loginLink) {
		loginLink.style.display = token ? 'none' : 'block';
	}

	if (token && document.getElementById('places-list')) {
		console.log("Token trouvé");
		fetchPlaces(token);
	}
}

function checkAuthenticationRedirect() {
	const token = getCookie('token');
	if (!token) {
		console.log("Non authentifié, redirection vers index...");
		window.location.href = 'index.html';
	}
	console.log("Authentifié, token :", token);
	return token;
}

async function fetchPlaces(token) {
	try {
		const response = await fetch('http://localhost:5000/api/v1/places/', {
			headers: { Authorization: `Bearer ${token}` }
		});

		if (!response.ok) throw new Error('Failed to fetch places');

		const data = await response.json();
		console.log("Places data:", data);

		displayPlaces(data);
		setupPriceFilter(data);
	} catch (error) {
		console.error('Erreur fetch places:', error);
	}
}

function displayPlaces(places) {
	const container = document.getElementById('places-list');
	if (!container) return;
	container.innerHTML = '';

	places.forEach(place => {
		console.log("Place reçue:", place);

		const card = document.createElement('div');
		card.className = 'place-card';
		card.innerHTML = `
			<h2>${place.title}</h2>
			<p>${place.description}</p>
			<p>${place.price} € / nuit</p>
			<a href="place.html?id=${place.id}" class="details-button">Voir détails</a>
		`;
		container.appendChild(card);
	});
}

function setupPriceFilter(places) {
	const filter = document.getElementById('price-filter');
	if (!filter) return;

	filter.addEventListener('change', () => {
		const value = filter.value;
		const filtered = (value === 'all') ? places : places.filter(p => p.price <= parseInt(value));
		displayPlaces(filtered);
	});
}

async function fetchPlaceDetails(placeId, token) {
	try {
		const response = await fetch(`http://localhost:5000/api/v1/places/${placeId}`, {
			headers: token ? { Authorization: `Bearer ${token}` } : {}
		});

		if (!response.ok) throw new Error("Échec de récupération du lieu");

		const place = await response.json();
		console.log("Place récupérée :", place);
		displayPlaceDetails(place);
	} catch (error) {
		console.error("Erreur fetchPlaceDetails:", error);
	}
}

function displayPlaceDetails(place) {
	const section = document.getElementById('place-details');
	if (!section) return;

	section.innerHTML = `
		<h2>${place.title}</h2>
		<p><strong>Description :</strong> ${place.description}</p>
		<p><strong>Prix :</strong> ${place.price} € / nuit</p>
		<p><strong>Latitude :</strong> ${place.latitude}</p>
		<p><strong>Longitude :</strong> ${place.longitude}</p>
	`;

	const addReviewButton = document.getElementById('add-review-button');
	if (addReviewButton) {
		addReviewButton.href = `add_review.html?id=${place.id}`;
	}

	const reviewsSection = document.getElementById('reviews');
	if (reviewsSection && place.reviews && place.reviews.length > 0) {
		reviewsSection.innerHTML = '';
		place.reviews.forEach(review => {
			const card = document.createElement('div');
			card.className = 'review-card';
			card.innerHTML = `
				<p><strong>Utilisateur :</strong> ${review.user_name || 'Anonyme'}</p>
				<p><strong>Commentaire :</strong> ${review.text}</p>
				<p><strong>Note :</strong> ${review.rating} ⭐</p>
			`;
			reviewsSection.appendChild(card);
		});
	}
}
