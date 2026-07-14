const li = document.querySelector(`ul`);
const fragment = document.createDocumentFragment();

for (let i = 0; i < 10; i++) {
  const liElement = document.createElement(`li`);
  liElement.textContent = `Elemento ${i + 1}`;
  fragment.appendChild(liElement);
}
li.appendChild(fragment);