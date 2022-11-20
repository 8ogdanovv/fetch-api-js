const root = document.getElementById('root');

const base_url = 'https://rickandmortyapi.com/api/character/';
const input = document.getElementById('search-input');
input.autocomplete = 'off';
input.placeholder = 'character id number (1-826)';
const search = document.getElementById('search-btn');
search.addEventListener('click', search_function);
const load_more_button = document.querySelector('.load-more');
const images_div = document.getElementById('characters-wrap');
images_div.addEventListener('click', make_removable);

function make_removable(event) {
    let removable_image = event.target;
    removable_image.classList.add('removable');
    let before_remove_storage = JSON.parse(localStorage.getItem('storage_array'));
    let before_remove_counter = JSON.parse(localStorage.getItem('counter_array'));
    let id_to_remove = before_remove_counter.indexOf(removable_image.id);
    if (window.confirm('Do you really want to remove this search result image?')) {
        before_remove_storage.splice(id_to_remove, 1);
        before_remove_counter.splice(id_to_remove, 1);
        localStorage.removeItem('storage_array');
        localStorage.removeItem('counter_array');
        localStorage.setItem('storage_array', JSON.stringify(before_remove_storage));
        localStorage.setItem('counter_array', JSON.stringify(before_remove_counter));
    }
    location.reload();
}

if (!localStorage.getItem('counter')) {
    let counter = 5;
    localStorage.setItem('counter', counter);
}

if (!localStorage.getItem('counter_array')) {
    let counter_array = [];
    localStorage.setItem('counter_array', JSON.stringify(counter_array));
}

function load_more_button_show() {
    if (!localStorage.getItem('storage_array') || JSON.parse(localStorage.getItem('storage_array')).length <= 5) {
        load_more_button.classList.add('hide');
        load_more_button.removeEventListener('click', load_more_five);
    } else if (JSON.parse(localStorage.getItem('storage_array')).length > 5) {
        load_more_button.classList.remove('hide');
        load_more_button.addEventListener('click', load_more_five);
    }
}

load_more_button_show();
let counter = parseInt(localStorage.getItem('counter'), 10);
show_images(counter);

function search_function() {
    let id = input.value;
    let search_url = base_url + id;
    fetch(search_url)
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                alert('Character not found');
            }
        })
        .then((json) => {
            let res = json['image'];
            image_insert(res, id);
        });
}

function image_insert(image_href, image_id) {
    let counter_array = JSON.parse(localStorage.getItem('counter_array'));
    let result_obj = {};
    result_obj[`${image_id}`] = `${image_href}`;
    if (counter_array && counter_array.length !== 0 && counter_array.includes(image_id)) {
        alert('Character is already in the list');
    } else {
        counter_array.push(image_id);
        localStorage.removeItem('counter_array');
        localStorage.setItem('counter_array', JSON.stringify(counter_array));
        if (!localStorage.getItem('storage_array')) {
            let results_arr = [];
            results_arr.push(result_obj);
            localStorage.setItem('storage_array', JSON.stringify(results_arr));
        } else if (localStorage.getItem('storage_array')) {
            let results_arr = JSON.parse(localStorage.getItem('storage_array'));
            results_arr.push(result_obj);
            localStorage.removeItem('storage_array');
            localStorage.setItem('storage_array', JSON.stringify(results_arr));
        }
    }
    load_more_button_show();
    let counter = parseInt(localStorage.getItem('counter'), 10);
    show_images(counter);
}

function load_more_five() {
    if (localStorage.getItem('counter') && localStorage.getItem('counter_array')) {
        let counter_array_length = JSON.parse(localStorage.getItem('counter_array')).length;
        let counter = parseInt(localStorage.getItem('counter'), 10);
        if (counter < counter_array_length) {
            counter += 5;
            localStorage.removeItem('counter');
            localStorage.setItem('counter', counter);
        }
    }
    let counter = parseInt(localStorage.getItem('counter'), 10);
    show_images(counter);
    window.scrollTo(0, document.body.scrollHeight);
}

function show_images(counter) {
    images_div.innerHTML = '';
    if (localStorage.getItem('storage_array') && localStorage.getItem('counter_array')) {
        let counter_array = JSON.parse(localStorage.getItem('counter_array'));
        let storage_array = JSON.parse(localStorage.getItem('storage_array'));
        for (let i = 0; i < counter_array.length; i++) {
            let image = document.createElement('img');
            image.src = storage_array[i][counter_array[i]];
            image.alt = 'image';
            image.id = `${counter_array[i]}`;
            if (i < counter_array.length - counter) {
                image.classList.add('hide');
            }
            images_div.prepend(image);
        }
    }
}