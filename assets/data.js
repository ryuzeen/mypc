// Setup do ryu. Preços: média de anúncios no Brasil, pesquisa de outubro de 2026.
window.SETUP = {
  priceDate: 'out/2026',
  steam: 'https://steamcommunity.com/id/imryuzeen/',

  pc: [
    {
      id: 'gpu', kind: 'Placa de vídeo', name: 'RTX 4070 Super', brand: 'Gigabyte Windforce OC',
      line: '12 GB GDDR6X', img: 'gpu.webp', tint: '#ff7a2f',
      specs: [['Boost', '2475 MHz'], ['Memória', '12 GB GDDR6X'], ['Barramento', '192 bits'], ['TDP', '220 W']],
      price: 4200, priceNote: 'usada, fora de linha',
      q: 'Gigabyte RTX 4070 Super Windforce OC 12GB',
    },
    {
      id: 'cpu', kind: 'Processador', name: 'Ryzen 7 7700X', brand: 'AMD',
      line: '8 núcleos · 16 threads', img: 'cpu.webp', tint: '#f26b2a',
      specs: [['Núcleos', '8 / 16 threads'], ['Boost', '5,4 GHz'], ['Cache', '40 MB'], ['TDP', '105 W']],
      price: 2600,
      q: 'AMD Ryzen 7 7700X',
    },
    {
      id: 'ram', kind: 'Memória', name: 'Fury Beast 32 GB', brand: 'Kingston',
      line: 'DDR5 5200 MHz · 2 × 16 GB', img: 'ram.webp', tint: '#c9a24a',
      specs: [['Kit', '2 × 16 GB'], ['Tipo', 'DDR5'], ['Frequência', '5200 MHz'], ['Latência', 'CL40']],
      price: 4500, priceNote: 'DDR5 em alta',
      q: 'Kingston Fury Beast 32GB 2x16 DDR5 5200',
    },
    {
      id: 'mobo', kind: 'Placa-mãe', name: 'TUF B650M-Plus WiFi', brand: 'ASUS',
      line: 'Micro ATX · AM5', img: 'mobo.webp', tint: '#e8b43a',
      specs: [['Formato', 'mATX'], ['Soquete', 'AM5'], ['Chipset', 'B650'], ['Rede', 'Wi-Fi 6']],
      price: 1650,
      q: 'ASUS TUF Gaming B650M-Plus WiFi',
    },
    {
      id: 'psu', kind: 'Fonte', name: 'MAG A850GL', brand: 'MSI',
      line: '850 W · 80 Plus Gold', img: 'psu.webp', tint: '#b9bcc4',
      specs: [['Potência', '850 W'], ['Selo', '80 Plus Gold'], ['Cabos', 'Full modular'], ['Padrão', 'ATX 3.0']],
      price: 760,
      q: 'MSI MAG A850GL PCIE5 850W',
    },
    {
      id: 'ssd', kind: 'SSD', name: 'NV2 1 TB', brand: 'Kingston',
      line: 'M.2 NVMe · PCIe 4.0', img: 'ssd.webp', tint: '#3d7fd9',
      specs: [['Leitura', '3500 MB/s'], ['Gravação', '2100 MB/s'], ['Interface', 'PCIe 4.0 x4'], ['Formato', 'M.2 2280']],
      price: 1400,
      q: 'Kingston NV2 1TB NVMe',
    },
    {
      id: 'case', kind: 'Gabinete', name: 'Madness Cube', brand: 'Liketec',
      line: 'Aquário · vidro temperado', img: 'case.webp', tint: '#ff7a2f',
      specs: [['Tipo', 'Aquário'], ['Placa-mãe', 'até mATX'], ['Laterais', 'Vidro temperado'], ['Formato', 'Mid tower']],
      price: 800, priceNote: 'valor pago, fora de linha',
      q: 'Gabinete Liketec Madness Cube',
    },
  ],

  gear: [
    {
      id: 'monitor', kind: 'Monitor', name: 'Agon 24,5"', brand: 'AOC',
      line: '240 Hz · 1080p · 1 ms', img: 'monitor.webp', tint: '#ff6a2a',
      specs: [['Taxa', '240 Hz'], ['Resolução', '1920 × 1080'], ['Resposta', '1 ms'], ['Tamanho', '24,5"']],
      price: 1200,
      q: 'Monitor AOC Agon 24.5 240Hz',
    },
    {
      id: 'mouse', kind: 'Mouse', name: 'Beast X Max', brand: 'WLmouse',
      line: '42 g · magnésio', img: 'mouse.webp', tint: '#8a8f99',
      specs: [['Peso', '42 g'], ['Carcaça', 'Magnésio'], ['Sensor', 'PAW3950'], ['Polling', '8000 Hz']],
      price: 1700,
      q: 'WLmouse Beast X Max',
    },
    {
      id: 'keyboard', kind: 'Teclado', name: 'G Pro X TKL Rapid', brand: 'Logitech',
      line: 'Magnético · rapid trigger', img: 'keyboard.webp', tint: '#4b8cf0',
      specs: [['Switch', 'Magnético analógico'], ['Modo', 'Rapid trigger'], ['Formato', 'TKL'], ['Conexão', 'Cabo']],
      price: 1300,
      q: 'Logitech G Pro X TKL Rapid',
    },
    {
      id: 'headset', kind: 'Headset', name: 'G Pro X 2', brand: 'Logitech',
      line: 'Lightspeed · Bluetooth', img: 'headset.webp', tint: '#9aa0aa',
      specs: [['Drivers', '50 mm grafeno'], ['Conexão', 'Lightspeed / BT'], ['Bateria', 'até 50 h'], ['Mic', 'Destacável']],
      price: 2200,
      q: 'Logitech G Pro X 2 Lightspeed',
    },
    {
      id: 'pad', kind: 'Mousepad', name: 'Kanji 45 × 40', brand: 'Custom',
      line: 'Preto com kanji vermelho · control', img: 'pad.webp', tint: '#e0262b',
      specs: [['Tamanho', '45 × 40 cm'], ['Espessura', '4 mm'], ['Superfície', 'Control']],
      price: 100, priceNote: 'estimado',
      q: 'mousepad kanji 45x40 control',
    },
    {
      id: 'speaker', kind: 'Caixa de som', name: 'M260', brand: 'Edifier',
      line: 'Madeira marrom e preto · Bluetooth', img: 'speaker.webp', tint: '#c0612b',
      specs: [['Potência', '20 W'], ['Conexão', 'Bluetooth 5.0'], ['Bateria', '2500 mAh'], ['Extra', 'Relógio LED']],
      price: 550, priceNote: 'valor pago',
      q: 'Edifier M260 caixa de som marrom',
    },
  ],

  // Guardados ou em uso no trabalho
  extra: [
    {
      id: 'quest', kind: 'VR', name: 'Quest 3S 128 GB', brand: 'Meta',
      line: 'Edição Batman: Arkham Shadow', img: 'quest.webp', tint: '#8fa3c7',
      specs: [['Armazenamento', '128 GB'], ['Chip', 'Snapdragon XR2 Gen 2'], ['RAM', '8 GB'], ['Controles', 'Touch Plus']],
      price: 2800,
      q: 'Meta Quest 3S 128GB Batman Arkham Shadow',
    },
    {
      id: 'iphone', kind: 'Celular', name: 'iPhone 15', brand: 'Apple',
      line: '6,1" · A16 Bionic', img: 'iphone.webp', tint: '#9aa3ad',
      specs: [['Tela', '6,1" Super Retina XDR'], ['Chip', 'A16 Bionic'], ['Câmera', '48 MP'], ['Conector', 'USB-C']],
      price: 4000,
      q: 'iPhone 15',
    },
    {
      id: 'ds4', kind: 'Controle', name: 'DualShock 4', brand: 'Sony',
      line: 'Controle do PS4', img: 'ds4.webp', tint: '#5d7bd9',
      specs: [['Conexão', 'Bluetooth / cabo'], ['Bateria', '1000 mAh'], ['Extras', 'Touchpad, light bar']],
      price: 300,
      q: 'Controle DualShock 4 original',
    },
    {
      id: 'fun68', kind: 'Teclado', name: 'FUN68 HE', brand: 'MonsGeek',
      line: 'Magnético · 68 teclas · cabo', img: 'fun68.webp', tint: '#3fd17a',
      specs: [['Switch', 'Magnético'], ['Rapid trigger', '0,01 mm'], ['Polling', '8000 Hz'], ['Layout', '68 teclas']],
      price: 400,
      q: 'MonsGeek FUN68 HE',
    },
    {
      id: 'mad68', kind: 'Teclado', name: 'MAD 68 HE', brand: 'MADLIONS',
      line: 'Flagship preto · Ultimate Magnet Pro', img: 'mad68.webp', tint: '#e0262b',
      specs: [['Switch', 'Magnético'], ['Polling', '8000 Hz'], ['Layout', '68 teclas'], ['Conexão', 'Cabo']],
      price: 310, priceNote: 'importado',
      q: 'MADLIONS MAD 68 HE',
    },
    {
      id: 'z84', kind: 'Teclado', name: 'Z84', brand: 'E-YOOSO',
      line: 'Low profile · sem fio', img: 'z84.webp', tint: '#c7ccd2',
      specs: [['Conexão', '2.4G / BT / cabo'], ['Bateria', '1600 mAh'], ['Switch', 'Hot-swap'], ['Layout', '84 teclas']],
      price: 200, priceNote: 'importado',
      q: 'E-YOOSO Z84 teclado',
    },
    {
      id: 'riccu', kind: 'Mousepad', name: 'Linhas P&B 45 × 40', brand: 'Riccu',
      line: 'Arte em linhas brancas · bordas costuradas', img: 'riccu.webp', tint: '#d9d9d9',
      specs: [['Tamanho', '45 × 40 cm'], ['Base', 'Borracha'], ['Bordas', 'Costuradas'], ['Estampa', 'Black-8']],
      price: 50, priceNote: 'importado',
      q: 'mousepad black white lines comic girls 400x450',
    },
    {
      id: 'kz', kind: 'Fone', name: 'EDX Pro X', brand: 'KZ',
      line: 'In-ear · com microfone', img: 'kz.webp', tint: '#c49a6c',
      specs: [['Driver', 'Dinâmico'], ['Cabo', 'Destacável'], ['Mic', 'Sim']],
      price: 40, priceNote: 'importado',
      q: 'KZ EDX Pro X',
    },
  ],

  // Faixas de FPS em 1080p tiradas de reviews e calculadoras públicas
  // para a combinação Ryzen 7 7700X + RTX 4070 Super. Não medido neste PC.
  perf: {
    refresh: 240,
    games: [
      { game: 'Valorant', preset: 'alto', min: 460, max: 620 },
      { game: 'Counter-Strike 2', preset: 'alto', min: 300, max: 470 },
      { game: 'Fortnite', preset: 'alto, sem DLSS', min: 170, max: 330 },
      { game: 'Warzone', preset: 'médio', min: 170, max: 225 },
      { game: 'Cyberpunk 2077', preset: 'ultra, sem RT', min: 140, max: 160 },
    ],
    sources: [
      ['pc-builds.com', 'https://pc-builds.com/fps-calculator/result/1je1id01W/ryzen-7-7700x/geforce-rtx-4070-super/valorant/'],
      ['technical.city', 'https://technical.city/en/gpu/GeForce-RTX-4070-SUPER'],
      ['theframecoach.com', 'https://theframecoach.com/best-settings/nvidia-rtx-4070-super/cyberpunk-2077'],
    ],
  },
};

window.SETUP.fmt = (n) => 'R$ ' + n.toLocaleString('pt-BR');
window.SETUP.search = (q) => 'https://www.google.com/search?q=' + encodeURIComponent(q);
window.SETUP.total = (list) => list.reduce((s, i) => s + i.price, 0);
