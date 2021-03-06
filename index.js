const reddit = {
    search : function(searchTerm, searchLimit, sortBy){
       return fetch(`https://www.reddit.com/search.json?q=${searchTerm}&sort=${sortBy}&limit=${searchLimit}`)
          .then(res => res.json())
          .then(data => data.data.children.map(data=> data.data))
          .catch(err => console.log(err));
          
    }
}




const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
console.log('loaded')
searchForm.addEventListener('submit', e => {
    e.preventDefault();
    console.log('ok')
    const searchTerm = searchInput.value;
    const sortBy = document.querySelector('input[name="sortby"]:checked').value;
    const searchLimit = document.getElementById('limit').value;

    if(searchTerm === ''){
        showMessage('Please add a search term', 'alert-danger');
        return;
    } 

    searchInput.value = '';

    reddit.search(searchTerm, searchLimit, sortBy)
      .then(results => {
          let output = '<div class="card-columns">';
          results.forEach(post => {
              let image = post.preview ? post.preview.images[0].source.url : "https://assets.ifttt.com/images/channels/1352860597/icons/on_color_large.png";
              output += `
              <div class="card" >
              <img class="card-img-top" src="${image}" alt="Card image cap">
              <div class="card-body">
                <h5 class="card-title">${post.title}</h5>
                <p class="card-text">${ truncateText(post.selftext,100)}</p>
                <a href="${post.url}" target="_blank" class="btn btn-primary">Read More</a>
                <span class="badge badge-secondary">Subreddit: ${post.subreddit} </span>
                <span class="badge badge-dark">Score: ${post.score} </span>
              </div>
            </div>
              `
          })
          output += "</div>";
          document.getElementById('results').innerHTML = output;
      })
   
});

function showMessage(message, className){
    const div = document.createElement('div');
    div.className = `alert ${className}`;
    div.appendChild(document.createTextNode(message));

    const searchContainer = document.getElementById('search-container');
    const search = document.getElementById('search');

    searchContainer.insertBefore(div, search);

    setTimeout(()=>document.querySelector('.alert').remove(), 3000);
}

function truncateText(text, limit){
    const shortened = text.indexOf(' ', limit);
    if(shortened == -1) return text;
    return text.substring(0, shortened);

}