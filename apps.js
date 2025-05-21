let extras = [
    {
      id: 1,
      categoria: 'Bebidas',
      nome: 'Coca',
      volume: '1L',
      preco: 8.00,
      imagem: 'https://upload.wikimedia.org/wikipedia/commons/6/69/Coca-Cola_can_355ml.jpg'
    },
    {
      id: 2,
      categoria: 'Bebidas',
      nome: 'Antártica',
      volume: '1L',
      preco: 7.00,
      imagem: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/Guarana_antarctica.jpg'
    },
  ];
  
  let filter = 'Todos';
  
  function renderExtras() {
    const list = document.getElementById('extras-list');
    list.innerHTML = '';
  
    const filtered = filter === 'Todos' ? extras : extras.filter(e => e.categoria === filter);
  
    filtered.forEach(extra => {
      const div = document.createElement('div');
      div.className = 'extra-card';
  
      div.innerHTML = `
        <div class="extra-info">
          <strong>${extra.nome}</strong><br>
          <small>${extra.volume}</small><br>
          <b>R$ ${extra.preco.toFixed(2)}</b><br>
          <button onclick="editExtra(${extra.id})">Editar</button>
          <button onclick="deleteExtra(${extra.id})">Excluir</button>
        </div>
        <div class="extra-image" style="background-image: url('${extra.imagem || ''}')"></div>
      `;
  
      list.appendChild(div);
    });
  }
  
  function filterCategory(cat) {
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');
    filter = cat;
    renderExtras();
  }
  
  function addExtra() {
    const nome = prompt('Nome do item:');
    const volume = prompt('Volume/descrição:');
    const preco = parseFloat(prompt('Preço:'));
    const categoria = prompt('Categoria (Bebidas, Ingredientes, Batatinhas):');
    const imagem = prompt('URL da imagem (https://...):');
  
    if (nome && volume && preco && categoria) {
      extras.push({
        id: Date.now(),
        nome,
        volume,
        preco,
        categoria,
        imagem
      });
      renderExtras();
    }
  }
  
  function editExtra(id) {
    const extra = extras.find(e => e.id === id);
    if (!extra) return;
  
    const nome = prompt('Novo nome:', extra.nome);
    const volume = prompt('Nova descrição:', extra.volume);
    const preco = parseFloat(prompt('Novo preço:', extra.preco));
    const categoria = prompt('Nova categoria:', extra.categoria);
    const imagem = prompt('Nova URL da imagem:', extra.imagem);
  
    if (nome && volume && preco && categoria) {
      extra.nome = nome;
      extra.volume = volume;
      extra.preco = preco;
      extra.categoria = categoria;
      extra.imagem = imagem;
      renderExtras();
    }
  }
  
  function deleteExtra(id) {
    if (confirm('Deseja excluir este item?')) {
      extras = extras.filter(e => e.id !== id);
      renderExtras();
    }
  }
  
  document.addEventListener('DOMContentLoaded', renderExtras);
  