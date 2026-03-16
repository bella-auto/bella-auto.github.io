const fs = require('fs');
const path = require('path');

// Читаем файл generic.txt
const genericPath = path.join(__dirname, 'generic.txt');
const genericContent = fs.readFileSync(genericPath, 'utf-8');

// Разбиваем на строки и фильтруем пустые
const items = genericContent
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);

console.log(`Загружено ${items.length} позиций из generic.txt`);

// Группируем по первой букве
const itemsByLetter = {};
items.forEach(item => {
    const firstLetter = item[0].toUpperCase();
    if (!itemsByLetter[firstLetter]) {
        itemsByLetter[firstLetter] = [];
    }
    itemsByLetter[firstLetter].push(item);
});

// Генерируем HTML
let html = '';

// Генерируем элементы для каждой буквы
Object.keys(itemsByLetter).sort().forEach(letter => {
    itemsByLetter[letter].forEach(item => {
        html += `                    <div class="product-item" data-letter="${letter}">\n`;
        html += `                        <span class="product-name">${item}</span>\n`;
        html += `                    </div>\n`;
    });
});

console.log('HTML сгенерирован');
console.log(`Буквы: ${Object.keys(itemsByLetter).sort().join(', ')}`);
console.log('\nСохраняем в products-generated.html...');

// Сохраняем результат
fs.writeFileSync(
    path.join(__dirname, 'products-generated.html'),
    html,
    'utf-8'
);

console.log('✅ Готово! Скопируйте содержимое products-generated.html в index.html');
console.log(`   Вставьте между <div class="products-list" id="productsList"> и </div>`);
