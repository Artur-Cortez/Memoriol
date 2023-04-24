dropdown = document.getElementsByClassName('dropdown')[0];

dropdown_content = document.getElementsByClassName('dropdown-content')[0];

dropdown_button = document.getElementsByClassName('dropwdown-button')[0];

dropdown_button.addEventListener('click', function(){
    console.log('a')
    dropdown_content.style.display = 'block';
})