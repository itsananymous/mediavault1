// Basic data and UI for renting books (anonymous: no visible titles or prices)
const books = [
  {id:1,title:"Wuthering Heights"}, 
  {id:2,title:"Sherlock Holmes"},
   {id:3,title:"Anna Karenina"}, 
   {id:4,title:"House of Sky and Breath"},
    {id:5,title:"The Secret History"},
  {id:6,title:"1984"},
   {id:7,title:"Caravel"}, 
   {id:8,title:"1Two Twisted Crowns"},
    {id:9,title:"The Priority of the orange tree"},
];



const rented = new Set();

function renderBooks(filter=''){
  const grid = document.getElementById('books-grid');
  const q = filter.trim().toLowerCase();
 const items = books.filter(b=>{
  if(!q) return true;

  return (
    b.title.toLowerCase().includes(q) ||
    String(b.id).includes(q)
  );
});

  grid.innerHTML = items.map(b=>`
    <article class="card" data-id="${b.id}" aria-label="Book ${b.id}">
      <div class="glow"></div>
      <div class="cover" data-id="${b.id}">
        <div class="title-snip"></div>
      </div>
      <div class="meta" aria-hidden="true">
        <div class="author"></div>
        <div class="price"></div>
      </div>
      <button class="rent ${rented.has(b.id)?'rented':''}">${rented.has(b.id)?'Rented':'Rent'}</button>
    </article>
  `).join('');

  // attempt to populate each cover with an image from the images/ folder
  const tryExtensions = ['png','webp','jpg','jpeg','svg'];
  function setCoverImage(cover, id){
    const base = `images/${id}`;
    let found = false;
    for(const ext of tryExtensions){
      const url = `${base}.${ext}`;
      const img = new Image();
      img.onload = ()=>{
        if(found) return; found = true;
        cover.style.background = `url("${url}") center/cover no-repeat, linear-gradient(135deg, rgba(123,92,255,0.95), rgba(110,240,255,0.85))`;
      };
      img.onerror = ()=>{};
      img.src = url;
    }
  }
  grid.querySelectorAll('.cover').forEach(c=>{
    const id = c.dataset.id || c.closest('.card')?.dataset.id;
    if(id) setCoverImage(c,id);
  });

  // attach listeners
  grid.querySelectorAll('.rent').forEach(btn=>{
    btn.onclick = e=>{
      const card = e.target.closest('.card');
      const id = Number(card.dataset.id);
      if(rented.has(id)) rented.delete(id); else rented.add(id);
      updateRentalUI();
      renderBooks(document.getElementById('search').value);
    }
    // keyboard support: Enter/Space to toggle rent
    btn.addEventListener('keydown', ev=>{
      if(ev.key==='Enter' || ev.key===' '){ ev.preventDefault(); btn.click(); }
    });
  });
}

function updateRentalUI(){
  document.getElementById('rental-count').textContent = rented.size;
}

document.addEventListener('DOMContentLoaded', ()=>{
  const search = document.getElementById('search');
  search.addEventListener('input', ()=>renderBooks(search.value));
  document.getElementById('view-rentals').addEventListener('click', ()=>{
    if(rented.size===0){
      alert('You have no rentals yet.');
      return;
    }
    alert(`You have ${rented.size} rented book(s).`);
  });
  renderBooks();
  updateRentalUI();
});
