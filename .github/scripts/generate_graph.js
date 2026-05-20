const fs = require('fs');

// Las rutas son relativas a la raíz del repositorio porque 
// GitHub Actions ejecuta el comando 'node' desde allí.
const readmePath = './README.md';
const svgPath = './progreso.svg';

try {
  // 1. Leer el contenido del README.md
  const readmeContent = fs.readFileSync(readmePath, 'utf8');

  // 2. Contar los checkboxes del Roadmap
  // Busca coincidencias de "- [ ]" (pendiente) y "- [x]" (completado)
  const totalTasks = (readmeContent.match(/- \[[x ]\]/gi) || []).length;
  const completedTasks = (readmeContent.match(/- \[x\]/gi) || []).length;

  // 3. Calcular el porcentaje (evitando división por cero)
  const percentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  // 4. Matemáticas para dibujar el anillo de progreso en SVG
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  // Calculamos cuánto del círculo debe quedar "vacío"
  const offset = circumference - (percentage / 100) * circumference;

  // 5. Plantilla del archivo SVG con los colores de tu perfil
  const svgContent = `
  <svg width="200" height="200" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="${radius}" fill="transparent" stroke="#323330" stroke-width="10" />
    <circle cx="50" cy="50" r="${radius}" fill="transparent" stroke="#007ACC" stroke-width="10" stroke-dasharray="${circumference}" stroke-dashoffset="${offset}" transform="rotate(-90 50 50)" stroke-linecap="round" />
    <text x="50" y="50" font-family="Inter, Arial, sans-serif" font-size="18" font-weight="bold" fill="#007ACC" text-anchor="middle" dy="6">${percentage}%</text>
  </svg>
  `;

  // 6. Guardar la imagen física en la raíz del repositorio
  fs.writeFileSync(svgPath, svgContent.trim());
  console.log(`✅ Gráfica generada con éxito: ${percentage}% completado.`);

} catch (error) {
  console.error('❌ Error generando la gráfica:', error);
  process.exit(1);
}