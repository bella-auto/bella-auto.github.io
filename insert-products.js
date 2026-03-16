const fs = require('fs');
const path = require('path');

// Читаем index.html
const indexPath = path.join(__dirname, 'index.html');
let indexContent = fs.readFileSync(indexPath, 'utf-8');

// Читаем сгенерированные товары
const productsPath = path.join(__dirname, 'products-generated.html');
const productsHtml = fs.readFileSync(productsPath, 'utf-8');

// Находим и заменяем содержимое между <div class="products-list" и следующим </div>
const startMarker = '<div class="products-list" id="productsList">';
const endMarker = '</div>\n            </div>\n        </div>\n    </section>\n\n    <!-- Info Section -->';

const startIndex = indexContent.indexOf(startMarker);
if (startIndex === -1) {
    console.error('❌ Не найден маркер начала списка товаров');
    process.exit(1);
}

const searchFrom = startIndex + startMarker.length;
const endIndex = indexContent.indexOf(endMarker, searchFrom);
if (endIndex === -1) {
    console.error('❌ Не найден маркер конца списка товаров');
    process.exit(1);
}

// Создаем новое содержимое
const before = indexContent.substring(0, startIndex + startMarker.length);
const after = indexContent.substring(endIndex);

const newContent = before + '\n' + productsHtml + '                ' + after;

// Сохраняем обновленный index.html
fs.writeFileSync(indexPath, newContent, 'utf-8');

console.log('✅ Товары успешно добавлены в index.html');
console.log(`   Добавлено товаров: ${productsHtml.split('product-item').length - 1}`);
