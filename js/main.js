import variables from "./variables.js";

const {
  selectBox,
} = variables;





selectBox.querySelector('.selectbox__selected').onclick = (event) => {
  selectBox.classList.toggle('open');
  console.log(event.target)
};

selectBox.onclick = (event) => {
  const { target } = event;

  if (target.matches('.selectbox') || target.matches('.selectbox__selected')) {

  }
}
