let missions = [
    {
        id: 1,
        name: "Apollo 11",
        agency: "NASA",
        objective: "Premier alunissage habité",
        launchDate: "1969-07-16",
        image: "images/apollo11.jpg"
    },
    {
        id: 2,
        name: "Voyager 1",
        agency: "NASA",
        objective: "Exploration du système solaire externe",
        launchDate: "1977-09-05",
        image: "images/voyager1.jpg"
    },
    {
        id: 3,
        name: "Rosetta",
        agency: "ESA",
        objective: "Étude de la comète 67P/Churyumov-Gerasimenko",
        launchDate: "2004-03-02",
        image: "images/rosetta.jpg"
    },
    {
        id: 4,
        name: "Curiosity",
        agency: "NASA",
        objective: "Exploration du cratère Gale sur Mars",
        launchDate: "2011-11-26",
        image: "images/curiosity.jpg"
    },
    {
        id: 5,
        name: "Artemis I",
        agency: "NASA",
        objective: "Test du système de lancement SLS et d'Orion",
        launchDate: "2022-11-16",
        image: "images/artemis1.jpg"
    },
    {
        id: 6,
        name: "James Webb Space Telescope",
        agency: "NASA/ESA/CSA",
        objective: "Observation de l'univers primitif",
        launchDate: "2021-12-25",
        image: "images/jwst.jpg"
    },
    {
        id: 7,
        name: "BepiColombo",
        agency: "ESA/JAXA",
        objective: "Exploration de la planète Mercure",
        launchDate: "2018-10-20",
        image: "images/bepicolombo.jpg"
    }
];

// Variables globales
let favorites = JSON.parse(localStorage.getItem('all-fav')) || [];
let myMissions = JSON.parse(localStorage.getItem('myMissions')) || [];
let currentTab = 'kolchi';
let currentEditId = null;

// Initialisation
document.addEventListener('DOMContentLoaded', function () {
// window.addEventListener('load', function () {
    // initializeApp();
    Filtrage();
    renderMissions();
    populateYearFilter();
});

// Initialisation de l'application
// function initializeApp() {
//     // Utiliser des images de remplacement si les images originales ne sont pas disponibles
//     missions.forEach(mission => {
//         if (!mission.image || mission.image.startsWith('images/')) {
//             mission.image = getPlaceholderImage(mission.name);
//         }
//     });
// }

// Configuration des écouteurs d'événements


// function Filtrage() {

//     document.getElementById('missionSearch').addEventListener('input', filterMissions);
//     document.getElementById('agencyFilter').addEventListener('change', filterMissions);
//     document.getElementById('yearFilter').addEventListener('change', filterMissions);

    
//     // document.querySelectorAll('.tab').forEach(tab => {
//     //     tab.addEventListener('click', function () {
//     //         switchTab(this.dataset.tab);
//     //     });
//     // });

//     // Bouton d'ajout de mission
   
//     document.querySelectorAll('.tab').forEach((tab, index) => {
//         tab.addEventListener('click', function() {
//             const tabNames = ['all', 'favorites', 'notreMission'];
//             switchTab(tabNames[index]);
//         });
//     });

//     document.getElementById('ajout').addEventListener('click', openAddModal);

//     // Modal
//     document.getElementById('closeModal').addEventListener('click', closeModal);
//     document.getElementById('cancelBtn').addEventListener('click', closeModal);
//     document.getElementById('missionForm').addEventListener('submit', saveMission);

//     // Fermer le modal en cliquant à l'extérieur
//     document.getElementById('missionModal').addEventListener('click', function (e) {
//         if (e.target === this) {
//             closeModal();
//         }
//     });
// }

function Filtrage() {

    document.getElementById('missionSearch').addEventListener('input', filterMissions);
    document.getElementById('agencyFilter').addEventListener('change', filterMissions);
    document.getElementById('yearFilter').addEventListener('change', filterMissions);

    
    document.querySelectorAll('.tab')[0].addEventListener('click', () => switchTab('kolchi'));
    document.querySelectorAll('.tab')[1].addEventListener('click', () => switchTab('fav'));
    document.querySelectorAll('.tab')[2].addEventListener('click', () => switchTab('notreMission'));

    
    document.getElementById('ajout').addEventListener('click', openAddModal);

   
    document.getElementById('closeModal').addEventListener('click', closeModal);
    document.getElementById('cancelBtn').addEventListener('click', closeModal);
    document.getElementById('missionForm').addEventListener('submit', saveMission);
}

// Rendu des missions
function renderMissions(filteredMissions = null) {
    const missionGrid = document.getElementById('missionGrid');
    const noMissions = document.getElementById('noMissions');

    let missionsToRender = filteredMissions || getCurrentMissions();

    if (missionsToRender.length === 0) {
        missionGrid.style.display = 'none';
        noMissions.style.display = 'block';
        return;
    }

    missionGrid.style.display = 'grid';
    noMissions.style.display = 'none';

    missionGrid.innerHTML = '';

    missionsToRender.forEach(mission => {
        const missionCard = createMissionCard(mission);
        missionGrid.appendChild(missionCard);
    });
}

// Création d'une carte de mission
function createMissionCard(mission) {
    const card = document.createElement('div');
    card.className = 'mission-card';
    card.dataset.id = mission.id;

    const isFavorite = favorites.includes(mission.id);
    const isMyMission = myMissions.some(m => m.id === mission.id);

    const launchDate = new Date(mission.launchDate);
    const formattedDate = launchDate.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    card.innerHTML = `
                <img class="mission-card-image" src="${mission.image}" alt="${mission.name}">
                <div class="mission-card-content">
                    <div class="mission-card-agency">${mission.agency}</div>
                    <h3 class="mission-card-title">${mission.name}</h3>
                    <p class="mission-card-objective">${mission.objective}</p>
                    <p class="mission-card-date">Lancé le ${formattedDate}</p>
                    <div class="mission-card-actions">
                        <a class="mission-card-link" href="#">En savoir plus</a>
                        <button class="favorite-btn ${isFavorite ? 'active' : ''}" data-id="${mission.id}">
                            ${isFavorite ? '❤️' : '🤍'}
                        </button>
                    </div>
                    ${isMyMission ? `
                        <div class="mission-card-actions" style="margin-top: 1rem;">
                            <button class="btn btn-secondary edit-mission" data-id="${mission.id}">Modifier</button>
                            <button class="btn btn-danger delete-mission" data-id="${mission.id}">Supprimer</button>
                        </div>
                    ` : ''}
                </div>
            `;

    // Ajouter les écouteurs d'événements
    const favoriteBtn = card.querySelector('.favorite-btn');
    favoriteBtn.addEventListener('click', toggleFavorite);

    if (isMyMission) {
        const editBtn = card.querySelector('.edit-mission');
        const deleteBtn = card.querySelector('.delete-mission');

        editBtn.addEventListener('click', function () {
            openEditModal(mission.id);
        });

        deleteBtn.addEventListener('click', function () {
            deleteMission(mission.id);
        });
    }

    return card;
}

// Obtenir les missions actuelles selon l'onglet actif
function getCurrentMissions() {
    switch (currentTab) {
        case 'fav':
            return missions.filter(mission => favorites.includes(mission.id));
        case 'notreMission':
            return myMissions;
        default:
            return missions;
    }
}


function switchTab(tabName) {
    currentTab = tabName;
    
    // Mettre à jour l'interface
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    if (tabName === 'kolchi') document.querySelectorAll('.tab')[0].classList.add('active');
    if (tabName === 'fav') document.querySelectorAll('.tab')[1].classList.add('active');
    if (tabName === 'notreMission') document.querySelectorAll('.tab')[2].classList.add('active');
    
    renderMissions();
}

// Filtrer les missions
function filterMissions() {
    const barRecherche = document.getElementById('missionSearch').value.toLowerCase();
    const agencyFilter = document.getElementById('agencyFilter').value;
    const yearFilter = document.getElementById('yearFilter').value;

    let filteredMissions = getCurrentMissions();

    // Filtrer par recherche
    if (barRecherche) {
        filteredMissions = filteredMissions.filter(mission =>
            mission.name.toLowerCase().includes(barRecherche) ||
            mission.agency.toLowerCase().includes(barRecherche) ||
            mission.objective.toLowerCase().includes(barRecherche)
        );
    }

    // Filtrer par agence
    if (agencyFilter) {
        filteredMissions = filteredMissions.filter(mission =>
            mission.agency.includes(agencyFilter)
        );
    }

    // Filtrer par année
    if (yearFilter) {
        filteredMissions = filteredMissions.filter(mission => {
            const missionYear = new Date(mission.launchDate).getFullYear().toString();
            return missionYear === yearFilter;
        });
    }

    renderMissions(filteredMissions);
}

// Basculer le statut favori
function toggleFavorite(e) {
    const missionId = parseInt(e.target.dataset.id);
    const index = favorites.indexOf(missionId);

    if (index === -1) {
        favorites.push(missionId);
        e.target.classList.add('active');
        e.target.innerHTML = '❤️';
    } else {
        favorites.splice(index, 1);
        e.target.classList.remove('active');
        e.target.innerHTML = '🤍';
    }

    // Sauvegarder dans le localStorage
    localStorage.setItem('all-fav', JSON.stringify(favorites));

    // Si on est dans l'onglet favoris, re-rendre
    if (currentTab === 'fav') {
        renderMissions();
    }
}

// Ouvrir le modal d'ajout
function openAddModal() {
    document.getElementById('modalTitle').textContent = 'Ajouter une mission';
    document.getElementById('missionForm').reset();
    document.getElementById('missionId').value = '';
    currentEditId = null;

    // Réinitialiser les erreurs
    document.querySelectorAll('.error-message').forEach(error => {
        error.style.display = 'none';
    });
    document.querySelectorAll('.form-input').forEach(input => {
        input.classList.remove('error');
    });

    document.getElementById('missionModal').style.display = 'flex';
}

// Ouvrir le modal d'édition
function openEditModal(missionId) {
    const mission = myMissions.find(m => m.id === missionId);
    if (!mission) return;

    document.getElementById('modalTitle').textContent = 'Modifier la mission';
    document.getElementById('missionId').value = mission.id;
    document.getElementById('missionName').value = mission.name;
    document.getElementById('missionAgency').value = mission.agency;
    document.getElementById('missionObjective').value = mission.objective;
    document.getElementById('missionDate').value = mission.launchDate;
    document.getElementById('missionImage').value = mission.image;

    currentEditId = missionId;

    // Réinitialiser les erreurs
    document.querySelectorAll('.error-message').forEach(error => {
        error.style.display = 'none';
    });
    document.querySelectorAll('.form-input').forEach(input => {
        input.classList.remove('error');
    });

    document.getElementById('missionModal').style.display = 'flex';
}

// Fermer le modal
function closeModal() {
    document.getElementById('missionModal').style.display = 'none';
}

// Sauvegarder une mission
function saveMission(e) {
    e.preventDefault();

    // Validation
    const name = document.getElementById('missionName').value.trim();
    const agency = document.getElementById('missionAgency').value;
    const objective = document.getElementById('missionObjective').value.trim();
    const date = document.getElementById('missionDate').value;
    const image = document.getElementById('missionImage').value.trim();

    let isValid = true;

    // Valider le nom
    if (!name) {
        document.getElementById('nameError').style.display = 'block';
        document.getElementById('missionName').classList.add('error');
        isValid = false;
    } else {
        document.getElementById('nameError').style.display = 'none';
        document.getElementById('missionName').classList.remove('error');
    }

    // Valider l'agence
    if (!agency) {
        document.getElementById('agencyError').style.display = 'block';
        document.getElementById('missionAgency').classList.add('error');
        isValid = false;
    } else {
        document.getElementById('agencyError').style.display = 'none';
        document.getElementById('missionAgency').classList.remove('error');
    }

    // Valider l'objectif
    if (!objective) {
        document.getElementById('objectiveError').style.display = 'block';
        document.getElementById('missionObjective').classList.add('error');
        isValid = false;
    } else {
        document.getElementById('objectiveError').style.display = 'none';
        document.getElementById('missionObjective').classList.remove('error');
    }

    // Valider la date
    if (!date) {
        document.getElementById('dateError').style.display = 'block';
        document.getElementById('missionDate').classList.add('error');
        isValid = false;
    } else {
        document.getElementById('dateError').style.display = 'none';
        document.getElementById('missionDate').classList.remove('error');
    }

    // Valider l'image
    if (!image) {
        document.getElementById('imageError').style.display = 'block';
        document.getElementById('missionImage').classList.add('error');
        isValid = false;
    } else {
        document.getElementById('imageError').style.display = 'none';
        document.getElementById('missionImage').classList.remove('error');
    }

    if (!isValid) return;

    // Créer l'objet mission
    const mission = {
        id: currentEditId || Date.now(),
        name,
        agency,
        objective,
        launchDate: date,
        image: image || getPlaceholderImage(name)
    };

    // Ajouter ou mettre à jour
    if (currentEditId) {
        // Mettre à jour
        const index = myMissions.findIndex(m => m.id === currentEditId);
        if (index !== -1) {
            myMissions[index] = mission;
        }
    } else {
        // Ajouter
        myMissions.push(mission);
    }

    // Sauvegarder dans le localStorage
    localStorage.setItem('myMissions', JSON.stringify(myMissions));

    // Fermer le modal et re-rendre
    closeModal();

    // Si on est dans l'onglet "Mes missions", re-rendre
    if (currentTab === 'notreMission') {
        renderMissions();
    }
}

// Supprimer une mission
function deleteMission(missionId) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette mission ?')) {
        return;
    }

    // Retirer des favoris si présent
    const favIndex = favorites.indexOf(missionId);
    if (favIndex !== -1) {
        favorites.splice(favIndex, 1);
        localStorage.setItem('all-fav', JSON.stringify(favorites));
    }

    // Retirer de mes missions
    myMissions = myMissions.filter(m => m.id !== missionId);
    localStorage.setItem('myMissions', JSON.stringify(myMissions));

    // Re-rendre
    if (currentTab === 'notreMission') {
        renderMissions();
    }
}

// Remplir le filtre d'années
function populateYearFilter() {
    const yearFilter = document.getElementById('yearFilter');

    // Obtenir toutes les années uniques des missions
    const allYears = [...missions, ...myMissions]
        .map(mission => new Date(mission.launchDate).getFullYear())
        .filter((year, index, self) => self.indexOf(year) === index)
        .sort((a, b) => b - a);

    // Ajouter les options
    allYears.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearFilter.appendChild(option);
    });
}

// Obtenir une image de remplacement
// function getPlaceholderImage(missionName) {
//     return `https://via.placeholder.com/400x200/1f2937/15ff00?text=${encodeURIComponent(missionName)}`;
// }
