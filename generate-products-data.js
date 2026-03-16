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

console.log(`📦 Загружено ${items.length} позиций из generic.txt`);

// Группируем по первой букве
const itemsByLetter = {};
items.forEach(item => {
    const firstLetter = item[0].toUpperCase();
    if (!itemsByLetter[firstLetter]) {
        itemsByLetter[firstLetter] = [];
    }
    itemsByLetter[firstLetter].push(item);
});

// Сортируем буквы
const sortedLetters = Object.keys(itemsByLetter).sort();

console.log(`🔤 Найдено ${sortedLetters.length} уникальных букв`);
console.log(`   Буквы: ${sortedLetters.join(', ')}`);

// Генерируем JS-файл с данными
const jsContent = `/**
 * Ассортимент товаров и услуг магазина "БЭЛЛА-АВТО"
 * Автоматически сгенерировано из generic.txt
 * Дата генерации: ${new Date().toLocaleString('ru-RU')}
 */

// Полный список товаров и услуг (${items.length} позиций)
const PRODUCTS_DATA = ${JSON.stringify(items, null, 2)};

// Данные, сгруппированные по буквам для быстрого поиска
const PRODUCTS_BY_LETTER = ${JSON.stringify(itemsByLetter, null, 2)};

// Список доступных букв
const AVAILABLE_LETTERS = ${JSON.stringify(sortedLetters, null, 2)};

// Статистика
const PRODUCTS_STATS = {
    total: ${items.length},
    letters: ${sortedLetters.length},
    byLetter: {
${sortedLetters.map(letter => `        '${letter}': ${itemsByLetter[letter].length}`).join(',\n')}
    }
};

// Экспорт для использования в других скриптах
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        PRODUCTS_DATA,
        PRODUCTS_BY_LETTER,
        AVAILABLE_LETTERS,
        PRODUCTS_STATS
    };
}
`;

// Сохраняем файл
const outputPath = path.join(__dirname, 'products-data.js');
fs.writeFileSync(outputPath, jsContent, 'utf-8');

console.log('\n✅ Файл products-data.js успешно создан!');
console.log(`   Путь: ${outputPath}`);
console.log(`\n📊 Статистика по буквам:`);

sortedLetters.forEach(letter => {
    const count = itemsByLetter[letter].length;
    const bar = '█'.repeat(Math.ceil(count / 20));
    console.log(`   ${letter}: ${count.toString().padStart(4, ' ')} ${bar}`);
});

console.log(`\n🎯 Следующий шаг: добавьте в index.html перед script.js:`);
console.log(`   <script src="products-data.js"></script>`);
